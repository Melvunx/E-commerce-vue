import { Request, Response } from "express";
import database from "../config/database";
require("dotenv").config();
const { GET_USER, GET_PROFILE } = process.env;

export function getUser(req: Request, res: Response) {
  if (!GET_USER)
    return res.status(500).send({ message: "Sql resquest is not defined" });

  database.query(GET_USER, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error fetching user" });
    }
    console.log(results);
    res.status(200).send({ results });
  });
}

export function getProfileInfo(req: Request, res: Response) {
  if (!GET_PROFILE)
    return res.status(500).send({ message: "Sql resquest is not defined" });

  database.query(GET_PROFILE, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error fetching user profile" });
    }
    console.log(result);
    res.status(200).send({ result });
  });
}
