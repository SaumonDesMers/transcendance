import { Channel, Mute } from '@prisma/client';
import { MessageDTO,
	joinRequestDTO,
	adminRequestDTO,
	ChannelDTO,
	ChatUserDTO,
	MuteDTO,
	GroupChannelDTO,
	JoinDTO,
 } from './Chat.entities'
import { CreateMessageDto } from './message.create.dto'
import { CreateGroupChannelDto } from './GroupChannel.create.dto';

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

	user_unset_admin: (payload: adminRequestDTO) => void;

	user_set_admin: (payload: adminRequestDTO) => void;

	user_joined_room: (payload: JoinDTO) => void;

	user_muted: (payload: MuteDTO) => void;

	/*
	* DIRECT EVENTS
	*/
}

export interface ClientToServerEvents {
	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	join_channel: (channelName: string, callback: (ChannelDTO)) => void;

	/**
	 * event emitted when a client wants to
	 * leave a channel
	 */
	leave_channel: (channelName: string, callback : () =>void) => void;

	// /**
	//  * event emitted when a client wants to
	//  * create a new channel
	//  */
	create_room: (channel: CreateGroupChannelDto, callback: (GroupChannelDTO) => void) => void;

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
