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

	set(newData: any): void {
		for (const key in newData)
			this[key] = newData[key];
	}

	localGet(): any {
		const data = JSON.parse(localStorage.user);
		this.set(data);
	}

	localSave() {
		localStorage.user = JSON.stringify(this);
	}

	async save(): Promise<{ success: boolean, error: any }> {
		this.localSave();

		let success: boolean = false;
		let error: any = null;

		await axios.put(`http://localhost:3001/users/${this.id}`, this)
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