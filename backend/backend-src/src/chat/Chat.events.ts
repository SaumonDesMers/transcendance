import { Channel, DMChannel, Mute } from '@prisma/client';
import { MessageDTO,
	joinRequestDTO,
	ChannelDTO,
	ChatUserDTO,
	MuteDTO,
	GroupChannelDTO,
	ChanRequestDTO,
	basicChanRequestDTO,
	inviteUpdateDTO,
	ChanTypeRequestDTO,
	GroupChannelSnippetDTO,
	SimpleChatUserDTO,
	NewChannelOwnerDTO,
	ChanKeyRequestDTO,
	DMChannelDTO,
	CreateMessageDto,
	ChanNotifDTO,
 } from './Chat.entities'
import { CreateGroupChannelDto } from './GroupChannel.create.dto';

export interface InterServerEvents {
	ping: () => void;
}

export interface ServerToClientEvents {
	noArg: () => void;

	
	/*
	 * GLOBAL CHANNEL EVENTS
	*	THESE EVENTS ARE SENT TO A WHOLE CHANNEL 
	* 	AS INFORMATION
	*/
	
	// user_unset_admin: (payload: adminRequestDTO) => void;
	
	// user_set_admin: (payload: adminRequestDTO) => void;
	/** 
	 * Event containing a message that has been sent to a channel
	*/
	message: (message: MessageDTO) => void;

	/**
	 * Notice of a new admin or demoted admin in a channel
	 */
	admin_update: (payload: ChanNotifDTO) => void;

	/**
	 * Notice that you have been invited to a channel
	 */
	invite_update: (payload: inviteUpdateDTO) => void;

	/**
	 * Notice of channel type change ( public, private, key )
	 * of a channel you have currently joined
	 */
	chan_type_update: (payload: ChanTypeRequestDTO) => void;

	chan_deleted: (channelId: number) => void;
	/**
	 * Notice of owner change of a channel you have currently joined
	 */
	owner_update: (payload: ChanNotifDTO) => void;

	/**
	 * Notice of user join/leave in a channel you have currently joined
	 */
	user_joined_room: (payload: ChanNotifDTO) => void;

	user_left_room: (payload: ChanNotifDTO) => void;

	/**
	 * Notice of user kick in a channel you have currently joined
	 * no need to store this,
	 * might be you
	 */
	user_kicked: (payload: ChanNotifDTO) => void;

	/**
	 * Notice of user muted in a channel you have currently joined,
	 * dont have to store this,
	 * might be you
	 */
	user_muted: (payload: MuteDTO) => void;

	/**
	 * Notice of user banned or unbanned in a channel you have currently joined,
	 * might be you
	 */
	user_banned: (payload: ChanNotifDTO) => void;

	/*
	* DIRECT EVENTS
	*
	* those are sent directly to a client from the server
	*/
	dm_starting: (payload: DMChannelDTO) => void;

	exception: (payload: any) => void;

	/**
	 * if a user changes username,
	 * this will be sent to everyone so they can keep track of usernames
	 */
	user_update: (userId: number) => void;

	/**
	 * when an invite expires,
	 * this will be sent to every client on the channel
	 * so they can remove the invite
	 */
	game_invite_expire: (payload: MessageDTO) => void;

	/**
	 * this is to create a live array of public channels,
	 * if add is true, new public channel appeared
	 * if add if false, channel is no longer public/existant
	 */
	public_chans: (payload: {channels: GroupChannelSnippetDTO[], add: boolean}) => void;
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

	/**
	 * Request to get info about a user ( username, profile ) with its id
	 */
	get_other_user: (userId: number, callback: (user: ChatUserDTO) => void) => void;

	/**
	 * Request to get the channels that the caller is currently in
	 */
	get_groupchannels: (callback: (channels: GroupChannelDTO[]) => void) => void;

	/**
	 * request to 
	 */
	get_dmchannels: (callback: (channels: DMChannelDTO[]) => void) => void;

	/**
	 *Request to get a list of current public channels 
	 */
	get_public_channels: (callback: (channels: GroupChannelSnippetDTO[]) => void) => void;

	search_username: (username: string, callback: (users: {username: string, id: number}[]) => void ) => void;

	// get_invites: (callback: (invites: inviteUpdateDTO[]) => void) => void;

	start_dm: (targetUserName: string, callback: (payload: DMChannelDTO) => void) => void;

	/**
	 * event to send a message to the chat
	 */
	send_message: (message: CreateMessageDto) => void;

	send_game_invite: (message: CreateMessageDto) => void;
	
	/**
	 * Request to set/unset someone admin in a channel
	 */
	admin_request: (request: ChanRequestDTO) => void;

	/**
	 * Request to invite/uninvite someone in a channel
	 */
	invite_request: (request: ChanRequestDTO) => void;
	
	/**
	 * Request to change Type of a channel ( private, public, key)
	 */
	chan_type_request: (request: ChanTypeRequestDTO) => void;


	chan_key_request: (request: ChanKeyRequestDTO) => void;
	
	/**
	 * Request to kick user from channel
	 */
	kick_request: (request: basicChanRequestDTO) => void;

	/**
	 * Request to ban/unban user from channel
	 */
	ban_request: (request: ChanRequestDTO) => void;

	/**
	 * Request to Mute user in a channel
	 */
	mute_request: (request: MuteDTO) => void;

	/**
	 * Request to accept an invite made by another player in the chat 
	 */
	accept_game_invite: (msg: MessageDTO) => void;

	block_request: (data: {targetUserId: number, action: boolean}, callback: (userId: number) => void) => void;
}


export interface SocketData {
	userId: number,
}
