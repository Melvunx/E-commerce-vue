import { Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller";
const router = Router();

router.post("/register", registerUser);
router.get("/login", loginUser);

module.exports = router;
