export declare function getCurrentSubscription(organizationId: string): Promise<{
    plan: any;
    status: any;
    startDate: any;
    endDate: any;
    limits: {
        maxProjects: any;
        maxMembers: any;
    };
}>;
export declare function updgradePlan(organizationId: string, planName: string): Promise<{
    id: string;
    createdAt: Date;
    organizationId: string;
    status: import(".prisma/client").$Enums.SubscriptionStatus;
    startDate: Date;
    endDate: Date | null;
    planId: string;
}>;
//# sourceMappingURL=subscription.service.d.ts.map