
import { Injectable } from "@nestjs/common";
import { Prisma, Channel, DMChannel } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { PrismaService } from "src/database/prisma.service";
import { DMChannelWithBase,
	GroupChannelWithBase,
	DMChannelWithMembers,
	GroupChannelWithMembers} from "./Chat.module";

const includeChannelUsers = Prisma.validator<Prisma.ChannelArgs>()({include: {users: true}});
const includeDMChannel = Prisma.validator<Prisma.DMChannelInclude>()({channel: includeChannelUsers});
const includeGroupChannel = Prisma.validator<Prisma.GroupChannelInclude>()({channel: includeChannelUsers});

type AllDMChannels = DMChannelWithBase | DMChannelWithMembers;
type AllGroupChannels = GroupChannelWithBase | GroupChannelWithMembers;

//go see the comments in message.repository
@Injectable()
export class ChannelRepository {
	constructor(private prisma: PrismaService) {}

	async createDMChannel(input: Prisma.DMChannelCreateInput, include?: Prisma.DMChannelInclude) {
			return this.prisma.dMChannel.create({
				data: input,
				include
			});
	}

	async createGroupChannel(input: Prisma.GroupChannelCreateInput, include?: Prisma.GroupChannelInclude) {
			return this.prisma.groupChannel.create({
				data: input,
				include,
			});
	}

	async getDMChannels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.DMChannelWhereUniqueInput;
		where?: Prisma.DMChannelWhereInput;
		orderBy?: Prisma.DMChannelOrderByWithAggregationInput; 
		include?: Prisma.DMChannelInclude;
	}) {
		const {skip, take, cursor, where, orderBy, include } = params;
		return this.prisma.dMChannel.findMany({skip, take, cursor, where, orderBy,
			include});
	}

	async getGroupChannels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.GroupChannelWhereUniqueInput;
		where?: Prisma.GroupChannelWhereInput;
		orderBy?: Prisma.GroupChannelOrderByWithAggregationInput; 
		include?: Prisma.GroupChannelInclude;
	}) {
		const {skip, take, cursor, where, orderBy, include } = params;
		return this.prisma.groupChannel.findMany({skip, take, cursor, where, orderBy, 
			include});
	}

	async getSingleDMChannel(params: Prisma.DMChannelWhereUniqueInput,
		include: Prisma.DMChannelInclude) {
		return this.prisma.dMChannel.findUniqueOrThrow({
			where:params,
			include});
	}

	async getSingleGroupChannel(params: {where: Prisma.GroupChannelWhereUniqueInput,
		include: Prisma.GroupChannelInclude}) {
		const { where, include } = params;
		return this.prisma.groupChannel.findUniqueOrThrow({
			where,
			include
		});
	}

	async getSingleChannel(params: Prisma.ChannelWhereUniqueInput,
		include?: Prisma.ChannelInclude) {
		return this.prisma.channel.findUnique({
			where: params,
			include
		});
	}

	async updateDMChannel(params: {
		where: Prisma.DMChannelWhereUniqueInput;
		data: Prisma.DMChannelUpdateInput;
		include?: Prisma.DMChannelInclude
	}) {
		const { where, data, include } = params;
		return this.prisma.dMChannel.update({where, data,
			include});
	}

	async updateGroupChannel(params: {
		where: Prisma.GroupChannelWhereUniqueInput;
		data: Prisma.GroupChannelUpdateInput;
		include?: Prisma.GroupChannelInclude
	}) {
		const { where, data, include } = params;
		return this.prisma.groupChannel.update({where, data,
			include});
	}

	async deleteDMChannel(params: {
		where: Prisma.DMChannelWhereUniqueInput;
	}, includeMembers: boolean) : Promise<AllDMChannels> {
		const { where } = params;
		return this.prisma.dMChannel.delete({where,
			include: {channel: {include: { users: includeMembers}}}});
	}

	async deleteGroupChannel(params: {
		where: Prisma.GroupChannelWhereUniqueInput;
	}, includeMembers: boolean) : Promise<AllGroupChannels> {
		const { where } = params;
		return this.prisma.groupChannel.delete({where,
			include: {channel: {include: { users: includeMembers}}}});
	}
}
