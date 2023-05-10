import { User } from './user'
import { reactive } from 'vue';
import { Socket, io } from 'socket.io-client';

export class UserPrison {
	users: Map<number, User>;
	_socket: Socket;

	constructor()
	{
		this.users = reactive(new Map())
		this._socket = io('http://localhost:3001/updates', {
			autoConnect: false,
			reconnection: false
		});
		this.initSocket();
	}

	connect(jwt: string) {
		if (this._socket.connected)
			return;
		this._socket.io.opts.extraHeaders = {
			authorization: `Bearer ${jwt}`,
			sessionId: localStorage.sessionId
		};
		this._socket.connect();
	}

	disconnect() {
		this._socket.disconnect();
	}

	getUserName(id: number): string {
		const ret = this.getUser(id).username;

		if (ret == undefined)
			return "loading";
		return ret;
	}

	getUser(id: number): User
	{
		const ret = this.users.get(id);

		if (ret != undefined)
			return ret;
		return this.addUserId(id);
	}

	addUser(user: User)
	{
		this.users.set(user.id, user);
	}
	
	addUserId(id: number): User
	{
		let new_user = reactive(new User());
		this.users.set(id, new_user);
		new_user.loadUser(id).then( nothing => {
			new_user.downloadAvatar();
		});
		return new_user;
	}

	addUserIds(userIds: number[])
	{
		userIds.forEach((id: number) =>
		{
			this.addUserId(id);
		})
	}

	addUsers(users: User[])
	{
		users.forEach((user: User) => {
			this.addUser(user);
		})
	}

	initSocket()
	{
		this._socket.on("user_update", (id: number ) => {
			let user = this.users.get(id);
			if (user != undefined)
			{
				user.loadUser(user.id).then ( nothing => {
					user?.downloadAvatar();
				});
			}
		})
	}
}

export default reactive<UserPrison>(new UserPrison);
