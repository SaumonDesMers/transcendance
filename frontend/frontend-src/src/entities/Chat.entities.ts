export enum gameType {
	NORMAL,
	CUSTOM,
}

export const ChanType: {
	PUBLIC: 'PUBLIC',
	PRIV: 'PRIV',
	KEY: 'KEY'
} = {
	PUBLIC: 'PUBLIC',
	PRIV: 'PRIV',
	KEY: 'KEY'
}

export type ChanType = typeof ChanType[keyof typeof ChanType]

/**
 * TRANSFER OBJECTS
 * 
 * These interface represent how objects like channels or users
 * are transfered over the network
 * and stored in the client
 */

export interface GameInvite {

	status: 'PENDING' | 'EXPIRED';
	type: gameType;

	uid: string;
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
	ownerId: number,
	type: ChanType,
}

export interface DMChannelDTO {
	channelId:number,
	channel: ChannelDTO
}

export interface GroupChannelSnippetDTO{
	channelId: number,
	// channel: ChannelDTO,
	name: string,
	type: ChanType,
}


export interface gameInviteArgs {
	gameType: gameType;
}

export interface CreateMessageDto {
	authorId: number;

	ChannelId: number;

	content: string;

	gameInvite?: gameInviteArgs;
}

export interface CreateGroupChannelDto {
	ownerId: number;

	name: string;

	usersId: number[];

	type: ChanType;

	key? :string;
}

//there are two different ChatUserDTOs
//because i only want to send array of ids to represent
//members, invites, bans etc
//and only send once and on every update
//the full Chat UserDTO since it is going to be a pretty heavy object
export interface SimpleChatUserDTO {
	userId: number
}

export class ChatUserDTO {
	userId: number = 0;
	user: {
		id: number,
		username: string
	};
	joinedChannels?: ChannelDTO[];
	invites?: GroupChannelSnippetDTO[];
	blocked?: SimpleChatUserDTO[];

	constructor() {this.user = {id: 0, username:'loading'}}
}




/****************
 * UPDATE EVENTS
 * 
 * they are here to inform of data change,
 * a user joined a channel or changed their username by example
 ***************/
export interface NewChannelOwnerDTO {
	newOwner: SimpleChatUserDTO,
	channelId: number,
}

export interface inviteUpdateDTO {
	targetUserId: number,
	channel: GroupChannelDTO,
}

export interface ChanNotifDTO {
	callerUserId?: number,
	targetUserId: number,
	channelId: number,
	action?: boolean,
}

/*****************
 * CHANNEL REQUESTS
 * 
 * All those interfaces are used to send a request to the server
 * and sometimes used by the serer as updates when possible
*****************/
export interface joinRequestDTO {

	channelName?: string;

	channelId?: number;

	key?: string;
}

export interface basicChanRequestDTO {
	authorUserId: number;
	
	// @IsString()
	targetUserId: number;
	
	channelId: number;
}

export interface ChanRequestDTO {
	authorUserId: number;
	
	targetUserId: number;
	
	channelId: number;
	
	action: boolean; //true means set/do action, false means undo/unset
}

export interface ChanTypeRequestDTO {

	authorUserId: number;
	
	channelId: number;

	type: ChanType;

	key?: string
}

export interface ChanKeyRequestDTO {

	authorUserId: number;

	channelId: number;

	key: string
}

export interface DMRequestDTO {
	callerUserId: number;

	targetUserId: number;
}

export interface MuteDTO {

	authorUserId: number;

	targetUserId: number;

	groupChannelId: number;

	// @IsDate()
	durationInMinutes: number;
}

export interface searchQueryDTO {
	username: string;

	channelId?: number;
}

// export interface GroupChannelUpdateDTO {
// 	name?: string,
// 	admins?: SimpleChatUserDTO[],
// 	invited?: SimpleChatUserDTO[],
// 	owner?: SimpleChatUserDTO,
// 	type?: ChanType
// }
