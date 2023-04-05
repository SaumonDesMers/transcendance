
export interface Message {
	id?: number,
	content: String,
	author: ChatUser,
	// channel: Channel,
	postedAt: Date
}

export interface Channel {
	id: number,
	users: ChatUser[],
	messages: Message[]
}

export interface ChatUser {
	userId: number,
	user: {
		id: number,
		username: string
	},
	joinedChannels : Channel[]
}
