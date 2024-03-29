import axios from 'axios'
import { reactive } from 'vue'



class UserData {
	id: number;
	username: string;
	darkMode: boolean;
	isTwoFactorAuthenticationEnabled: boolean;
	coa: string;
	bio: string;

	constructor() {
		this.id = -1;
		this.username = "";
		this.darkMode = false;
		this.isTwoFactorAuthenticationEnabled = false;
		this.coa = "";
		this.bio = "";
	}
}

class GameData {
	winnerScore: number;
	LoserScore: number;

	winnerId: number;
	loserId: number;

	constructor() {
		this.winnerScore = 0;
		this.LoserScore = 0;
		this.winnerId = 0;
		this.loserId = 0;
	}
}

class StatsData {
	GamesWon: number;
	GamesLost: number;

	rank: number;

	constructor() {
		this.GamesWon = 0;
		this.GamesLost = 0;
		this.rank = 0;
	}
}

export class Avatar {

	fileName: string;
	imageFile: any;
	imageBase64: any;

	constructor() {
		this.fileName = "";
		this.imageFile = null;
		this.imageBase64 = "";
	}

	clear() {
		this.fileName = "";
		this.imageFile = "";
		this.imageBase64 = "";
	}

	async setFile(imageFile: any) {
		this.imageFile = imageFile;

		await this.getBase64(imageFile);

		this.squareAndResize(this, 200, 200);
	}

	async getBase64(imageFile: any) {
		const reader = new FileReader();
		let source = await new Promise(resolve => {
			reader.onload = ev => {
				resolve(ev.target?.result);
			};
			reader.readAsDataURL(imageFile);
		});

		this.imageBase64 = source;
	}

	squareAndResize(avatar: Avatar, wantedWidth: number, wantedHeight: number) {
		var img = document.createElement('img');

		img.onload = function() {
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			canvas.width = wantedWidth;
			canvas.height = wantedHeight;

			let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

			if (sWidth > sHeight) {
				sWidth = sHeight;
				sx = (img.width - sWidth) / 2;
			} else if (sWidth < sHeight) {
				sHeight = sWidth;
				sy = (img.height - sHeight) / 2;
			}

			ctx?.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, wantedWidth, wantedHeight);

			var dataURI = canvas.toDataURL();

			avatar.imageBase64 = dataURI;
		};

		img.src = avatar.imageBase64;
	}
}



export class User {

	[key: string]: any;

	_data: UserData;
	_friendsIdList: {id: number}[];
	friends: User[];
	history: GameData[];
	stats: StatsData;

	avatar: Avatar;
	isLoggedIn: boolean = false;
	HistoryLoaded: boolean = false;
	StatsLoaded: boolean = false;

	get id() { return this._data.id; }
	get username() { return this._data.username; }
	get darkMode() { return this._data.darkMode; }
	get isTwoFactorAuthenticationEnabled() { return this._data.isTwoFactorAuthenticationEnabled; }
	get coa() { return this._data.coa; }
	get bio() { return this._data.bio; }

	set id(arg: number) { this._data.id = arg; }
	set username(arg: string) { this._data.username = arg; }
	set darkMode(arg: boolean) { this._data.darkMode = arg; }
	set isTwoFactorAuthenticationEnabled(arg: boolean) { this._data.isTwoFactorAuthenticationEnabled = arg; }
	set coa(arg: string) { this._data.coa = arg; }
	set bio(arg: string) { this._data.bio = arg; }

	constructor() {
		this._data = new UserData();
		this.avatar = new Avatar();
		this.friends = reactive(new Array<User>());
		this._friendsIdList = new Array();
		this.history = reactive(new Array());
		this.stats = new StatsData;
	}

	set(newData: any) {
		for (const key in newData) {
			if (key == 'picture')
				this.avatar.fileName = newData[key];
			else if (key == 'following')
				this._friendsIdList = newData[key];
			else
				this[key] = newData[key];
		}
	}

