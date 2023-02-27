
import { Injectable } from "@nestjs/common";
import { Prisma, Channel, DMChannel } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { DMChannelWithBase, GroupChannelWithBase } from "./Chat.module";

export class ChannelRepository {
	constructor(private prisma: PrismaService) {}

	async createDMChannel(input: Prisma.DMChannelCreateInput)
		: Promise<DMChannelWithBase> {
			return this.prisma.dMChannel.create({
				data: input,
				include: {channel: true}
			});
	}

	async createGroupChannel(input: Prisma.GroupChannelCreateInput)
		: Promise<GroupChannelWithBase> {
			return this.prisma.groupChannel.create({
				data: input,
				include: {channel: true}
			});
	}

	async getDMChannels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.DMChannelWhereUniqueInput;
		where?: Prisma.DMChannelWhereInput;
		orderBy?: Prisma.DMChannelOrderByWithAggregationInput; 
	}) : Promise<DMChannelWithBase[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.dMChannel.findMany({skip, take, cursor, where, orderBy, include: {channel: true}});
	}

	async getGroupChannels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.GroupChannelWhereUniqueInput;
		where?: Prisma.GroupChannelWhereInput;
		orderBy?: Prisma.GroupChannelOrderByWithAggregationInput; 
	}) : Promise<GroupChannelWithBase[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.groupChannel.findMany({skip, take, cursor, where, orderBy, include: {channel: true}});
	}

	async getSingleDMChannel(params: Prisma.DMChannelWhereUniqueInput,
		include: Prisma.DMChannelInclude) : Promise<DMChannelWithBase> {
		return this.prisma.dMChannel.findUniqueOrThrow({
			where:params,
			include: {channel: true},
		});
	}

	async getSingleGroupChannel(params: Prisma.GroupChannelWhereUniqueInput,
		include: Prisma.GroupChannelInclude) : Promise<GroupChannelWithBase> {
		return this.prisma.groupChannel.findUniqueOrThrow({
			where:params,
			include: {channel: true},
		});
	}

	async updateDMChannel(params: {
		where: Prisma.DMChannelWhereUniqueInput;
		data: Prisma.DMChannelUpdateInput;
	}, include: Prisma.DMChannelInclude) : Promise<DMChannelWithBase> {
		const { where, data } = params;
		return this.prisma.dMChannel.update({where, data, include: {channel: true}});
	}

	async updateGroupChannel(params: {
		where: Prisma.GroupChannelWhereUniqueInput;
		data: Prisma.GroupChannelUpdateInput;
	}, include: Prisma.GroupChannelInclude) : Promise<GroupChannelWithBase> {
		const { where, data } = params;
		return this.prisma.groupChannel.update({where, data, include: {channel: true}});
	}

	async deleteDMChannel(params: {
		where: Prisma.DMChannelWhereUniqueInput;
	}, include: Prisma.DMChannelInclude) : Promise<DMChannelWithBase> {
		const { where } = params;
		return this.prisma.dMChannel.delete({where, include: {channel: true}});
	}

	async deleteGroupChannel(params: {
		where: Prisma.GroupChannelWhereUniqueInput;
	}, include: Prisma.GroupChannelInclude) : Promise<GroupChannelWithBase> {
		const { where } = params;
		return this.prisma.groupChannel.delete({where, include : {channel: true}});
	}
}
