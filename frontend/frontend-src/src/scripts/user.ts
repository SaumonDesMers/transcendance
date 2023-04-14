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

	imageBase64: string;

	upload() {

	}

	download() {

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

}