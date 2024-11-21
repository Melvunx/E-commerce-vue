import { RequestHandler } from "express";
import database from "../config/database";
import { UserAccount } from "../models/account.models";
require("dotenv").config();
const {
  GET_FAVORITE_ITEM,
  ADD_FAVORITE_ITEM,
  FIND_FAVORITE_ITEM,
  DELETE_FAVORITE_ITEM,
} = process.env;

export const getFavorite: RequestHandler = (req, res) => {
  const user: UserAccount = req.cookies.userCookie;

  if (!GET_FAVORITE_ITEM) {
    res.status(500).send({ error: "Sql request not defined" });
    return;
  }

  database.query(GET_FAVORITE_ITEM, [user.id], (err, results) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Error to fetching favorite items", error: err });

    console.log({ favorites: results });
    res.status(200).json({ userFavorites: results });
  });
};

export const addFavorite: RequestHandler = (req, res) => {
  const user: UserAccount = req.cookies.userCookie;
  const { item_id } = req.params;

  if (!user) {
    res.status(401).send({ message: "User not found" });
    return;
  } else if (!item_id) {
    res.status(400).send({ message: "Item's id not found" });
    return;
  } else if (!ADD_FAVORITE_ITEM) {
    res.status(500).send({ message: "SQL query not found" });
    return;
  }

  database.query(ADD_FAVORITE_ITEM, [user.id, item_id], (error) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res
          .status(400)
          .send({ message: "Item is already in favorites", error: error.code });
        return;
      } else {
        res.status(500).send({ message: "Error adding to favorites", error });
        return;
      }
    }

    console.log(`User ${user.username} added to favorite item ${item_id}`);
    res.status(201).json({
      message: `User ${user.username} added to favorite item ${item_id}`,
    });
  });
};

export const deleteFavorite: RequestHandler = (req, res) => {
  const user: UserAccount = req.cookies.userCookie; // Utilisateur connecté
  const { item_id } = req.params; // ID de l'élément à supprimer

  if (!user) {
    res.status(401).send({ message: "User not authenticated" });
    return;
  } else if (!item_id) {
    res.status(400).send({ message: "Item's ID not provided" });
    return;
  } else if (!FIND_FAVORITE_ITEM || !DELETE_FAVORITE_ITEM) {
    res.status(500).send({ error: "SQL query not found" });
    return;
  }

  // Étape 1 : Vérifier si l'élément appartient à l'utilisateur
  database.query(FIND_FAVORITE_ITEM, [user.id, item_id], (err, results) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Error checking favorite item", error: err });
      return;
    }

    if (results.length === 0) {
      res
        .status(404)
        .send({ message: `Favorite item not found for user ${user.username}` });
      return;
    }

    database.query(DELETE_FAVORITE_ITEM, [user.id, item_id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error removing favorite item" });
        return;
      }

      res.status(200).send({
        message: `Favorite item with ID ${item_id} removed for user ${user.username}`,
      });
    });
  });
};
