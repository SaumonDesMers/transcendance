import { CreateMessageDto } from './message.create.dto'


export interface ServerToClientEvents {
	noArg: () => void;

	message: (message: Message) => void;
}

export interface ClientToServerEvents {
	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	join_room: (channel_name: string) => void;

	/**
	 * event emitted when a client wants to
	 * join a new channel
	 */
	leave_room: (channel_name: string) => void;

	// /**
	//  * event emitted when a client wants to
	//  * create a new channel
	//  */
	// create_room: (channel: ) => void;

	/**
	 * event for the client to request its
	 * corresponding user object
	 */
	get_user: (callback: (user: ChatUser) => void) => void;


	/**
	 * event to send a message to the chat
	 */
	send_message: (message: CreateMessageDto) => void;
}

export interface Message {
	id: number;
	content: string;
	author: ChatUser;
	postedAt: Date;
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
	joinedChannels?: Channel[];
}

export interface SocketData {
	userId: number;
}
