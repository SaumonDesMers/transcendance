import { Channel, DMChannel, Mute } from '@prisma/client';
import { MessageDTO,
	joinRequestDTO,
	adminRequestDTO,
	ChannelDTO,
	ChatUserDTO,
	MuteDTO,
	GroupChannelDTO,
	JoinDTO,
	ChanRequestDTO,
	basicChanRequestDTO,
	inviteUpdateDTO,
	InviteRequestDTO,
	ChatUserUpdateDTO,
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

	// user_unset_admin: (payload: adminRequestDTO) => void;

	// user_set_admin: (payload: adminRequestDTO) => void;

	admin_update: (payload: ChanRequestDTO) => void;

	invite_update: (payload: inviteUpdateDTO) => void;

	user_joined_room: (payload: JoinDTO) => void;

	user_left_room: (payload: JoinDTO) => void;

	user_muted: (payload: MuteDTO) => void;

	user_kicked: (payload: basicChanRequestDTO) => void;

	user_banned: (paylaod: basicChanRequestDTO) => void;

	/*
	* DIRECT EVENTS
	*
	* those are sent directly to a client from the server
	*/
	dm_starting: (payload: ChannelDTO) => void;

	exception: (payload: any) => void;

	user_update: (payload: ChatUserUpdateDTO) => void;
}

export interface ClientToServerEvents {
	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	join_channel: (request: joinRequestDTO, callback: (channel: GroupChannelDTO) => void) => void;

	/**
	 * event emitted when a client wants to
	 * leave a channel
	 */
	leave_channel: (channelId: number) => void;

	// /**
	//  * event emitted when a client wants to
	//  * create a new channel
	//  */
	create_channel: (channel: CreateGroupChannelDto, callback: (channel: GroupChannelDTO) => void) => void;

	/**
	 * event for the client to request its
	 * corresponding user object
	 */
	get_my_user: (callback: (user: ChatUserDTO) => void) => void;

	get_other_user: (userId: number, callback: (user: ChatUserDTO) => void) => void;

	get_groupchannels: (callback: (channels: GroupChannelDTO[]) => void) => void;

	get_invites: (callback: (invites: inviteUpdateDTO[]) => void) => void;

	start_dm: (targetUserId: number, callback: (payload: ChannelDTO) => void) => void;

	/**
	 * event to send a message to the chat
	 */
	send_message: (message: CreateMessageDto) => void;


	admin_request: (request: ChanRequestDTO) => void;

	invite_request: (request: InviteRequestDTO) => void;
	
	visibility_request: (request: ChanRequestDTO) => void;
	
	kick_request: (request: basicChanRequestDTO) => void;

	ban_request: (request: ChanRequestDTO) => void;

	mute_request: (request: MuteDTO) => void;
}

export interface SocketData {
	userId: number,
}
