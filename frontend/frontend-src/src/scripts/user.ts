import axios from 'axios'

class UserData {

	id: number;
	username: string;
	darkMode: boolean;
	isTwoFactorAuthenticationEnabled: boolean;
	coa: string;
	bio: string;
}
export class User {

	private data: UserData;

	get id() { return this.data.id; }
	get username() { return this.data.username; }
	get darkMode() { return this.data.darkMode; }
	get isTwoFactorAuthenticationEnabled() { return this.data.isTwoFactorAuthenticationEnabled; }
	get coa() { return this.data.coa; }
	get bio() { return this.data.bio; }

	set id(arg) { this.data.id = arg; this.localSave(); }
	set username(arg) { this.data.username = arg; this.localSave(); }
	set darkMode(arg) { this.data.darkMode = arg; this.localSave(); }
	set isTwoFactorAuthenticationEnabled(arg) { this.data.isTwoFactorAuthenticationEnabled = arg; this.localSave(); }
	set coa(arg) { this.data.coa = arg; this.localSave(); }
	set bio(arg) { this.data.bio = arg; this.localSave(); }

	constructor() {
		this.data = new UserData();
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
		localStorage.user = JSON.stringify(this.data);
	}

	async login(jwt: string) {

		let ret = {
			data: null,
			error: null
		};

		axios.get('http://localhost:3001/auth/user', {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
			.then(res => {
				// console.log('data :', res.data);
				axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				if (res.data == '' || res.data == '2fa') {
					ret.data = res.data;
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

		await axios.patch(`http://localhost:3001/users/${this.id}`, this.data)
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