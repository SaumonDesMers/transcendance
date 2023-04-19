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
	channeldId: number,
	channel: ChannelDTO,
	name: string
}


export interface ChatUserDTO {
	userId: number,
	user: {
		id: number,
		username: string
	},
	joinedChannels?: ChannelDTO[];
}

export interface MuteDTO {
	authorUserId: number,
	targetUserId: number,
	groupChannelId: number,
	endDate: Date
}
