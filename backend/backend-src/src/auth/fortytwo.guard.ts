import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
	canActivate(context: ExecutionContext): boolean {
		console.log(context.switchToHttp().getRequest())
		return true;
	}
}
