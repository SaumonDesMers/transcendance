import { reactive } from 'vue'
import { Socket, io } from 'socket.io-client'
import {
	ServerToClientEvents,
	ClientToServerEvents,
	playerStatus,
	updateDTO,
} from '../entities/status.events';

class statusClient {
	private _usersStatus: Map<number, playerStatus>;
	private _socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	constructor() {
		this._usersStatus = reactive (new Map());
		this._socket = io('http://localhost:3001/status', {
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

	getUserStatus(userId: number){
		let status = this._usersStatus.get(userId);
		if (status == undefined)
		{
			// this.fetchUsers([{id: userId}]);
			return 'OFFLINE';
		}
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

	fetchUsers(users: {id: number}[])
	{
		console.log("fetching users ", users);
		users.forEach((user: {id: number}) => {
			this._socket.emit('getStatus', user.id, (status: playerStatus) => {
					this._usersStatus.set(user.id, status);
			})
		})
	}

	get usersMap() {return this._usersStatus;}

	private initSocket()
	{
		

		this._socket.on('update', (payload: updateDTO) => {
			if (payload.status == playerStatus.OFFLINE)
				this._usersStatus.delete(payload.userId);
			else
				this._usersStatus.set(payload.userId, payload.status);
		})
	}
}

export default reactive<statusClient>(new statusClient());
