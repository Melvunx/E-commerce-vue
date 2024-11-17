import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import database from "../config/database";
import { UserAccount } from "../models/account.models";

const { CHECK_LOGIN, UPDATE_LAST_LOGIN, SELECT_USER_ID } = process.env;

passport.use(
  new localStrategy({ usernameField: "email" }, (email, password, done) => {
    if (!CHECK_LOGIN || !UPDATE_LAST_LOGIN)
      return done(null, false, { message: "SQL request is not defined" });

    database.query(CHECK_LOGIN, [email], (err, results: UserAccount[]) => {
      if (err) return done(err, false);
      else if (results.length === 0)
        return done(null, false, {
          message: "User not found or invalid email",
        });

      const user = results[0];

      // Vérification du mot de passe
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword)
        return done(null, false, { message: "Invalid password" });

      // Mettre à jour la dernière connexion
      database.query(UPDATE_LAST_LOGIN, [user.id], (updateError) => {
        if (updateError) return done(updateError, false);
      });
      // Authentification réussie
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id: number, done) => {
  if (!SELECT_USER_ID) return done({ error: "Sql request not defined" }, null);

  database.query(SELECT_USER_ID, [id], (err, results: UserAccount[]) => {
    if (err) return done(err, null);
    else if (results.length === 0)
      return done({ message: "User not found" }, null);

    const user = results[0];
    done(null, user);
  });
});
