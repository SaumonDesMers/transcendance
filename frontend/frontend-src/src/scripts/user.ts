import axios from 'axios'
import { reactive } from 'vue'
import { Socket, io } from 'socket.io-client'
import {
	ServerToClientEvents,
	ClientToServerEvents,
	updateDTO,
} from '../../../../backend/backend-src/src/status/status.events';

enum playerStatus {
	ONLINE,
	OFFLINE,
	IN_GAME
}

class UserData {

	id: number;
	username: string;
	darkMode: boolean;
	isTwoFactorAuthenticationEnabled: boolean;
	coa: string;
	bio: string;
}

class FriendData extends UserData {
	avatar: Avatar;
	constructor() {
		super();
		this.avatar = reactive(new Avatar());
	}
}

class statusClient {
	private _friendsStatus: Map<number, playerStatus>;
	private _socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	constructor() {
		this._friendsStatus = reactive (new Map());
		this.initSocket();
	}

	connect(jwt: string) {
		console.log("status client connecting");
		this._socket.io.opts.extraHeaders = {
			authorization: `Bearer ${jwt}`
		};
		this._socket.connect();
	}

	getFriendStatus(userId: number){
		let status = this._friendsStatus.get(userId);
		if (status == undefined)
			return 'OFFLINE';
		switch (status)
		{
		case playerStatus.ONLINE:
			return "ONLINE";
		case playerStatus.OFFLINE:
			return "OFFLINE";
		case playerStatus.IN_GAME:
			return "IN GAME";
		}
	}

	get friendsMap() {return this._friendsStatus;}

	set friends(users: {id: number}[])
	{
		this._friendsStatus.clear();
		users.forEach((user: {id: number}) => {
			this._friendsStatus.set(user.id, playerStatus.OFFLINE);
		});
		this.fetchFriendsStatus();
	}

	addFriend(userId: number)
	{
		this._friendsStatus.set(userId, playerStatus.OFFLINE);
		this._socket.emit('getStatus', userId, (stat: playerStatus) => {
			this._friendsStatus.set(userId, stat);
		})
	}

	removeFriend(userId: number)
	{
		this._friendsStatus.delete(userId);
	}

	private fetchFriendsStatus()
	{
		this._friendsStatus.forEach( (stat: playerStatus, userId: number) => {
			this._socket.emit('getStatus', userId, (stat: playerStatus) => {
				this._friendsStatus.set(userId, stat);
			})
		});
	}

	private initSocket()
	{
		this._socket = io('http://localhost:3001/status', {
			autoConnect: false
		});

		this._socket.on('update', (payload: updateDTO) => {
			if (this._friendsStatus.has(payload.userId))
				this._friendsStatus.set(payload.userId, payload.status);
		})
	}
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

	private _data: UserData;
	friends: FriendData[];
	private _friendsStatus: statusClient;

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

	getFriendStatus(userId: number) {return this._friendsStatus.getFriendStatus(userId);}

	constructor() {
		this._data = new UserData();
		this.avatar = new Avatar();
		this._friendsStatus = new statusClient();
		this.friends = reactive(new Array<FriendData>());
	}

	set(newData: any) {
		for (const key in newData) {
			if (key == 'picture')
				this.avatar.fileName = newData[key];
			else if (key == 'following') {
				console.log(newData[key]);
				this._friendsStatus.friends = newData[key];
			} else
				this[key] = newData[key];
		}
	}

	async login(jwt: string) {
		let data: any = null;
		let error: any = null;

		this._friendsStatus.connect(jwt);
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
			this._friendsStatus.addFriend(res.data);
		})
		.catch(err => {
			console.log('err :', err);
		})
	}

	async removeFriend(userId: number) {
		axios.delete(`http://localhost:3001/users/${this.id}/friends/${userId}`)
		.then(res => {
			this._friendsStatus.removeFriend(userId);
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

	async loadFriends() {
		this.friends = [];
		this._friendsStatus.friendsMap.forEach((stat: playerStatus, id: number) => {
			axios.get(`http://localhost:3001/users/${id}`)
			.then(res => {
				let friend: FriendData;

				friend = new FriendData();
				for (const key in res.data) {
					if (key == 'picture')
						friend.avatar.fileName = res.data[key];
					else
						friend[key] = res.data[key];
				}
				if (friend.avatar.fileName != undefined) {
					axios.get(`http://localhost:3001/${friend.avatar.fileName}`, {
					responseType: 'blob'
					})
					.then(res => {
						friend.avatar.setFile(res.data);
					})
				}
				console.log(friend);
				this.friends.push(friend);
			})
			.catch(err => {
				console.log('err :', err);
			});
		})
	}
}

export default reactive<User>(new User());
