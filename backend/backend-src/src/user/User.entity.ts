import { User } from "@prisma/client";
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
}
