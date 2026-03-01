import { NextFunction, Request, Response } from "express";
export declare function requireFeature(featureCode: string): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=requireFeature.middleware.d.ts.map