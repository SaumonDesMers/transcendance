import { Channel } from "diagnostics_channel"



export interface MessageDTO {
	id: number,
	channelId: number,
	content: string,
	author: ChatUserDTO,
	postedAt: Date,
}

export interface joinRequestDTO {
	channelName: string,
	key: string
}

export interface JoinDTO {
	user: ChatUserDTO,
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
export interface chanPrivateRequestDTO {
	authorUserId: number,
	targetUserId: number,
	channelId: number,
	chanPrivate: boolean
}

export interface DMRequestDTO {
	callerUserId: number,
	targetUserId: number
}

export interface ChannelDTO {
	id: number,
	users: ChatUserDTO[],
	messages: MessageDTO[]
}

export interface GroupChannelDTO{
	channelId: number,
	channel: ChannelDTO,
	name: string,
	admins: ChatUserDTO[],
	owner: ChatUserDTO,
	privateChan: boolean
}

export interface GroupChannelSnippetDTO{
	channelId: number,
	// channel: ChannelDTO,
	name: string
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

export interface MuteDTO {
	authorUserId: number,
	targetUserId: number,
	groupChannelId: number,
	endDate: Date
}
