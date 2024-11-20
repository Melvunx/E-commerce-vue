import { Router } from "express";
import { getItems } from "../controller/items.controller";
const router = Router();

router.get("/", getItems);

module.exports = router;
