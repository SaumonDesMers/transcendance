import { CreateMessageDto } from './message.create.dto'

export interface InterServerEvents {
	ping: () => void;
}

export interface ServerToClientEvents {
	noArg: () => void;

	message: (message: MessageDTO) => void;
}

export interface ClientToServerEvents {
	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	join_room: (channelName: string) => void;

	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	leave_room: (channelName: string) => void;

	// /**
	//  * event emitted when a client wants to
	//  * create a new channel
	//  */
	// create_room: (channel: ) => void;

	/**
	 * event for the client to request its
	 * corresponding user object
	 */
	get_user: (callback: (user: ChatUserDTO) => void) => void;


	/**
	 * event to send a message to the chat
	 */
	send_message: (message: CreateMessageDto) => void;


	set_admin_request: (request: adminRequestDTO) => void;

	unset_admin_request: (request: adminRequestDTO) => void;

	mute_request: (request: MuteDTO) => void;
}

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

export interface SocketData {
	userId: number,
}
