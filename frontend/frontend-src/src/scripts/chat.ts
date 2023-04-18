import { Socket, io } from 'socket.io-client'
import { reactive } from 'vue'
import {
	GroupChannelDTO,
	ChannelDTO,
	ChatUserDTO,
	MessageDTO,
	JoinDTO,
	adminRequestDTO,
	MuteDTO
} from '../../../../backend/backend-src/src/chat/Chat.entities'
import {CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto'
import { ServerToClientEvents, ClientToServerEvents } from '../../../../backend/backend-src/src/chat/Chat.events'
import { CreateMessageDto } from '../../../../backend/backend-src/src/chat/message.create.dto';


export class Chat {
	private _groupChannels: Map<number, GroupChannelDTO>;
	private _dmChannels: Map<number, ChannelDTO>;
	private _other_users: Map<number, ChatUserDTO>;
	private _user: ChatUserDTO;
	private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	private currentGroupChannelId: number;
	private currentDmChannelId: number;
	
	get groupChannels() { return this._groupChannels };
	get dmChannels() { return this._dmChannels };
	get currentGroupChannel() {
		return this._groupChannels.get(this.currentGroupChannelId);
	}
	get currentDmChannel() {
		return this._dmChannels.get(this.currentDmChannelId);
	}
	get connected() {
		return this.socket.connected;
	}


	constructor() {
		
		this.socket.emit("get_user", (user: ChatUserDTO) => {
			this._user = user;
		});
		
		this.socket.emit("get_groupchannels", (channels: GroupChannelDTO[]) => {
			channels.forEach(channel => {
				this._groupChannels.set(channel.channelId, channel);
			});
		});
		
	}

	connectToServer() {
		this.socket.connect();
	}

	disconnectFromServer() {
		this.socket.disconnected();
	}

	private initSocket() {
		this.socket = io('http://localhost:3001/chat'), {
			autoConnect: false
		};
		
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${localStorage.jwt}`
		};

		this.socket.on('message', (message: MessageDTO) => {
			this._groupChannels.get(message.channelId)?.channel.messages.push(message);
		});
		
		this.socket.on('user_joined_room', (payload: JoinDTO) => {
			this._groupChannels.get(payload.channelId)?.channel.users.push(payload.user);
		});
		
		this.socket.on('user_left_room', (payload: JoinDTO) => {
			const index = this._groupChannels.get(payload.channelId)?.channel.users.indexOf(payload.user);
			if (index !== undefined)
			this._groupChannels.get(payload.channelId)?.channel.users.splice(index, 1);
		});
		
		this.socket.on('exception', (payload: any) => {
			console.log(payload);
		});
	}
	
	leaveChannel(channelId: number) {
		this.socket.emit("leave_channel", channelId);
		this._groupChannels.delete(channelId);
	}
	
	createChannel(channel: CreateGroupChannelDto)
	{
		this.socket.emit("create_channel", channel, (channel: GroupChannelDTO) => {
			this._groupChannels.set(channel.channelId, channel);
		});
	}
	
	joinChannel(channelName: string)
	{
		this.socket.emit("join_channel", channelName, (channel: GroupChannelDTO) => {
			this._groupChannels.set(channel.channelId, channel);
		})
	}
	
	sendMessage(message: CreateMessageDto)
	{
		this.socket.emit("send_message", message);
	}
	
	set_user_admin(request: adminRequestDTO)
	{
		this.socket.emit('set_admin_request', request);
	}

	unset_user_admin(request: adminRequestDTO)
	{
		this.socket.emit('unset_admin_request', request);
	}
	
	mute_user(request: MuteDTO)
	{
		this.socket.emit('mute_request', request);
	}
}

export default reactive<Chat>(new Chat())
