import { Injectable } from "@nestjs/common";
import { Prisma, Message } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";

type AllMessagesTypes = Message | MessageWithAll | MessageWithAuthor | MessageWithChannel;

export class MessageRepository {
	constructor(private prisma: PrismaService) {}

	async createMessage(input: Prisma.MessageCreateInput, include: Prisma.MessageInclude) {
		return this.prisma.message.create({
			data: input,
			include
		});
	}

	async getMessages(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.MessageWhereUniqueInput;
		where?: Prisma.MessageWhereInput;
		orderBy?: Prisma.MessageOrderByWithAggregationInput; 
	}, include: Prisma.MessageInclude) {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.message.findMany({skip, take, cursor, where, orderBy, include});
	}

	async getSingleMessage(params: Prisma.MessageWhereUniqueInput,
		include: Prisma.MessageInclude) {
		return this.prisma.message.findUniqueOrThrow({
			where:params,
			include,
		});
	}

	async updateMessage(params: {
		where: Prisma.MessageWhereUniqueInput;
		data: Prisma.MessageUpdateInput;
	}, include: Prisma.MessageInclude) {
		const { where, data } = params;
		return this.prisma.message.update({where, data, include});
	}

	async deleteMessage(params: {
		where: Prisma.MessageWhereUniqueInput;
	}, include: Prisma.MessageInclude) {
		const { where } = params;
		return this.prisma.message.delete({where, include});
	}
}
