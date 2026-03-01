export declare function getBasicAnalytics(organizationId: string): Promise<{
    projectCount: number;
    memberCount: number;
}>;
export declare function getAdvancedAnalytics(organizationId: string): Promise<{
    projectCount: number;
    monthlyCount: Record<string, number>;
    memberCount: number;
    projectArchiveCount: number;
    projectActiveCount: number;
    usageCount: number;
}>;
//# sourceMappingURL=analytics.service.d.ts.map