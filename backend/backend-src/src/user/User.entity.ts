import { User,
		Coa } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UserEntity implements User {
	@ApiProperty({uniqueItems: true})
	id: number;

	@ApiProperty()
	username: string;

	@ApiProperty()
	darkMode: boolean;

	@ApiProperty()
	twoFactorAuthenticationSecret: string;

	@ApiProperty()
	isTwoFactorAuthenticationEnabled: boolean;

	@ApiProperty()
	coa: Coa;

	@ApiProperty()
	picture: string | null;

	@ApiProperty()
	bio: string
}
