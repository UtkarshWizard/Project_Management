import { UsageMetric } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
export declare function requireUsageLimit(metric: UsageMetric): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=requireUsage.middleware.d.ts.map