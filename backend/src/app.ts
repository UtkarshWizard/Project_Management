import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes"

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health" , (_, res) => {
    res.json( {status: "ok"} );
})

app.use("/auth" , authRoutes)