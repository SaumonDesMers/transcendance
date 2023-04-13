


export interface MessageDTO {
	id: number,
	channeldId: number,
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

export interface ChannelDTO {
	id: number,
	name: string,
	users: ChatUserDTO[],
	messages: MessageDTO[]
}

export interface GroupChannelDTO extends ChannelDTO {
	admins: number[],
	owner: number
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
