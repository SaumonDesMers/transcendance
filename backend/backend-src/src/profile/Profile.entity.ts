import { Profile } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class ProfileEntity implements Profile {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	username: string;
}
