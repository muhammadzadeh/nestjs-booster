import { ThrottlerGuard } from '@nestjs/throttler';

import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  private readonly ignoredControllers = new Set(['HealthController']);

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const controller = context.getClass();
    return this.ignoredControllers.has(controller.name);
  }

  protected getTracker(req: Record<string, any>): Promise<string> {
    return req.ips && req.ips.length ? req.ips[0] : req.ip;
  }
}
