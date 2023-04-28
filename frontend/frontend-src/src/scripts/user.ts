import axios from 'axios'

class UserData {

	id: number;
	username: string;
	darkMode: boolean;
	isTwoFactorAuthenticationEnabled: boolean;
	coa: string;
	bio: string;
}

class Avatar {

	imageBase64: any;
	imageFile: any;

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

	get id() { return this._data.id; }
	get username() { return this._data.username; }
	get darkMode() { return this._data.darkMode; }
	get isTwoFactorAuthenticationEnabled() { return this._data.isTwoFactorAuthenticationEnabled; }
	get coa() { return this._data.coa; }
	get bio() { return this._data.bio; }

	set id(arg) { this._data.id = arg; this.localSave(); }
	set username(arg) { this._data.username = arg; this.localSave(); }
	set darkMode(arg) { this._data.darkMode = arg; this.localSave(); }
	set isTwoFactorAuthenticationEnabled(arg) { this._data.isTwoFactorAuthenticationEnabled = arg; this.localSave(); }
	set coa(arg) { this._data.coa = arg; this.localSave(); }
	set bio(arg) { this._data.bio = arg; this.localSave(); }


	constructor() {
		this._data = new UserData();
		this.avatar = new Avatar();
		this.localGet();
	}

	set(newData: any) {
		for (const key in newData) {
			this[key] = newData[key];
		}
		this.localSave();
	}

	isLog() {
		return !!localStorage.user;
	}

	localGet() {
		if (localStorage.user) {
			const newData = JSON.parse(localStorage.user);
			for (const key in newData)
				this[key] = newData[key];
		}
	}

	localSave() {
		localStorage.user = JSON.stringify(this._data);
	}

	async login(jwt: string) {

		let ret = {
			_data: null,
			error: null
		};

		axios.get('http://localhost:3001/auth/user', {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
			.then(res => {
				// console.log('_data :', res.data);
				axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				if (res.data == '' || res.data == '2fa') {
					ret._data = res.data;
				} else {
					this.set(res.data);
				}
			})
			.catch(err => {
				ret.error = err;
			})
		
		return ret;
	}

	logout() {
		delete localStorage.user;
	}

	async save(): Promise<{ success: boolean, error: any }> {
		this.localGet();

		let success: boolean = false;
		let error: any = null;

		await axios.patch(`http://localhost:3001/users/${this.id}`, this._data)
		.then(res => {
			success = true;
			// this.set(res.data);
		})
		.catch(err => {
			success = false;
			error = err;
		});

		return { success, error };
	}

	uploadAvatar() {
		var formData = new FormData();
		formData.append("image", this.avatar.imageFile);
		axios.post(`http://localhost:3001/users/image/${this.id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	downloadAvatar() {
		axios.get(`http://localhost:3001/users/image/${this.id}`)
		.then(res => {
			console.log('res :', res);
			this.avatar.setFile(res.data);
		})
		.catch(err => {
			console.log('err :', err);
		});
	}

}