import axios from 'axios'

class API {

	url = 'http://localhost:3001/';
	static jwt = '';

	async login(jwt) {
		let response = {};
		await axios.get(this.url + 'auth/user', {
			headers: {
				Authorization : `Bearer ${jwt}`
			}
		})
		.then(res => {
			response.data = res.data;
			this.jwt = jwt;
			localStorage.jwt = jwt;
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
		})
		.catch(err => {
			response.err = err.message;
		})
		return response;
	}

}

export let api = new API();