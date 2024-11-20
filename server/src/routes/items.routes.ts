import { Router } from "express";
import {
  addFavorite,
  deleteFavorite,
  getFavorite,
} from "../controller/favorite.controller";
import { getItems } from "../controller/items.controller";
import { userAuthentification } from "../middleware/auth.middleware";
const router = Router();

router.get("/", getItems);

// Favorite route
router.get("/favorite", userAuthentification, getFavorite);
router.post("/favorite/:item_id", userAuthentification, addFavorite);
router.delete(
  "/favorite/:item_id",
  userAuthentification,
  deleteFavorite
);

module.exports = router;
