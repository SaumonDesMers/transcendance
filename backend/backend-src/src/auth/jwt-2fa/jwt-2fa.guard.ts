import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			'IS_PUBLIC', [context.getHandler(), context.getClass()]
		);
		if (isPublic)
			return true;
		return super.canActivate(context);
	}
}