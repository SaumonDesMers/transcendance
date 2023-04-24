import { ChanType } from "@prisma/client"


export interface MessageDTO {
	id: number,
	channelId: number,
	content: string,
	author: SimpleChatUserDTO,
	postedAt: Date,
}

export interface userNameChangeDTO {
	userId: number,
	newUserName: string,
}

export interface joinRequestDTO {
	channelName: string,
	key?: string
}

export interface JoinDTO {
	user: SimpleChatUserDTO,
	channelId: number
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

export interface inviteUpdateDTO {
	targetUserId: number,
	channelId: number, //to be able to indentify the channel
	channelName: string, //purely for display
	action: boolean //true means invite false means uninvite
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

export interface NewChannelOwnerDTO {
	newOwner: SimpleChatUserDTO,
	channelId: number,
}

export interface DMRequestDTO {
	callerUserId: number,
	targetUserId: number
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

export interface GroupChannelUpdateDTO {
	name?: string,
	admins?: SimpleChatUserDTO[],
	invited?: SimpleChatUserDTO[],
	owner?: SimpleChatUserDTO,
	type?: ChanType
}

export interface GroupChannelSnippetDTO{
	channelId: number,
	// channel: ChannelDTO,
	name: string
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

export interface ChatUserUpdateDTO {
	userId: number,
	user: {
		id: number,
		username :string
	}
}

export interface MuteDTO {
	authorUserId: number,
	targetUserId: number,
	groupChannelId: number,
	endDate: Date
}
