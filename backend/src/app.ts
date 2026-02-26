import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes"
import { authenticate } from "./middlewares/auth.middleware";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health" , (_, res) => {
    res.json( {status: "ok"} );
})

app.get("/me" , authenticate , (req , res) => {
    res.json({
        user: req.user,
        organizationId: req.organizationId
    })
})

app.use("/auth" , authRoutes)