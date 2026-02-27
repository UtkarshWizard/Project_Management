import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes"
import subscriptionRoutes from "./modules/subscriptions/subscription.routes"
import projectRoutes from "./modules/project/project.routes"
import memberRoutes from "./modules/member/member.routes"

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health" , (_, res) => {
    res.json( {status: "ok"} );
})

app.use("/auth" , authRoutes);
app.use("/subscription" , subscriptionRoutes);
app.use("/projects" , projectRoutes);
app.use("/members" , memberRoutes)