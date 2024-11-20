import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { OkPacket } from "mysql";
import database from "../config/database";
import { UserAccount } from "../models/account.models";

const {
  SALTROUNDS_NUMBER,
  CHECK_USER,
  CHECK_EMAIL,
  INSERT_NEW_USER,
  CREATE_USER_BASKET,
} = process.env;

//Fonction d'enregistrement d'un nouvel utilisateur
export const registerUser: RequestHandler<{}, {}, UserAccount> = (req, res) => {
  const { username, password, email, firstname, lastname, birth_date } =
    req.body;

  // Vérification de la conformité du mot de passe
  if (password.length < 6) {
    res.status(400).send({ message: "Password needs 6 characters minimum!" });
    return;
  }

  // Vérification des variables d'environnement
  if (!CHECK_USER || !CHECK_EMAIL || !INSERT_NEW_USER || !CREATE_USER_BASKET) {
    res.status(500).send({ error: "SQL request is not defined" });
    return; // Ajoutez un return pour arrêter l'exécution
  }

  // Vérifiez si l'utilisateur existe déjà
  database.query(
    CHECK_USER,
    [username],
    (err, results: UserAccount["username"][]) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ message: "Error checking username", error: err });
      } else if (results.length > 0)
        return res.status(400).send({ message: "Username already exists" });
    }
  );

  // Vérifiez si l'email existe déjà
  database.query(
    CHECK_EMAIL,
    [email],
    (err, results: UserAccount["email"][]) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error checking email", error: err });
        return;
      } else if (results.length > 0) {
        res.status(400).send({ message: "Email already exists" });
        return;
      }
    }
  );

  // Génération du mot de passe haché
  const saltRounds = Number(SALTROUNDS_NUMBER);
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash_password = bcrypt.hashSync(password, salt);

  //Insertion dans la base de donnée
  database.query(
    INSERT_NEW_USER,
    [username, hash_password, email, firstname, lastname, birth_date],
    (err, newUser: OkPacket) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error inserting new user", error: err });
        return;
      }

      const userId = newUser.insertId;

      database.query(CREATE_USER_BASKET, [userId], (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .send({ message: "Error creating user basket", error: err });
        }
        console.log(`New user created : ${username}, ${firstname}`);
        return res.status(201).json({
          message: `User ${username} created`,
          details: { username, email, firstname, lastname, birth_date },
        });
      });
    }
  );
};
