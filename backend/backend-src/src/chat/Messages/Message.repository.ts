import { Injectable } from "@nestjs/common";
import { Prisma, Message } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";

@Injectable
export class MessageRepository {
	constructor(private prisma: PrismaService) {}

	async createMessage() {
		
	}
}
