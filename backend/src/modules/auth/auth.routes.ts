import { Router } from "express";
import { signUp } from "./auth.controller";
import { signIn } from "./auth.controller";

const router = Router();

router.post("/signup" , signUp);
router.post("/signin" , signIn);

export default router;