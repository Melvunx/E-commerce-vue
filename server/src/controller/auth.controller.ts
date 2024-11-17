import bcrypt from "bcrypt";
import { Request, Response } from "express";
import database from "../config/database";
import { UserAccount } from "../models/account.models";

const { SALTROUNDS_NUMBER, CHECK_USER, CHECK_EMAIL, INSERT_NEW_USER } =
  process.env;

export const registerUser = async (
  req: Request<{}, {}, UserAccount>,
  res: Response
) => {
  const { username, password, email, firstname, lastname, birth_date } =
    req.body;

  if (password.length < 6)
    return res
      .status(500)
      .send({ error: "Password need 6 characters minimum !" });
  // Vérification de l'unicité de username
  if (!CHECK_USER || !CHECK_EMAIL || INSERT_NEW_USER)
    return res.status(500).send({ message: "Sql resquest is not defined" });

  try {
    await database.query(
      CHECK_USER,
      [username],
      (err, results: UserAccount["username"][]) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Error to check username" });
        } else if (results.length > 0)
          return res.status(500).send({ message: "Username already exist" });
      }
    );

    await database.query(
      CHECK_EMAIL,
      [email],
      (err, results: UserAccount["email"][]) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Error to check email" });
        } else if (results.length > 0)
          return res.status(500).send({ message: "Email already exist" });
      }
    );

    if (!SALTROUNDS_NUMBER) {
      return res.status(500).send({ message: "Saltrounds is not defined" });
    } else {
      await bcrypt
        .genSalt(Number(SALTROUNDS_NUMBER))
        .then(async (salt) => {
          return await bcrypt.hash(password, salt);
        })
        .then(async (hash_password) => {
          console.log(`Hashed password: ${hash_password}`);
          if (!INSERT_NEW_USER) {
            return res
              .status(500)
              .send({ message: "Sql resquest is not defined" });
          } else {
            await database.query(
              INSERT_NEW_USER,
              [username, password, email, firstname, lastname, birth_date],
              (err, inserts: UserAccount) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .send({ message: "Error to insert new user" });
                } else {
                  console.log(`New user inserted: ${inserts}`);
                  return res
                    .status(201)
                    .send({ message: `User ${username} created` });
                }
              }
            );
          }
        });
    }
  } catch (error) {
    throw new Error(`Catched error :${error}`);
  }
};
