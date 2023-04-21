import { Socket, io } from 'socket.io-client'
import { Ref, reactive, ref } from 'vue'
import {
	GroupChannelDTO,
	ChannelDTO,
	ChatUserDTO,
	MessageDTO,
	JoinDTO,
	adminRequestDTO,
	MuteDTO,
	joinRequestDTO,
	basicChanRequestDTO,
	ChanRequestDTO,
	inviteUpdateDTO
} from '../../../../backend/backend-src/src/chat/Chat.entities'
import {CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto'
import { ServerToClientEvents, ClientToServerEvents } from '../../../../backend/backend-src/src/chat/Chat.events'
import { CreateMessageDto } from '../../../../backend/backend-src/src/chat/message.create.dto';


export class Chat {
	private _groupChannels: Map<number, GroupChannelDTO>;
	private _dmChannels: Map<number, ChannelDTO>;
	private _other_users: Map<number, ChatUserDTO>;
	private _channelInvites: Map<number, string>; //channel id and channel names
	private _user: ChatUserDTO;
	private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	private _error: string;
	// private currentGroupChannelId: number;
	// private currentDmChannelId: number;
	
	get channelInvites() {return this._channelInvites}
	set channelInvites(arg: Map<number, string>) {this._channelInvites = arg}

	get groupChannels() { return this._groupChannels };
	set groupChannels(arg: Map<number, GroupChannelDTO>) { this._groupChannels = arg}

	get dmChannels() { return this._dmChannels };
	// get currentGroupChannel() {
	// 	return this._groupChannels.get(this.currentGroupChannelId);
	// }
	// get currentDmChannel() {
	// 	return this._dmChannels.get(this.currentDmChannelId);
	// }
	get connected() {return this.socket.connected;}
	get disconnected () { return this.socket.disconnected;}
	get user () {return this._user;}
	get error() {return this._error}

	getGroupChannel(id: number) {
		return this._groupChannels.get(id);
	}

	set error(err: string){this._error = err;}

	constructor() {

		this.groupChannels = reactive(new Map());
		this.channelInvites = reactive (new Map());
		// this.dmChannels = new Map();
		this._error = '';

		this.initSocket();

		
	}

	connectToServer() {
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${localStorage.jwt}`
		};
		this.socket.connect();

		this.socket.emit("get_user", (user: ChatUserDTO) => {
			this._user = user;
			console.log(user);
			user.invites?.forEach(invite => {
				this.channelInvites.set(invite.channelId, invite.name);
				console.log(invite);
			})
		});
		
		// this.socket.emit("get_invites", (invites: inviteUpdateDTO[]) => {
		// 	invites.forEach(invite => {
		// 		this._channelInvites.set(invite.channelId, invite.channelName);
		// 	})
		// });

		this._groupChannels.clear();
		this.socket.emit("get_groupchannels", (channels: GroupChannelDTO[]) => {
			channels.forEach(channel => {
				this._groupChannels.set(channel.channelId, channel);
			});
		});
	}

	disconnectFromServer() {
		this.socket.disconnect();
	}

	private initSocket() {
		this.socket = io('http://localhost:3001/chat', {
			autoConnect: false
		});
		
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${localStorage.jwt}`
		};

		this.socket.on('message', (message: MessageDTO) => {
			console.log("received message:", message);
			this.groupChannels.get(message.channelId)?.channel.messages.push(message);
		});
		
		this.socket.on('user_joined_room', (payload: JoinDTO) => {
			this._groupChannels.get(payload.channelId)?.channel.users.push(payload.user);
		});
		
		this.socket.on('user_left_room', (payload: JoinDTO) => {
			const index = this._groupChannels.get(payload.channelId)?.channel.users.indexOf(payload.user);
			if (index !== undefined)
			this._groupChannels.get(payload.channelId)?.channel.users.splice(index, 1);
		});

		this.socket.on("user_kicked", (payload: basicChanRequestDTO) => {
			if (payload.targetUserId == this.user.userId)
			{
				this.groupChannels.delete(payload.channelId);
			}
			else
				this.delete_user_from_chan(payload.targetUserId, payload.channelId);

		});

		this.socket.on("user_banned", (payload: basicChanRequestDTO) => {
			if (payload.targetUserId == this.user.userId)
			{
				this.groupChannels.delete(payload.channelId);
			}
			else
				this.delete_user_from_chan(payload.targetUserId, payload.channelId);
		});

		this.socket.on("invite_update", (payload: inviteUpdateDTO) => {
			if (payload.action == true){
				this.channelInvites.set(payload.channelId, payload.channelName);
			} else {
				this.channelInvites.delete(payload.channelId);
			}
		});

		this.socket.on('exception', (payload: {
			status: string,
			message: string
		}) => {
			console.log(payload);
			this._error = '';
			this._error = payload.message;
		});

	}
	
	leaveChannel(channelId: number) {
		console.log("leave channel called in front");
		this.socket.emit("leave_channel", channelId);
		this._groupChannels.delete(channelId);
	}
	
	createChannel(channel: CreateGroupChannelDto)
	{
		this.socket.emit("create_channel", channel, (channel: GroupChannelDTO) => {
			this._groupChannels.set(channel.channelId, channel);
		});
	}
	
	joinChannel(request: joinRequestDTO)
	{
		this.socket.emit("join_channel", request, (channel: GroupChannelDTO) => {
			this.channelInvites.delete(channel.channelId);
			this._groupChannels.set(channel.channelId, channel);
		})
	}
	
	sendMessage(message: CreateMessageDto)
	{
		this.socket.emit("send_message", message);
	}
	
	set_user_admin(request: basicChanRequestDTO)
	{
		const {authorUserId, targetUserId, channelId} = request;
		this.socket.emit('admin_request', 
		{
			authorUserId,
			targetUserId,
			channelId,
			action: true
		});
	}

	unset_user_admin(request: basicChanRequestDTO)
	{
		const {authorUserId, targetUserId, channelId} = request;
		this.socket.emit('admin_request', 
		{
			authorUserId,
			targetUserId,
			channelId,
			action: false
		});
	}
	
	mute_user(request: MuteDTO)
	{
		this.socket.emit('mute_request', request);
	}

	kick_user(targetUserId: number, channelId: number)
	{
		this.socket.emit("kick_request", {
			targetUserId,
			channelId,
			authorUserId: this.user.userId
		});
	}

	/**
	 * 
	 * @param targetUserId is of the user you want to ban/unban
	 * @param channelId is of the concerned channel
	 * @param mode true means ban, false means unban
	 */
	ban_user(targetUserId: number, channelId: number, action: boolean)
	{
		this.socket.emit("ban_request", {
			authorUserId:this.user.userId,
			targetUserId,
			channelId,
			action,
		});
	}

	/**
	 * 
	 * @param targetUserId is of the user you want to invite/uninvite
	 * @param channelId is of the concerned channel
	 * @param mode true means invite, false means uninvite
	 */
	invite_user(targetUserName: string, channelId: number, action: boolean)
	{
		this.socket.emit("invite_request", {
			authorUserId:this.user.userId,
			targetUserName,
			channelId,
			action,
		});
	}

	private delete_user_from_chan(userId: number, channelId: number)
	{
		let channel = this._groupChannels.get(channelId);
		if (channel != undefined)
		{
		for (let i = 0; i < channel.channel.users.length; i++)
		{
			if (channel.channel.users[i].userId == userId)
			{
				this.groupChannels.get(channelId)?.channel.users.splice(i, 1);
				break;
			}
		}
		}
	}
}

export default reactive<Chat>(new Chat())
