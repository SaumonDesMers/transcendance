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

	private _data: UserData;
	avatar: Avatar;
	isLoggedIn: boolean = false;

	get id() { return this._data.id; }
	get username() { return this._data.username; }
	get darkMode() { return this._data.darkMode; }
	get isTwoFactorAuthenticationEnabled() { return this._data.isTwoFactorAuthenticationEnabled; }
	get coa() { return this._data.coa; }
	get bio() { return this._data.bio; }

	set id(arg) { this._data.id = arg; localStorage.userId = arg; }
	set username(arg) { this._data.username = arg; }
	set darkMode(arg) { this._data.darkMode = arg; }
	set isTwoFactorAuthenticationEnabled(arg) { this._data.isTwoFactorAuthenticationEnabled = arg; }
	set coa(arg) { this._data.coa = arg; }
	set bio(arg) { this._data.bio = arg; }


	constructor() {
		this._data = new UserData();
		this.avatar = new Avatar();
	}

	set(newData: any) {
		for (const key in newData) {
			if (key == 'picture')
				this.avatar.fileName = newData[key];
			else
				this[key] = newData[key];
		}
	}

	async login(jwt: string) {

		let o = {
			data: null,
			error: null
		};

		await axios.get('http://localhost:3001/auth/user', {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
			.then(res => {
				axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				if (res.data == '' || res.data == '2fa') {
					o.data = res.data;
				} else {
					this.set(res.data);
					this.isLoggedIn = true;
				}
			})
			.catch(err => {
				o.error = err;
			})
		
		return o;
	}

	async get(userId: number) {
		axios.get(`http://localhost:3001/users/${userId}`)
			.then(res => {
				this.set(res.data);
				this.isLoggedIn = true;
			})
			.catch(err => {
				console.log('err :', err);
			})
	}

	logout() {
		delete localStorage.userId;
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
			console.log('res :', res);
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
}

export default reactive<User>(new User());