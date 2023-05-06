import axios from 'axios'
import { reactive } from 'vue'



class UserData {
	id: number;
	username: string;
	darkMode: boolean;
	isTwoFactorAuthenticationEnabled: boolean;
	coa: string;
	bio: string;
}

class Avatar {

	fileName: string;
	imageFile: any;
	imageBase64: any;

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

	_data: UserData;
	_friendsIdList: {id: number}[];
	friends: User[];

	avatar: Avatar;
	isLoggedIn: boolean = false;

	get id() { return this._data.id; }
	get username() { return this._data.username; }
	get darkMode() { return this._data.darkMode; }
	get isTwoFactorAuthenticationEnabled() { return this._data.isTwoFactorAuthenticationEnabled; }
	get coa() { return this._data.coa; }
	get bio() { return this._data.bio; }

	set id(arg) { this._data.id = arg; }
	set username(arg) { this._data.username = arg; }
	set darkMode(arg) { this._data.darkMode = arg; }
	set isTwoFactorAuthenticationEnabled(arg) { this._data.isTwoFactorAuthenticationEnabled = arg; }
	set coa(arg) { this._data.coa = arg; }
	set bio(arg) { this._data.bio = arg; }

	constructor() {
		this._data = new UserData();
		this.avatar = new Avatar();
		this.friends = reactive(new Array<User>());
		this._friendsIdList = new Array();
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
			console.log('downloadAvatar: no avatar to download')
			return;
		}

		axios.get(`http://localhost:3001/${this.avatar.fileName}`, {
			responseType: 'blob'
		})
		.then(res => {
			this.avatar.setFile(res.data);
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	async loadFriends() {
		if (this.id != null) {
			await this.loadUser(this.id);
			this.friends = [];
			this._friendsIdList.forEach((user: {id: number}) => {
				let friend: User;

				friend = reactive(new User());
				friend.loadUser(user.id);
				this.friends.push(friend);
			})
		}
	}
}

export class MyUser extends User
{
	constructor()
	{
		super();
	}

	get id() { this._data.id = localStorage.userId; return this._data.id; }
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
			console.log('err :', err);
		});
	}

	async uploadAvatar() {
		if (!this.avatar.imageFile) {
			console.log('uploadAvatar: no avatar to upload')
			return;
		}

		var formData = new FormData();
		formData.append("image", this.avatar.imageFile);
		axios.put(`http://localhost:3001/users/${this.id}/image`, formData, {
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
		if (!this.avatar.fileName) {
			console.log('deleteAvatar: no avatar to delete')
			return;
		}

		axios.delete(`http://localhost:3001/users/${this.id}/image`)
		.then(res => {
			console.log('res :', res);
			this.avatar.fileName = '';
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	async addFriend(username: string) {
		axios.post(`http://localhost:3001/users/${this.id}/friends`, {username})
		.then(res => {
			console.log('res :', res);
		})
		.catch(err => {
			console.log('err :', err);
		})
	}

	async removeFriend(userId: number) {
		axios.delete(`http://localhost:3001/users/${this.id}/friends/${userId}`)
		.then(res => {
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

}

export default reactive<MyUser>(new MyUser());
