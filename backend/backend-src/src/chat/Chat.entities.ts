import { ChanType } from "@prisma/client"


/**
 * TRANSFER OBJECTS
 * 
 * These interface represent how objects like channels or users
 * are transfered over the network
 * and stored in the client
 */

export interface GameInvite {
	status: 'PENDING' | 'EXPIRED';
	type: 'CUSTOM' | 'NORMAL';
	uid: number;
}

export interface MessageDTO {
	id: number,
	channelId: number,
	content: string,
	author: SimpleChatUserDTO,
	postedAt: Date,
	gameInvite?: GameInvite,
}

export interface ChannelDTO {
	id: number,
	users: SimpleChatUserDTO[],
	messages: MessageDTO[]
}

export interface GroupChannelDTO{
	channelId: number,
	channel: ChannelDTO,
	name: string,
	admins: SimpleChatUserDTO[],
	invited: SimpleChatUserDTO[],
	owner: SimpleChatUserDTO,
	type: ChanType,
}

export interface DMChannelDTO {
	channelId:number,
	channel: ChannelDTO
}

export interface GroupChannelSnippetDTO{
	channelId: number,
	// channel: ChannelDTO,
	name: string
}

export interface gameInviteArgs {
	gameType: 'CUSTOM' | 'NORMAL';
}

export interface CreateMessageDto {
	authorId: number;

	ChannelId: number;

	content: string;

	gameInvite?: gameInviteArgs;
}

//there are two different ChatUserDTOs
//because i only want to send array of ids to represent
//members, invites, bans etc
//and only send once and on every update
//the full Chat UserDTO since it is going to be a pretty heavy object
export interface SimpleChatUserDTO {
	userId: number
}

export interface ChatUserDTO {
	userId: number,
	user: {
		id: number,
		username: string
	},
	joinedChannels?: ChannelDTO[];
	invites?: GroupChannelSnippetDTO[];
}




/****************
 * UPDATE EVENTS
 * 
 * they are here to inform of data change,
 * a user joined a channel or changed their username by example
 ***************/
export interface userNameChangeDTO {
	userId: number,
	newUserName: string,
}

export interface NewChannelOwnerDTO {
	newOwner: SimpleChatUserDTO,
	channelId: number,
}

export interface JoinDTO {
	user: SimpleChatUserDTO,
	channelId: number
}

export interface inviteUpdateDTO {
	targetUserId: number,
	channelId: number, //to be able to indentify the channel
	channelName: string, //purely for display
	action: boolean //true means invite false means uninvite
}

export interface ChatUserUpdateDTO {
	userId: number,
	user: {
		id: number,
		username :string
	}
}

/*****************
 * CHANNEL REQUESTS
 * 
 * All those interfaces are used to send a request to the server
 * and sometimes used by the serer as updates when possible
*****************/
export interface joinRequestDTO {
	channelName: string,
	key?: string
}

export interface adminRequestDTO {
	callerUserId: number,
	targetUserId: number,
	groupChannelId: number,
}

export interface basicChanRequestDTO {
	authorUserId: number,
	targetUserId: number,
	channelId: number
}

export interface ChanRequestDTO {
	authorUserId: number,
	targetUserId: number,
	channelId: number,
	action: boolean //true means set/do action, false means undo/unset
}

export interface InviteRequestDTO {
	authorUserId: number,
	targetUserName: string,
	channelId: number,
	action: boolean 
}

export interface ChanTypeRequestDTO {
	authorUserId: number,
	channelId: number,
	type: ChanType,
	key?: string
}

export interface ChanKeyRequestDTO {
	authorUserId: number,
	channelId: number,
	key: string
}

export interface DMRequestDTO {
	callerUserId: number,
	targetUserId: number
}

export interface MuteDTO {
	authorUserId: number,
	targetUserId: number,
	groupChannelId: number,
	endDate: Date
}

// export interface GroupChannelUpdateDTO {
// 	name?: string,
// 	admins?: SimpleChatUserDTO[],
// 	invited?: SimpleChatUserDTO[],
// 	owner?: SimpleChatUserDTO,
// 	type?: ChanType
// }
