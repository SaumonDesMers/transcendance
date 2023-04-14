import axios from 'axios'

export class User {

	id: number;
	username: string;
	darkMode: boolean;
	isTwoFactorAuthenticationEnabled: boolean;
	coa: string;
	bio: string;

	constructor() {
		this.localGet();
	}

	set(newData: any) {
		for (const key in newData)
			this[key] = newData[key];
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
		localStorage.user = JSON.stringify(this);
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
				// console.log(res);
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

		await axios.patch(`http://localhost:3001/users/${this.id}`, this)
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