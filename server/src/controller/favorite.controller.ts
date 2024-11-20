import { RequestHandler } from "express";
import database from "../config/database";
import { UserAccount } from "../models/account.models";
import { FavoriteItem } from "../models/favoriteItem.models";
require("dotenv").config();
const { GET_FAVORITE_ITEM, ADD_FAVORITE_ITEM, DELETE_FAVORITE_ITEM } =
  process.env;

export const getFavorite: RequestHandler = (req, res) => {
  const user: UserAccount = req.cookies.userCookie;

  if (!GET_FAVORITE_ITEM) {
    res.status(500).send({ error: "Sql request not defined" });
    return;
  }

  database.query(GET_FAVORITE_ITEM, [user.email], (err, results) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Error to fetching favorite items", error: err });

    console.log({ favorites: results });
    res.status(200).send({ favorites: results });
  });
};

export const addFavorite: RequestHandler<FavoriteItem> = (req, res) => {
  const user: UserAccount = req.cookies.userCookie;
  const { item_id } = req.params;

  if (!user) {
    res.send(401).send({ message: "User not found" });
    return;
  } else if (!item_id) {
    res.status(401).send({ message: "Item's id not found" });
    return;
  } else if (!ADD_FAVORITE_ITEM) {
    res.status(404).send({ message: "Sql request not found" });
    return;
  }

  database.query(ADD_FAVORITE_ITEM, [user.id, item_id], (error) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(400).send("Item is already in favorites");
      } else {
        console.error(error);
        res.status(500).send("Error adding to favorites");
      }
      return;
    }

    console.log(`User ${user.username} add to favorite the item ${item_id}`);
    res.status(201).send({
      message: `User ${user.username} add to favorite the item ${item_id}`,
    });
  });
};

export const deleteFavorite: RequestHandler<FavoriteItem> = (req, res) => {
  const user: UserAccount = req.cookies.userCookie;
  const { item_id } = req.params;

  if (!user) {
    res.send(401).send({ message: "User not found" });
    return;
  } else if (!item_id) {
    res.status(400).send({ message: "Item ID is required" });
    return;
  } else if (!DELETE_FAVORITE_ITEM) {
    res.status(404).send({ message: "Sql request not found" });
    return;
  }

  database.query(DELETE_FAVORITE_ITEM, [user.id, item_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error removing from favorites");
    }

    console.log(
      `Favorite item with ID ${item_id} removed for user ${user.username}`
    );

    res.status(200).send({
      message: `Favorite item with ID ${item_id} removed for user ${user.username}`,
    });
  });
};
