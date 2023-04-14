import { Channel } from "diagnostics_channel"



export interface MessageDTO {
	id: number,
	channelId: number,
	content: string,
	author: ChatUserDTO,
	postedAt: Date,
}

export interface joinRequestDTO {
	channelId?: number,
	channelName?: string,
}

export interface JoinDTO {
	username: string,
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
	channel: ChannelDTO,
	name: string,
	admins: ChatUserDTO[],
	owner: ChatUserDTO
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
