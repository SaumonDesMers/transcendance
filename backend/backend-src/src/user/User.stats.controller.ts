import { Body,
	Controller,
	Get,
	Param,
	Patch,
	Put,
	Post,
	Query,
	ParseIntPipe,
	Delete,
	NotFoundException,
	Req,
	UseInterceptors,
	UploadedFile,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { UserEntity, UserWithGameCountEntity } from "./User.entity";
import { Public } from "src/auth/public.decorator";
import { exclude } from "./User.service";

@Controller('games')
@ApiTags('games')
export class GameStatController
{
	constructor(private prismaService: PrismaService) {}

	@Get('ladder')
	@ApiCreatedResponse({type: UserWithGameCountEntity, isArray: true})
	@ApiQuery({
		name: 'take',
		type: Number,
		description: "Number of users requested, defaults to 5",
		required: false
	})
	async getLadder(
		@Query('take') take?: number,
	) : Promise<UserWithGameCountEntity[]>
	{
		if (take == undefined)
			take = 5;

		const ladder = await this.prismaService.user.findMany({
			orderBy: {
				winningGames: {
					_count: 'desc'
				}
			},
			take:take,
			include: {
				_count: {
					select: {
						winningGames: true,
						losingGames: true
					}
				}
			},
		});

		let ladderWithoutSecret = new Array;
		ladder.forEach(user => {
			ladderWithoutSecret.push(exclude(user, ['twoFactorAuthenticationSecret', 'isTwoFactorAuthenticationEnabled', 'darkMode']));
		})
		return ladderWithoutSecret;
	}


	@ApiQuery({
		name: 'take',
		type: Number,
		description: "Number of games requested, defaults to 5",
		required: false
	})
	@Get('user-history/:id')
	async getuserHistory(
		@Param('id', ParseIntPipe) userId: number,
		@Query('take') take?: number
	)
	{
		if (take == undefined)
			take = 5;
		try {
		const user = await this.prismaService.user.findUniqueOrThrow({
			where: {
				id:userId
			}
		}); } catch (e) {
			throw new HttpException("user not found", HttpStatus.NOT_FOUND);
		}

		const history = await this.prismaService.game.findMany({
			where: {
				OR: [
					{
						loserId:userId
					},
					{
						winnerId:userId
					},
				]
			},
			orderBy: {
				id: 'desc' //since ids are auto increment, highest id first means chronological most recent first
			},
			take: take
		});

		return history;
	}

	@Get('user-stat/:id')
	async getUserStats(
		@Param('id', ParseIntPipe) id: number
	)
	{
		try {
			let user:any = await this.prismaService.user.findUniqueOrThrow({
				where: {id},
				select: {
					id: true,
					_count: {
						select: {
							winningGames: true,
							losingGames: true
						}
					}
				}
			});

			const idk:any  = this.prismaService.user.groupBy({
				by: ['id'],
				_count: {
					
				}
			});

		// 	const bis = this.prismaService.user.findMany({
		// 		where: {
		// 			winningGames: {
						
		// 			}
		// 		}
		// 		select: {
		// 			_count: {
		// 				select: {
		// 					winningGames: {
		// 						where: {
									
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// });
		
			const rank = (await this.prismaService.game.groupBy({
				by: ['winnerId'],
				having: {
					winnerId: {
						_count: {
							gt: user._count.winningGames
						}
					}
				},
			})).length + 1;

			user.rank = rank;

			return user;
		} catch (e: any) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		}
	}
}
