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
  // CHECK_LOGIN,
  // UPDATE_LAST_LOGIN,
} = process.env;

// Fonction de connexion d'un utilisateur
// export const loginUser: RequestHandler<{}, {}, UserAccount> = (req, res) => {
//   const { email, password } = req.body;
//   // const {
//   //   body: { email, password },
//   // } = req;
//   try {
//     // Vérification des variables d'environnement
//     if (!CHECK_LOGIN || !UPDATE_LAST_LOGIN) {
//       res.status(401).send({ message: "SQL request is not defined" });
//       return;
//     }
//     database.query(CHECK_LOGIN, [email], (err, results: UserAccount[]) => {
//       if (err) {
//         res.status(500).send({ error: "Error to connect to database" });
//         return;
//       } else if (results.length === 0) {
//         res.status(401).send({ message: "User not found or invalid email" });
//         return;
//       }

//       const user = results[0];
//       const isValidPassword = bcrypt.compareSync(password, user.password);

//       if (!isValidPassword) {
//         res.status(401).send({ message: "Invalid password" });
//         return;
//       }

//       database.query(UPDATE_LAST_LOGIN, [user.id], (updateError) => {
//         if (updateError) {
//           console.error("Failed to update the last user login : ", updateError);
//           res
//             .status(500)
//             .send({ error: "Failed to update last login timestamp" });
//           return;
//         }
//         console.log(`User ${user.username} connected`);
//         req.session.user = user
//         res.status(200).send({ user });
//         return;
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: `Caught error: ${error}` });
//     return;
//   }
// };

//Fonction d'enregistrement d'un nouvel utilisateur
export const registerUser: RequestHandler<{}, {}, UserAccount> = (req, res) => {
  const { username, password, email, firstname, lastname, birth_date } =
    req.body;

  try {
    // Vérification de la conformité du mot de passe
    if (password.length < 6) {
      res.status(500).send({ error: "Password needs 6 characters minimum!" });
      return; // Ajoutez un return pour arrêter l'exécution
    }

    // Vérification des variables d'environnement
    if (
      !CHECK_USER ||
      !CHECK_EMAIL ||
      !INSERT_NEW_USER ||
      !CREATE_USER_BASKET
    ) {
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
          res.status(500).send({ error: "Error checking username" });
          return;
        } else if (results.length > 0) {
          res.status(500).send({ error: "Username already exists" });
          return;
        }
      }
    );

    // Vérifiez si l'email existe déjà
    database.query(
      CHECK_EMAIL,
      [email],
      (err, results: UserAccount["email"][]) => {
        if (err) {
          console.error(err);
          res.status(500).send({ error: "Error checking email" });
          return;
        } else if (results.length > 0) {
          res.status(500).send({ error: "Email already exists" });
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
          res.status(500).send({ error: "Error inserting new user" });
          return;
        }

        const userId = newUser.insertId;

        database.query(CREATE_USER_BASKET, [userId], (err) => {
          if (err) {
            console.error(err);
            res.status(500).send({ error: "Error creating user basket" });
            return;
          }
          console.log(`New user created : ${username}, ${firstname}`);
          res.status(201).send({
            message: `User ${username} created`,
            details: { username, email, firstname, lastname, birth_date },
          });
          return;
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Caught error: ${error}` });
    return;
  }
};
