import { Socket, io } from 'socket.io-client'
import { Ref, reactive, ref } from 'vue'
import {
	GroupChannelDTO,
	ChannelDTO,
	ChatUserDTO,
	MessageDTO,
	MuteDTO,
	joinRequestDTO,
	basicChanRequestDTO,
	ChanTypeRequestDTO,
	ChanRequestDTO,
	inviteUpdateDTO,
	SimpleChatUserDTO,
	NewChannelOwnerDTO,
	GroupChannelSnippetDTO,
	DMChannelDTO,
	CreateMessageDto,
	gameInviteArgs,
	ChanNotifDTO
} from '../../../../backend/backend-src/src/chat/Chat.entities'
import {CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto'
import { ServerToClientEvents, ClientToServerEvents } from '../../../../backend/backend-src/src/chat/Chat.events'
import { User } from './user'

export const ChanType: {
	PUBLIC: 'PUBLIC',
	PRIV: 'PRIV',
	KEY: 'KEY'
  } = {
	PUBLIC: 'PUBLIC',
	PRIV: 'PRIV',
	KEY: 'KEY'
  }

  export type ChanType = typeof ChanType[keyof typeof ChanType]

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
	private _visible_public_channels: Map<number, GroupChannelSnippetDTO>;
	private _visible_key_channels: Map<number, GroupChannelSnippetDTO>;
	private _dm_channels: Map<number, DMChannelDTO>;
	private _other_users: Map<number, User>;
	private _channel_invites: Map<number, string>; //channel id and channel names
	private _user!: ChatUserDTO;
	private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	error: Ref<string>;
	// private currentGroupChannelId: number;
	// private currentDmChannelId: number;
	private currentChannelId: number = -1;
	isCurrentDM: boolean = false;
	
	/**
	 * Pending invites getter, the list is auto updated
	 * @date 4/24/2023 - 5:28:54 PM
	 *
	 * @readonly
	 */
	get channelInvites() {return this._channel_invites}

	/**
	 * Joined Group Channels Getter, the list is auto updated
	 * @date 4/24/2023 - 5:29:38 PM
	 *
	 * @readonly
	 */
	get groupChannels() { return this._group_channels }

	/**
	 * Public joinable Channels Getter, the list is auto updated
	 * @date 4/24/2023 - 5:29:59 PM
	 *
	 * @readonly
	 */
	get publicChannels() { return this._visible_public_channels }


	/**
	 * Public and key protected channels getter, the list is auto updated
	 * @date 5/5/2023 - 1:47:22 PM
	 *
	 * @readonly
	 * @type {*}
	 */
	get keyChannels() {return this._visible_key_channels }

	/**
	 * Current opened DMs Getter, the list is auto updated
	 * @date 4/24/2023 - 5:30:54 PM
	 *
	 * @readonly
	 * @type {*}
	 */
	get dmChannels() { return this._dm_channels };

	/**
	 * Getter for socket connection status
	 * @date 4/24/2023 - 5:26:56 PM
	 *
	 * @readonly
	 * @type {boolean} `true` if socket is connected
	 */
	get connected() {return this.socket.connected;}

	/**
	 * Getter for socket connection status
	 * @date 4/24/2023 - 5:27:30 PM
	 *
	 * @readonly
	 * @type {boolean} `true` if socket is disconnected
	 */
	get disconnected () { return this.socket.disconnected;}

	/**
	 * Getter for the user
	 * @date 4/24/2023 - 5:27:56 PM
	 *
	 * @readonly
	 * @type {ChatUserDTO} self user
	 */
	get user () {return this._user;}
	// get error() {return this._error}
	// set error(err: string){this._error = err;}

	/**
	 * Getter for a specific joined channel
	 * @date 4/24/2023 - 5:36:26 PM
	 *
	 * @param {number} channelId
	 * @returns {(GroupChannelDTO | undefined)} The corresponding group channel
	 * or `undefined` if not such channel exists
	 */
	getGroupChannel(channelId: number): GroupChannelDTO | undefined
	{
		return this._group_channels.get(channelId);
	}

	getDMChannel(channelId: number): DMChannelDTO | undefined
	{
		return this._dm_channels.get(channelId);
	}
	
	getCurrentChannel(): GroupChannelDTO | DMChannelDTO | undefined
	{
		if (this.isCurrentDM)
			return this._dm_channels.get(this.currentChannelId);
		else
			return this._group_channels.get(this.currentChannelId);
	}

	getCurrentGroupChannel(): GroupChannelDTO | undefined
	{
		return this._group_channels.get(this.currentChannelId);
	}

	getCurrentDM(): DMChannelDTO | undefined
	{
		return this._dm_channels.get(this.currentChannelId);
	}

	selectChannel(id: number, isDMChannel: boolean)
	{
		this.currentChannelId = id;
		this.isCurrentDM = isDMChannel;
	}

	constructor() {
		this._group_channels = reactive(new Map());
		this._channel_invites = reactive (new Map());
		this._other_users = reactive(new Map());
		this._visible_public_channels = reactive(new Map());
		this._visible_key_channels = reactive(new Map());
		this._dm_channels = reactive(new Map())
		this._user = reactive(new ChatUserDTO())
		this.error = ref<string>("");

		this.socket = io('http://localhost:3001/chat', {
			autoConnect: false,
			reconnection: false
		});	
		this.initSocket();
	}
	

	/**********************
	 * GENERAL FLOW UTILS *
	 **********************/
	
	/**
	 * Call this when you want to connect to the server,
	 * Be carefull, auth must have been completed
	 * @date 4/24/2023 - 5:26:02 PM
	 */
	async connect(jwt: string) {
		if (this.socket.connected)
			return;
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${jwt}`,
			sessionId: localStorage.sessionId
		};
		this.socket.connect();
		
		this._channel_invites.clear();
		this._user = await this.socket.emitWithAck("get_my_user");
		if (this._user.blocked == undefined)
			this._user.blocked = reactive(new Array());
		
		this._group_channels.clear();
		this.socket.emit("get_groupchannels", (channels: GroupChannelDTO[]) => {
			channels.forEach(channel => {
				this._group_channels.set(channel.channelId, channel);
			});
		});
		
		this._visible_public_channels.clear();
		this.socket.emit("get_public_channels", (channels: GroupChannelSnippetDTO[]) => {
			channels.forEach(channel => {
				if (channel.type == 'PUBLIC')
						this._visible_public_channels.set(channel.channelId, channel);
				else if (channel.type == 'KEY')
						this._visible_key_channels.set(channel.channelId, channel);
			})
		});

		this._dm_channels.clear();
		this.socket.emit("get_dmchannels", (channels: DMChannelDTO[]) => {
			channels.forEach(channel => {
				this._dm_channels.set(channel.channelId, channel);
			})
		});
	}
	
	/**
	 * Simple disconnect
	 * @date 4/24/2023 - 5:26:37 PM
	 */
	disconnectFromServer() {
		this.socket.disconnect();
	}

	/**
	 * 
	 * @param id the id of the user you want to get the username of
	 * @returns the username of the user
	 */
	getUserName(id: number): string {
		if (id == undefined || id == 0)
			return "unkown";

		const ret = this.getUser(id)?.username;

		if (ret == undefined)
			return "loading...";
		return ret;
	}

	getUser(id: number): User | undefined{
		let obj = this._other_users.get(id);

		if (obj == undefined)
		{
			let user = reactive(new User());
			user.loadUser(id);
			this._other_users.set(id, user);
		}

		return obj;
	}
	
	
	/**********************
	 * CHANNEL OPERATIONS *
	**********************/
	
	/**
	 * Call this when you want to create a new channel,
	 * Doc about the DTO is in Chat.entities
	 * 
	 * @param {CreateGroupChannelDto} channel the new channel
	*/
	createChannel(channel: CreateGroupChannelDto)
	{
		this.socket.emit("create_channel", channel, (channel: GroupChannelDTO) => {
			this._group_channels.set(channel.channelId, channel);
		});
	}
	
	/**
	 * Call this when you want to leave the current channel
	*/
	leaveChannel() {

		if (this.isCurrentDM == true || this.currentChannelId == -1)
			return;

		this.socket.emit("leave_channel", this.currentChannelId);
		this._group_channels.delete(this.currentChannelId);
		this.currentChannelId = -1;
	}
	
	/**
	 * Cal this when you want to join an existing channel
	 * Doc about the DTO is in Chat.entities
	 * 
	 * @param {joinRequestDTO} request the channel name and key
	*/
	joinChannel(request: joinRequestDTO)
	{
		this.socket.emit("join_channel", request, (channel: GroupChannelDTO) => {
			this._group_channels.set(channel.channelId, channel);
			this.selectChannel(channel.channelId, false);
		})
	}
	
	/**
	 * Function to call when you want to accept a channel invite
	 * @date 4/27/2023 - 10:47:18 PM
	 *
	 * @param {number} channelId the id of the channel specified in the invite
	 */
	acceptInvite(channelId: number)
	{
		this._channel_invites.delete(channelId);
		this.socket.emit("join_channel", {channelId}, (channel : GroupChannelDTO) => {
			this._group_channels.set(channel.channelId, channel);
		})
	}
	
	/**
	 * Function to start a DM channel with another User
	 * @date 4/25/2023 - 8:11:02 PM
	 *
	 * @param {string} username username of the user you want to start a convo with
	 */
	startDM(username: string)
	{
		this.socket.emit("start_dm", username, (channel: DMChannelDTO) => {
			this._dm_channels.set(channel.channelId, channel);
			this.selectChannel(channel.channelId, true);
		})
	}

	/**
	 * Function to set a channel Type ['PUBLIC', 'PRIV', 'KEY']
	 * @date 4/24/2023 - 5:03:06 PM
	*
	* @param {ChanTypeRequestDTO['type']} type the type you want to go to
	 * @param {?string} [key] if type == KEY, this is the key you want to set your channel to
	 */
	setChanType(type: ChanTypeRequestDTO['type'], key?: string)
	{
		if (this.isCurrentDM == true || this.currentChannelId == -1)
			return;
		this.socket.emit("chan_type_request", {
			authorUserId:this.user.userId,
			channelId : this.currentChannelId,
			type,
			key
		});
	}
	
	/**
	 * Function to set current channel's key
	 * @date 4/24/2023 - 5:19:13 PM
	*
	* @param {string} key a string of the new key
	*/
	setChanKey(key: string)
	{
		if (this.isCurrentDM == true || this.currentChannelId == -1)
			return;
		this.socket.emit("chan_key_request", {
			authorUserId:this.user.userId,
			channelId:this.currentChannelId,
			key
		});
	}
	
	/**
	 * Send a message containing `content` to the current channel
	 * @date 4/28/2023 - 2:50:18 PM
	 *
	 * @param {string} content a string containing the content of the msg
	 */
	sendMessage(content: string)
	{

		if (this.currentChannelId == -1)
			return;
		const message: CreateMessageDto = {
			content,
			authorId:this.user.userId,
			ChannelId:this.currentChannelId
		};
		this.socket.emit("send_message", message);
	}
	
	/**
	 * Function to send a GameInvite to the current channel
	 * @date 4/26/2023 - 12:34:29 AM
	 *
	 * @param {gameInviteArgs} inviteArgs Args of the invite
	 */
	sendGameInvite(inviteArgs: gameInviteArgs, content: string)
	{
		if (this.currentChannelId == -1)
			return;
		this.socket.emit("send_game_invite", {
			authorId:this.user.userId,
			ChannelId:this.currentChannelId,
			content: content,
			gameInvite: inviteArgs
		});
	}

	/**
	 * Function to accept a game invite and start a game
	 * @date 4/26/2023 - 12:41:29 AM
	 *
	 * @param {MessageDTO} msg the msg that the user clicked on
	 */
	acceptGameInvite(msg: MessageDTO)
	{
		this.socket.emit("accept_game_invite", msg);
	}

	/**
	 * Function to mute a user
	 * Info about the DTO in chat.entities
	 * @date 4/24/2023 - 5:20:41 PM
	*
	 * @param {MuteDTO} request
	*/
	mute_user(request: MuteDTO)
	{
		this.socket.emit('mute_request', request);
	}
	
	/**
	 * Kick a user from the current channel
	 * @date 4/28/2023 - 2:55:14 PM
	 *
	 * @param {string} targetUserName username of the user to kick
	 */
	kick_user(targetUserName: string)
	{
		if (this.isCurrentDM || this.currentChannelId == -1)
			return;
		this.socket.emit("kick_request", {
			targetUserName,
			channelId:this.currentChannelId,
			authorUserId: this.user.userId
		});
	}

	/**
	 * Set or Unset a user as admin in the current channel
	 * @date 4/28/2023 - 2:56:11 PM
	 *
	 * @param {string} targetUserName name of the targeted user
	 * @param {boolean} action `true` to set as admin, `false` to unset
	 */
	user_admin(targetUserName: string, action: boolean)
	{

		if (this.isCurrentDM || this.currentChannelId == -1)
			return;
		this.socket.emit('admin_request', 
		{
			authorUserId:this.user.userId,
			targetUserName,
			channelId:this.currentChannelId,
			action,
		});
	}

	/**
	 * Ban or Unban user from the current channel
	 * @date 4/28/2023 - 2:59:36 PM
	 *
	 * @param {string} targetUserName name of the targeted user
	 * @param {boolean} action `true` to ban, `false` to unban
	 */
	ban_user(targetUserName: string, action: boolean)
	{
		if (this.isCurrentDM || this.currentChannelId == -1)
			return;
		this.socket.emit("ban_request", {
			authorUserId:this.user.userId,
			targetUserName,
			channelId:this.currentChannelId,
			action,
		});
	}
	
	/**
	 * Invite or uninvite user to the current channel
	 * @date 4/28/2023 - 3:00:48 PM
	 *
	 * @param {string} targetUserName
	 * @param {boolean} action
	 */
	invite_user(targetUserName: string, action: boolean)
	{
		if (this.isCurrentDM || this.currentChannelId == -1)
			return;
		this.socket.emit("invite_request", {
			authorUserId:this.user.userId,
			targetUserName,
			channelId:this.currentChannelId,
			action,
		});
	}

	block_user(targetUserName: string, action: boolean)
	{
		console.log("targetUser:", targetUserName);
		this.socket.emitWithAck("block_request", {targetUserName, action}).then(userId => {
			if (action)
				this._user.blocked?.push({userId});
			else if (this._user.blocked != undefined)
				this.delete_user_from_array(userId, this._user.blocked);
		}).catch
	}

	/*******************
	 * UTILS FUNCTIONS *
	 *******************/

	/**
	 * Will populate the user search array
	 * @date 5/6/2023 - 5:39:50 PM
	 *
	 * @param {string} username the username to search
	 */
	async search_user(username: string): Promise<string[]>
	{
		if (username == null || username.length == 0)
			return [];

		return this.socket.emitWithAck("search_username", username);
	}
	
	isAdmin(userId: number) : boolean
	{
		if (this.isCurrentDM) return false;
		const chan = this._group_channels.get(this.currentChannelId);

		if (chan == undefined) return false;

		return (chan.ownerId == userId || chan.admins.includes({userId}))
	}

	isOwner(userId: number) : boolean
	{
		if (this.isCurrentDM) return false;
		const chan = this._group_channels.get(this.currentChannelId);

		if (chan == undefined) return false;

		return (chan.owner.userId == this.user.userId);
	}

	isBlocked(userId: number) : boolean
	{
		return (this._user.blocked?.find(user => {
			return user.userId == userId;
		}) != undefined);
	}

	/******************************
	 * INTERNAL PRIVATE FUNCTIONS *
	*******************************/

	
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


	private removeChannel(channelId: number)
	{
		if (this._group_channels.delete(channelId) == false)
			this._dm_channels.delete(channelId);
		if (channelId == this.currentChannelId)
			this.currentChannelId = -1;
	}

	private initSocket() {
		


		/******************
		 * CHANNEL EVENTS *
		 ******************/

		this.socket.on('message', (message: MessageDTO) => {
			console.log("received message:", message);

			if(this._group_channels.has(message.channelId))
				this.groupChannels.get(message.channelId)?.channel.messages.push(message);
			else if (this._dm_channels.has(message.channelId))
				this._dm_channels.get(message.channelId)?.channel.messages.push(message);
		});
		
		this.socket.on('user_joined_room', (payload: ChanNotifDTO) => {

			let chan = this._group_channels.get(payload.channelId);

			if (chan != undefined && !chan.channel.users.includes({userId:payload.targetUserId}))
				chan.channel.users.push({userId:payload.targetUserId});
		});
		
		this.socket.on('user_left_room', (payload: ChanNotifDTO) => {
			this.delete_user_from_chan(payload.targetUserId, payload.channelId);
		});

		this.socket.on("chan_deleted", (channelId: number) => {
			this.removeChannel(channelId);
		});

		this.socket.on("user_kicked", (payload: ChanNotifDTO) => {
			if (payload.targetUserId == this.user.userId)
				this.removeChannel(payload.channelId);
			else
				this.delete_user_from_chan(payload.targetUserId, payload.channelId);

		});

		this.socket.on("user_banned", (payload: ChanNotifDTO) => {
			if (payload.targetUserId == this.user.userId)
				this.removeChannel(payload.channelId);
			else
				this.delete_user_from_chan(payload.targetUserId, payload.channelId);
		});

		this.socket.on("invite_update", (payload: inviteUpdateDTO) => {
			if (payload.targetUserId == this.user.userId)
			{
				this._group_channels.set(payload.channel.channelId, payload.channel);
			}
			// let channel = this._group_channels.get(payload.channelId);
			// if (channel != undefined)
			// {
			// 	if (payload.action == true ) {
			// 		channel.invited.push({userId:payload.targetUserId});
			// 	} else {
			// 		this.delete_user_from_array(payload.targetUserId, channel.invited);
			// }
			// }
		});

		this.socket.on("chan_type_update", (payload: ChanTypeRequestDTO) => {
			let chan = this._group_channels.get(payload.channelId);

			if (chan != undefined)
				chan.type = payload.type;
		});

		this.socket.on("admin_update", (payload: ChanNotifDTO) => {
			let chan = this._group_channels.get(payload.channelId);

			if (chan != undefined)
			{
				if (payload.action == true)
					chan.admins.push({userId:payload.targetUserId});
				else
					this.delete_user_from_array(payload.targetUserId, chan.admins);
			}
		});

		this.socket.on("owner_update", (payload: ChanNotifDTO) => {
			let chan = this._group_channels.get(payload.channelId);

			if (chan !== undefined)
			{
				chan.owner = {userId: payload.targetUserId};
			}
		});

		this.socket.on("game_invite_expire", (payload: MessageDTO) => {
			let msg: MessageDTO | undefined;
			if (this._dm_channels.has(payload.channelId))
			{
				msg = this._dm_channels.get(payload.channelId)?.channel.messages.find(msg => {
					return msg.gameInvite?.uid == payload.gameInvite?.uid;
				});
			}
			else
			{
				msg = this._group_channels.get(payload.channelId)?.channel.messages.find(msg => {
					return msg.gameInvite?.uid == payload.gameInvite?.uid;
				});
			}

			if (msg != undefined && msg.gameInvite != undefined)
			{
				msg.gameInvite.status = 'EXPIRED';
			}
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

		this.socket.on("user_update", (userId: number) => {
			if (this._other_users.has(userId))
			{
				this._other_users.get(userId)?.loadUser(userId);
			}
		})

		this.socket.on("public_chans", (payload: {channels: GroupChannelSnippetDTO[], add: boolean}) => {

			if (payload.add == true)//if we want to add or update channels to the list of public chans
			{
				payload.channels.forEach(channel => {
					if (channel.type == 'PUBLIC')
					{
						this._visible_key_channels.delete(channel.channelId);
						this._visible_public_channels.set(channel.channelId, channel);
					}
					else if (channel.type == 'KEY') {
						this._visible_public_channels.delete(channel.channelId);
						this._visible_key_channels.set(channel.channelId, channel);
					}
				})
			}
			else
			{
				payload.channels.forEach(channel => {
					this._visible_public_channels.delete(channel.channelId);
					this._visible_key_channels.delete(channel.channelId);
				})
			}
		})

		this.socket.on("dm_starting", (payload: DMChannelDTO) => {
			if (payload.channel.users.length > 1)
				this.delete_user_from_array(this.user.userId, payload.channel.users);

			this._dm_channels.set(payload.channelId, payload);
		})

	}
}

export default reactive<Chat>(new Chat())
