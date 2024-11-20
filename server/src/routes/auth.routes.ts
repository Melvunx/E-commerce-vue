import { Request, Response, Router } from "express";
import { registerUser } from "../controller/auth.controller";
import passport from "../middleware/local-strategy";
import { UserAccount } from "../models/account.models";
const router = Router();

router.post("/register", registerUser);

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: string, user: UserAccount, info: { message: string }) => {
      if (err) {
        return res.status(500).send({ message: "Server error", error: err });
      } else if (!user) {
        return res.status(401).send({ message: info.message });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res
            .status(500)
            .send({ message: "Login failed", error: loginErr });
        }
        console.log({ message: "Login successful", user });
        res.cookie("userCookie", user, { maxAge: 60000 * 60 });
        return res
          .status(200)
          .send({ message: "Login successful", user, cookie: "Cookie send" });
      });
    }
  )(req, res, next);
});

router.get("/user", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user: UserAccount = req.cookies.userCookie;

    if (!user) {
      res.status(401).send({ message: "Cookies not found" });
      return;
    }

    console.log("User vérification...");
    res.locals.user = user;
    console.log(`User ${user.username} authenticated`);
    res.status(200).send({ message: "User authenticated !", user: user });
  } else {
    console.log("Not authenticated");
    res.status(401).send({ message: "Not authenticated" });
  }
});

router.post("/logout", (req, res) => {
  req.logout((err: string) => {
    const user: UserAccount = req.cookies.userCookie;
    if (err) {
      return res.status(500).send({ message: "Logout failed", error: err });
    } else if (!user) {
      return res
        .status(401)
        .send({ message: "User not found or session expired" });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res
          .status(500)
          .send({ message: "Logout failed", error: sessionErr });
      }
      res.clearCookie("userCookie");
      console.log("Cookie destroyed");

      return res
        .status(200)
        .send({ message: `User ${user.username} logged out successfully` });
    });
  });
});

module.exports = router;
