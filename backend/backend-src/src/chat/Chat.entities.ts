import { ChanType, GameType } from "@prisma/client"
import { Type } from "class-transformer";
import { IsBase64, IsBoolean, IsDate, IsDefined, IsEnum, IsNegative, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested, isBase64, isDefined } from "class-validator";

// export enum gameType {
// 	NORMAL,
// 	CUSTOM,
// }


export const gameType: {
	NORMAL: 'NORMAL',
	CUSTOM: 'CUSTOM'
} = {
	NORMAL: 'NORMAL',
	CUSTOM: 'CUSTOM'
}

export type gameType = typeof gameType[keyof typeof gameType]
/**
 * TRANSFER OBJECTS
 * 
 * These interface represent how objects like channels or users
 * are transfered over the network
 * and stored in the client
 */

export class GameInvite {

	status: 'PENDING' | 'EXPIRED';
	type: gameType;

	uid: string;
}

export interface MessageDTO {
	id: number,
	channelId: number,
	content: string,
	author: SimpleChatUserDTO,
	postedAt: Date,
	gameInvite?: GameInvite,
}

export interface ChannelDTO {
	id: number,
	users: SimpleChatUserDTO[],
	messages: MessageDTO[]
}

export interface GroupChannelDTO{
	channelId: number,
	channel: ChannelDTO,
	name: string,
	admins: SimpleChatUserDTO[],
	invited: SimpleChatUserDTO[],
	owner: SimpleChatUserDTO,
	ownerId: number,
	type: ChanType,
}

export interface DMChannelDTO {
	channelId:number,
	channel: ChannelDTO
}

export interface GroupChannelSnippetDTO{
	channelId: number,
	// channel: ChannelDTO,
	name: string,
	type: ChanType,
}


export class gameInviteArgs {
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(gameType)
	gameType: gameType;
}

export class CreateMessageDto {
	@IsNumber()
	authorId: number;

	@IsNumber()
	ChannelId: number;

	@IsString()
	content: string;

	@IsOptional()
	// @ValidateNested()
	// @Type(() => gameInviteArgs)
	gameInvite?: gameInviteArgs;
}

//there are two different ChatUserDTOs
//because i only want to send array of ids to represent
//members, invites, bans etc
//and only send once and on every update
//the full Chat UserDTO since it is going to be a pretty heavy object
export interface SimpleChatUserDTO {
	userId: number
}

export class ChatUserDTO {
	userId: number;
	user: {
		id: number,
		username: string
	};
	joinedChannels?: ChannelDTO[];
	invites?: GroupChannelSnippetDTO[];
	blocked?: SimpleChatUserDTO[];
}




/****************
 * UPDATE EVENTS
 * 
 * they are here to inform of data change,
 * a user joined a channel or changed their username by example
 ***************/
export interface NewChannelOwnerDTO {
	newOwner: SimpleChatUserDTO,
	channelId: number,
}

export interface inviteUpdateDTO {
	targetUserId: number,
	channel: GroupChannelDTO,
}

export interface ChanNotifDTO {
	callerUserId?: number,
	targetUserId: number,
	channelId: number,
	action?: boolean,
}

/*****************
 * CHANNEL REQUESTS
 * 
 * All those interfaces are used to send a request to the server
 * and sometimes used by the serer as updates when possible
*****************/
export class joinRequestDTO {

	@ValidateIf(o => o.channelId == undefined)
	@IsNotEmpty()
	channelName?: string;

	@ValidateIf(o => o.channelName == undefined)
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	channelId?: number;

	@IsString()
	@MaxLength(72)
	@IsOptional()
	key?: string;
}

export class basicChanRequestDTO {
	@IsDefined()
	@IsNumber()
	@IsPositive()
	authorUserId: number;
	
	@IsDefined()
	// @IsString()
	@IsNumber()
	@IsPositive()
	targetUserId: number;
	
	@IsDefined()
	@IsNumber()
	@IsPositive()
	channelId: number;
}

export class ChanRequestDTO {
	@IsDefined()
	@IsNumber()
	@IsPositive()
	authorUserId: number;
	
	@IsDefined()
	// @IsString()
	@IsNumber()
	@IsPositive()
	targetUserId: number;
	
	@IsDefined()
	@IsNumber()
	@IsPositive()
	channelId: number;
	
	@IsDefined()
	@IsBoolean()
	action: boolean; //true means set/do action, false means undo/unset
}

export class ChanTypeRequestDTO {

	@IsDefined()
	@IsNumber()
	@IsPositive()
	authorUserId: number;
	
	@IsDefined()
	@IsNumber()
	@IsPositive()
	channelId: number;

	@IsEnum(ChanType)
	@IsDefined()
	type: ChanType;

	@IsOptional()
	@IsString()
	@MaxLength(72) //because bcrypt hash have a limit of 72 for the pass
	key?: string
}

export class ChanKeyRequestDTO {

	@IsDefined()
	@IsNumber()
	@IsPositive()
	authorUserId: number;

	@IsDefined()
	@IsNumber()
	@IsPositive()
	channelId: number;

	@IsDefined()
	@IsString()
	@MaxLength(72)
	key: string
}

export class DMRequestDTO {
	@IsDefined()
	@IsNumber()
	callerUserId: number;

	@IsDefined()
	@IsNumber()
	@IsPositive()
	targetUserId: number;
}

export class MuteDTO {

	@IsDefined()
	@IsNumber()
	@IsPositive()
	authorUserId: number;

	@IsDefined()
	@IsNumber()
	targetUserId: number;

	@IsDefined()
	@IsNumber()
	@IsPositive()
	groupChannelId: number;

	// @IsDate()
	durationInMinutes: number;
}

export class searchQueryDTO {
	@IsDefined()
	username: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	channelId?: number;
}

// export interface GroupChannelUpdateDTO {
// 	name?: string,
// 	admins?: SimpleChatUserDTO[],
// 	invited?: SimpleChatUserDTO[],
// 	owner?: SimpleChatUserDTO,
// 	type?: ChanType
// }
