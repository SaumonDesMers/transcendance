import { Channel, Mute } from '@prisma/client';
import { MessageDTO,
	joinRequestDTO,
	adminRequestDTO,
	ChannelDTO,
	ChatUserDTO,
	MuteDTO,
 } from './Chat.entities'
import { CreateMessageDto } from './message.create.dto'

export interface InterServerEvents {
	ping: () => void;
}

export interface ServerToClientEvents {
	noArg: () => void;

	message: (message: MessageDTO) => void;

	/*
	 * GLOBAL CHANNEL EVENTS
	 *	THESE EVENTS ARE SENT TO A WHOLE CHANNEL 
	 * 	AS INFORMATION
	 */
	unset_admin: (payload: adminRequestDTO) => void;

	set_admin: (payload: adminRequestDTO) => void;

	join_room: (payload: Channel) => void;

	mute: (payload: MuteDTO) => void;

	/*
	* DIRECT EVENTS
	*/
	user_join_room: (payload: Channel) => void;
}

export interface ClientToServerEvents {
	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	join_room: (channelName: string) => void;

	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	leave_room: (channelName: string) => void;

	// /**
	//  * event emitted when a client wants to
	//  * create a new channel
	//  */
	// create_room: (channel: ) => void;

	/**
	 * event for the client to request its
	 * corresponding user object
	 */
	get_user: (callback: (user: ChatUserDTO) => void) => void;


	start_dm: (targetUserId: string) => void;

	/**
	 * event to send a message to the chat
	 */
	send_message: (message: CreateMessageDto) => void;


	set_admin_request: (request: adminRequestDTO) => void;

	unset_admin_request: (request: adminRequestDTO) => void;

	mute_request: (request: MuteDTO) => void;

}

export interface SocketData {
	userId: number,
}
