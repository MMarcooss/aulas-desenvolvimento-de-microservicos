import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const PERMISSIONS_KEY = "permissions";

export const RequiredPermissions = (...permissions: string[]) => {
	return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value);
		return descriptor;
	};
};

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
			PERMISSIONS_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredPermissions || requiredPermissions.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user || !user.permissions) {
			throw new ForbiddenException("Access denied");
		}

		const hasPermission = requiredPermissions.some((permission) =>
			user.permissions.includes(permission),
		);

		if (!hasPermission) {
			throw new ForbiddenException("Insufficient permissions");
		}

		return true;
	}
}
