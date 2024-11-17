import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import database from "../config/database";
import { UserAccount } from "../models/account.models";

const { SALTROUNDS_NUMBER, CHECK_USER, CHECK_EMAIL, INSERT_NEW_USER } =
  process.env;

export const registerUser: RequestHandler<{}, {}, UserAccount> = async (
  req,
  res
) => {
  const { username, password, email, firstname, lastname, birth_date } =
    req.body;

  if (password.length < 6) {
    res.status(500).send({ error: "Password needs 6 characters minimum!" });
    return; // Ajoutez un return pour arrêter l'exécution
  }

  if (!CHECK_USER || !CHECK_EMAIL || !INSERT_NEW_USER) {
    res.status(500).send({ message: "SQL request is not defined" });
    return; // Ajoutez un return pour arrêter l'exécution
  }

  try {
    // Vérifiez si l'utilisateur existe déjà
    await database.query(
      CHECK_USER,
      [username],
      (err, results: UserAccount["username"][]) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error checking username" });
          return;
        } else if (results.length > 0) {
          res.status(500).send({ message: "Username already exists" });
          return;
        }
      }
    );

    // Vérifiez si l'email existe déjà
    await database.query(
      CHECK_EMAIL,
      [email],
      (err, results: UserAccount["email"][]) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error checking email" });
          return;
        } else if (results.length > 0) {
          res.status(500).send({ message: "Email already exists" });
          return;
        }
      }
    );

    // Génération du mot de passe haché
    const saltRounds = Number(SALTROUNDS_NUMBER);
    const salt = await bcrypt.genSalt(saltRounds);
    const hash_password = await bcrypt.hash(password, salt);

    await database.query(
      INSERT_NEW_USER,
      [username, hash_password, email, firstname, lastname, birth_date],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error inserting new user" });
          return;
        } else {
          res.status(201).send({
            message: `User ${username} created`,
            details: { username, email, firstname, lastname, birth_date },
          });
          return;
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Caught error: ${error}` });
    return;
  }
};
