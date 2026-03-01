import { Request, Response } from "express";
export declare function createProject(req: Request, res: Response): Promise<void>;
export declare function listProjects(req: Request, res: Response): Promise<void>;
export declare function archiveProject(req: Request, res: Response): Promise<void>;
export declare function deleteProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function exportProjects(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map