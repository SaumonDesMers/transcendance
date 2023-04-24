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
	ChanTypeRequestDTO,
	ChanRequestDTO,
	inviteUpdateDTO,
	ChatUserUpdateDTO,
	SimpleChatUserDTO,
	NewChannelOwnerDTO,
	GroupChannelSnippetDTO
} from '../../../../backend/backend-src/src/chat/Chat.entities'
import {CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto'
import { ServerToClientEvents, ClientToServerEvents } from '../../../../backend/backend-src/src/chat/Chat.events'
import { CreateMessageDto } from '../../../../backend/backend-src/src/chat/message.create.dto';
import { profileEnd } from 'console'
import { networkInterfaces } from 'os'

enum ChanType{
	PUBLIC,
	PRIV,
	KEY,
}

/**
 * 
 * Different important facts about the Chat client object
 * 
 * - in channel are only stored arrays of userIds, if you want info about a user
 * 		like maybe their username or their profile pic, you have to get them from the store
 *		using the getUser* functions
 */
export class Chat {
	private _group_channels: Map<number, GroupChannelDTO>;
	private _public_channels: Map<number, GroupChannelSnippetDTO>;
	private _dm_channels: Map<number, ChannelDTO>;
	private _other_users: Map<number, {status: boolean, data: ChatUserDTO | undefined}>;
	private _channel_invites: Map<number, string>; //channel id and channel names
	private _user: ChatUserDTO;
	private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	error: Ref<string>;
	// private currentGroupChannelId: number;
	// private currentDmChannelId: number;
	
	/*
	*/
	get channelInvites() {return this._channel_invites}
	// set channelInvites(arg: Map<number, string>) {this._channel_invites = arg}

	get groupChannels() { return this._group_channels };
	// set groupChannels(arg: Map<number, GroupChannelDTO>) { this._group_channels = arg}

	// get otherUsers() {return this._other_users}
	// set otherUsers(arg: Map<number, ChatUserDTO>) {this._other_users = arg}

	get dmChannels() { return this._dm_channels };
	// get currentGroupChannel() {
	// 	return this._groupChannels.get(this.currentGroupChannelId);
	// }
	// get currentDmChannel() {
	// 	return this._dmChannels.get(this.currentDmChannelId);
	// }
	get connected() {return this.socket.connected;}
	get disconnected () { return this.socket.disconnected;}
	get user () {return this._user;}
	// get error() {return this._error}
	// set error(err: string){this._error = err;}

	/**
	 * 
	 * @param id the id of the user you want to get the username of
	 * @returns the username of the user
	 */
	getUserName(id: number): string {
		const ret = this.getUser(id)?.user.username;

		if (ret == undefined)
			return "loading...";
		return ret;
	}

	getUser(id: number): ChatUserDTO | undefined{
		let obj = this._other_users.get(id);

		if (obj == undefined)
		{
			console.log(id);
			obj = {status: false, data: undefined};
			this._other_users.set(id, obj);
			this.socket.emitWithAck("get_other_user", id).then(user => {
				this._other_users.set(user.userId, {status: true, data: user});
			})
		}

		return obj.data;
	}

	getGroupChannel(id: number) {
		return this._group_channels.get(id);
	}


	constructor() {

		this._group_channels = reactive(new Map());
		this._channel_invites = reactive (new Map());
		this._other_users = new Map();
		this._public_channels = new Map();
		// this.dmChannels = new Map();
		this.error = ref<string>("");

		this.initSocket();

	}

	connectToServer() {
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${localStorage.jwt}`
		};
		this.socket.connect();

		this._channel_invites.clear();
		this.socket.emit("get_my_user", (user: ChatUserDTO) => {
			this._user = user;
			console.log(user);
			user.invites?.forEach(invite => {
				this.channelInvites.set(invite.channelId, invite.name);
				console.log(invite);
			})
		});
		
		this._group_channels.clear();
		this.socket.emit("get_groupchannels", (channels: GroupChannelDTO[]) => {
			channels.forEach(channel => {
				this._group_channels.set(channel.channelId, channel);
			});
		});

		this._public_channels.clear();
		this.socket.emit("get_public_channels", (channels: GroupChannelSnippetDTO[]) => {
			channels.forEach(channel => {
				this._public_channels.set(channel.channelId, channel);
			})
		})
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


		/******************
		 * CHANNEL EVENTS *
		 ******************/

		this.socket.on('message', (message: MessageDTO) => {
			console.log("received message:", message);
			this.groupChannels.get(message.channelId)?.channel.messages.push(message);
		});
		
		this.socket.on('user_joined_room', (payload: JoinDTO) => {
			this._group_channels.get(payload.channelId)?.channel.users.push(payload.user);
		});
		
		this.socket.on('user_left_room', (payload: JoinDTO) => {
			this.delete_user_from_chan(payload.user.userId, payload.channelId);
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
			if (payload.targetUserId == this.user.userId)
			{
				if (payload.action == true){
					this.channelInvites.set(payload.channelId, payload.channelName);
				} else {
					this.channelInvites.delete(payload.channelId);
				}
			}
			else //remove or add user from invited list
			{
				let channel = this._group_channels.get(payload.channelId);
				if (channel != undefined)
				{
				if (payload.action == true ) {
					channel.invited.push({userId:payload.targetUserId});
				} else {
					this.delete_user_from_array(payload.targetUserId, channel.invited);
				}
			}
			}
		});

		this.socket.on("chan_type_update", (payload: ChanTypeRequestDTO) => {
			let chan = this._group_channels.get(payload.channelId);

			if (chan != undefined)
				chan.type = payload.type;
		});

		this.socket.on("admin_update", (payload: ChanRequestDTO) => {
			let chan = this._group_channels.get(payload.channelId);

			if (chan != undefined)
			{
				if (payload.action == true)
					chan.admins.push({userId:payload.targetUserId});
				else
					this.delete_user_from_array(payload.targetUserId, chan.admins);
			}
		});

		this.socket.on("owner_update", (payload: NewChannelOwnerDTO) => {
			let chan = this._group_channels.get(payload.channelId);

			if (chan !== undefined)
				chan.owner = payload.newOwner;
		});




		/*****************
		 * DIRECT EVENTS *
		 ****************/

		this.socket.on('exception', (payload: {
			status: string,
			message: string
		}) => {
			console.log(payload);
			// this.error = '';
			this.error.value = payload.message;
		})

		this.socket.on("user_update", (payload: ChatUserDTO) => {
			if (this._other_users.has(payload.userId))
			{
				this._other_users.set(payload.userId, {status: true, data: payload});
			}
		})

		this.socket.on("public_chans", (payload: {channels: GroupChannelSnippetDTO[], add: boolean}) => {

			if (payload.add == true)//if we want to add or update channels to the list of public chans
			{
				payload.channels.forEach(channel => {
					this._public_channels.set(channel.channelId, channel);
				})
			}
			else
			{
				payload.channels.forEach(channel => {
					this._public_channels.delete(channel.channelId);
				})
			}
		})

	}
	
	leaveChannel(channelId: number) {
		console.log("leave channel called in front");
		this.socket.emit("leave_channel", channelId);
		this._group_channels.delete(channelId);
	}
	
	createChannel(channel: CreateGroupChannelDto)
	{
		this.socket.emit("create_channel", channel, (channel: GroupChannelDTO) => {
			this._group_channels.set(channel.channelId, channel);
		});
	}
	
	joinChannel(request: joinRequestDTO)
	{
		this.socket.emit("join_channel", request, (channel: GroupChannelDTO) => {
			this.channelInvites.delete(channel.channelId);
			this._group_channels.set(channel.channelId, channel);
		})
	}

	setChanType(channelId: number, type: ChanTypeRequestDTO['type'], key?: string)
	{

		this.socket.emit("chan_type_request", {
			authorUserId:this.user.userId,
			channelId,
			type,
			key
		});
	}
	
	sendMessage(message: CreateMessageDto)
	{
		this.socket.emit("send_message", message);
	}
	
	
	mute_user(request: MuteDTO)
	{
		this.socket.emit('mute_request', request);
	}
	
	/**
	 * 
	 * @param targetUserId id of the user you want to kick
	 * @param channelId id of the channel you want to kick him from
	 */
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
	 * @param targetUserId Is of the user you want to set/unset as admin
	 * @param channelId id of the concerned channel
	 * @param action true to set as admin, false to unset
	 */
	user_admin(targetUserId: number, channelId: number, action: boolean)
	{
		this.socket.emit('admin_request', 
		{
			authorUserId:this.user.userId,
			targetUserId,
			channelId,
			action,
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

	clear_error()
	{
		console.log(this.error);
		// this.error.value = '';
	}

	private delete_user_from_chan(userId: number, channelId: number)
	{
		let channel = this._group_channels.get(channelId);
		if (channel != undefined)
		{
			this.delete_user_from_array(userId, channel.channel.users);
		}
	}


	private delete_user_from_array(userId: number, array: SimpleChatUserDTO[])
	{
		for (let i = 0; i < array.length; i++)
		{
			if (array[i].userId == userId)
			{
				array.splice(i, 1);
				break;
			}
		}
	}
}

export default reactive<Chat>(new Chat())
