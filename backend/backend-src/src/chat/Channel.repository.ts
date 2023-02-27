
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

export class ChannelRepository {
	constructor(private prisma: PrismaService) {}

	async createDMChannel(input: Prisma.DMChannelCreateInput, includeMembers: boolean)
		: Promise<AllDMChannels> {
			return this.prisma.dMChannel.create({
				data: input,
				include: {channel: {include: { users: includeMembers}}},
			});
	}

	async createGroupChannel(input: Prisma.GroupChannelCreateInput, includeMembers: boolean)
		: Promise<AllGroupChannels> {
			return this.prisma.groupChannel.create({
				data: input,
				include: {channel: {include: { users: includeMembers}}},
			});
	}

	async getDMChannels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.DMChannelWhereUniqueInput;
		where?: Prisma.DMChannelWhereInput;
		orderBy?: Prisma.DMChannelOrderByWithAggregationInput; 
	}, includeMembers: boolean) : Promise<AllDMChannels[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.dMChannel.findMany({skip, take, cursor, where, orderBy,
			include: {channel: {include: { users: includeMembers}}}});
	}

	async getGroupChannels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.GroupChannelWhereUniqueInput;
		where?: Prisma.GroupChannelWhereInput;
		orderBy?: Prisma.GroupChannelOrderByWithAggregationInput; 
	}, includeMembers: boolean) : Promise<AllGroupChannels[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.groupChannel.findMany({skip, take, cursor, where, orderBy, 
			include: {channel: {include: { users: includeMembers}}}});
	}

	async getSingleDMChannel(params: Prisma.DMChannelWhereUniqueInput,
		includeMembers: boolean) : Promise<AllDMChannels> {
		return this.prisma.dMChannel.findUniqueOrThrow({
			where:params,
			include: {channel: {include: { users: includeMembers}}},
		});
	}

	async getSingleGroupChannel(params: Prisma.GroupChannelWhereUniqueInput,
		includeMembers: boolean) : Promise<AllGroupChannels> {
		return this.prisma.groupChannel.findUniqueOrThrow({
			where:params,
			include: {channel: {include: { users: includeMembers}}},
		});
	}

	async updateDMChannel(params: {
		where: Prisma.DMChannelWhereUniqueInput;
		data: Prisma.DMChannelUpdateInput;
	}, includeMembers: boolean) : Promise<AllDMChannels> {
		const { where, data } = params;
		return this.prisma.dMChannel.update({where, data,
			include: {channel: {include: { users: includeMembers}}}});
	}

	async updateGroupChannel(params: {
		where: Prisma.GroupChannelWhereUniqueInput;
		data: Prisma.GroupChannelUpdateInput;
	}, includeMembers: boolean) : Promise<AllGroupChannels> {
		const { where, data } = params;
		return this.prisma.groupChannel.update({where, data,
			include: {channel: {include: { users: includeMembers}}}});
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
