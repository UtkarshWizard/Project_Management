import { Request, Response } from "express";
import * as analyticsService from "./analytics.service";

export async function getBasicAnalytics(req: Request, res: Response) {
    try {
        const organizationId = req.organizationId!;
        const result = await analyticsService.getBasicAnalytics(organizationId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch analytics"
        });
    }
}

export async function getAdvancedAnalytics(req: Request, res: Response) {
    try {
        const organizationId = req.organizationId!;
        const result = await analyticsService.getAdvancedAnalytics(organizationId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch advanced analytics"
        });
    }
}