	async loadUser(userId: number) {
		this.avatar.clear();
		this._friendsIdList = [];
		this.friends = [];
		this.history = [];
		await axios.get(`http://localhost:3001/users/${userId}`, {
				params: {
					includeFriends: true
				}
			})
			.then(res => {
				this.isLoggedIn = true;
				this.set(res.data);
				this.downloadAvatar();
				}
			)
			.catch(err => {
				console.log('err :', err);
			});
	}

	async downloadAvatar() {
		if (!this.avatar.fileName) {
			// console.log('downloadAvatar: no avatar to download')
			return;
		}

		await axios.get(`http://localhost:3001/${this.avatar.fileName}`, {
			responseType: 'blob'
		})
		.then(res => {
			this.avatar.setFile(res.data);
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	async loadHistory() {
		if (this.id == null) {
			console.log("Empty User Object")
			return;
		}
		
		this.HistoryLoaded = false;
		axios.get(`http://localhost:3001/games/user-history/${this.id}`, {
			params: {
				take: 10
			}
		})
		.then(res => {
			this.history = res.data;
			this.HistoryLoaded = true;
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	async loadStats() {
		if (this.id == null) {
			console.log("Empty User Object")
			return;
		}

		this.StatsLoaded = false;
		axios.get(`http://localhost:3001/games/user-stat/${this.id}`)
		.then(res => {
			this.stats.rank = res.data.rank;
			this.stats.GamesLost = res.data._count.losingGames;
			this.stats.GamesWon = res.data._count.winningGames;
			this.StatsLoaded = true;
		})
		.catch(err => {
			console.log('err :', err);
		});
	}
}

export class MyUser extends User
{
	constructor()
	{
		super();
	}

	get id() { this._data.id = parseInt(localStorage.userId); return this._data.id; }
	set id(arg) { this._data.id = arg; localStorage.userId = arg; }


	async login(jwt: string) {
		let data: any = null;
		let error: any = null;

		await axios.get('http://localhost:3001/auth/user', {
				headers: {
					Authorization: `Bearer ${jwt}`
				},
				params: {
					includeMembers: true
				}
			})
			.then(res => {
				axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				if (res.data == '' || res.data == '2fa') {
					data = res.data;
				} else {
					this.isLoggedIn = true;
					this.set(res.data);
					this.downloadAvatar();
				}
			})
			.catch(err => {
				error = err;
			})
		
		return { data, error };
	}

	async save(): Promise<{ success: boolean, error: any }> {
		let success: boolean = false;
		let error: any = null;

		await axios.patch(`http://localhost:3001/users/${this.id}`, this._data)
		.then(res => {
			this.set(res.data);
			success = true;
		})
		.catch(err => {
			success = false;
			error = err;
		});

		return { success, error };
	}

	async get() {
		await axios.get(`http://localhost:3001/users/${this.id}`)
		.then(res => {
			this.isLoggedIn = true;
			this.set(res.data);
			this.downloadAvatar();
		})
		.catch(err => {
			throw err;
		});
	}

	async uploadAvatar() {
		if (!this.avatar.imageFile) {
			console.log('uploadAvatar: no avatar to upload')
			return;
		}

		var formData = new FormData();
		formData.append("image", this.avatar.imageFile);
		await axios.put(`http://localhost:3001/users/${this.id}/image`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(res => {
			this.avatar.fileName = res.data.picture;
		})
		.catch(err => {
			console.log('err :', err.code, err.message);
		});
	}

	async deleteAvatar() {

		axios.delete(`http://localhost:3001/users/${this.id}/image`)
		.then(res => {
			this.set(res.data);
			this.downloadAvatar();
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	async addFriend(username: string) {
		axios.post(`http://localhost:3001/users/${this.id}/friends`, {friendUserName: username})
		.then(res => {
			this.loadUser(this.id);
		})
		.catch(err => {
			console.log('err :', err);
		})
	}

	async removeFriend(userId: number) {
		axios.delete(`http://localhost:3001/users/${this.id}/friends/${userId}`)
		.then(res => {
			this.loadUser(this.id);
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	isFriend(userId: number): boolean {
		return this._friendsIdList.find(user => {
			return user.id == userId;
		}) != undefined;
	}
}

export default reactive<MyUser>(new MyUser());
