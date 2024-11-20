import { RequestHandler } from "express";
import database from "../config/database";
const { GET_ITEMS } = process.env;

export const getItems: RequestHandler = (req, res) => {
  if (!GET_ITEMS) {
    res.status(500).send({ error: "Sql request not found" });
    return;
  }

  database.query(GET_ITEMS, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Error fetching items", error: err });
    }

    console.log({ items: results });
    res.status(200).send({ items: results });
  });
};
