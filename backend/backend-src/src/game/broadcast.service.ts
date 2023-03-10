import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io'

@Injectable()
export class BroadcastService {

	server: Server;

	to(roomName: string, event: string, data?: any) {
		this.server.to(roomName).emit(event, data);
	}

	function(roomName: string) {
		return (event: string, data: any) => {
			this.server.to(roomName).emit(event, data);
		}
	}

}