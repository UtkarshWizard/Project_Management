import { prisma } from "../src/config/prisma";

interface Plan {
    id: string;
    name: string;
    maxProjects: number | null;
    maxMembers: number | null;
}

interface Feature {
    id: string;
    code: string;
    description: string | null;
}

async function main(): Promise<void> {
    console.log("Seeding Database ...");

    const freePlan: Plan = await prisma.plan.upsert({
        where : { name: "Free"},
        update: {},
        create: {
            name : "Free",
            maxProjects: 3,
            maxMembers: 5,
        },
    });

    const proPlan: Plan = await prisma.plan.upsert({
        where : { name: "Pro"},
        update: {},
        create: {
            name: "Pro",
            maxProjects: 10,
            maxMembers: 20,
        },
    });

    const enterprisePlan: Plan = await prisma.plan.upsert({
        where: { name: "Enterprise"},
        update: {},
        create: {
            name: "Enterprise",
            maxProjects: null,
            maxMembers: null,
        }
    });

    const featureCode: string[] = [
        "CREATE_PROJECT",
        "ADD_MEMBER",
        "VIEW_ANALYTICS",
        "ADVANCED_ANALYTICS",
        "EXPORT_PROJECT",
        "ARCHIVE_PROJECT",
    ]

    const features: Feature[] = [];

    for ( const code of featureCode) {
        const feature: Feature = await prisma.feature.upsert({
            where : { code },
            update: {},
            create: {
                code,
                description: code,
            }
        });

        features.push(feature);
    }

    async function attatchFeatures(planId: string, featureCode: string[]): Promise<void> {
        for (const code of featureCode) {
            const feature: Feature | undefined = features.find((f) => f.code === code);
            if (!feature) continue;

            await prisma.planFeature.upsert({
                where : {
                    planId_featureId: {
                        planId,
                        featureId: feature.id,
                    }
                },
                update: {},
                create: {
                    planId,
                    featureId: feature.id
                }
            })
        }
    }

    await attatchFeatures( freePlan.id , [
        "CREATE_PROJECT",
        "ADD_MEMBER",
    ])

    await attatchFeatures( proPlan.id , [
        "CREATE_PROJECT",
        "ADD_MEMBER",
        "VIEW_ANALYTICS",
        "EXPORT_PROJECT",
        "ARCHIVE_PROJECT",
    ])

    await attatchFeatures( enterprisePlan.id, [
        "CREATE_PROJECT",
        "ADD_MEMBER",
        "VIEW_ANALYTICS",
        "EXPORT_PROJECT",
        "ARCHIVE_PROJECT",
        "ADVANCED_ANALYTICS",
    ]);

    console.log( " Seeding Completed ...");
}

main()
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect();
    })