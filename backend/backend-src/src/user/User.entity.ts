import { User,
		Coa } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { UserWithoutSecret } from "./User.module";

export class UserEntity implements UserWithoutSecret {
	@ApiProperty({uniqueItems: true})
	id: number;

	@ApiProperty()
	username: string;

	@ApiProperty()
	darkMode: boolean;

	@ApiProperty()
	isTwoFactorAuthenticationEnabled: boolean;

	@ApiProperty()
	coa: Coa;

	@ApiProperty()
	picture: string | null;

	@ApiProperty()
	bio: string
}

export class UserWithGameCountEntity extends UserEntity {
	
	@ApiProperty()
	_count : {
		winningGames: number,
		losingGames: number,
	}
}

export class UserStatsEntity {
	@ApiProperty()
	_count : {
		winningGames: number,
		losingGames: number,
	}
}
