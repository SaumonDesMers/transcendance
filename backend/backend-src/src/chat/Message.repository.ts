import { Injectable } from "@nestjs/common";
import { Prisma, Message } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";

type AllMessagesTypes = Message | MessageWithAll | MessageWithAuthor | MessageWithChannel;


//I dont know how to type all these wrapper functions
//i'd like to find a way to strongly type them in a genereic/templatey way
//but that seems impossible/too complex for me
//so i'm jutse letting the types infer automatically
//another option would be to decide at this layer what the includes will be and then strongly type in a not
//generic/templatey way my functions but i dont like this
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
