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
        return res.status(200).send({ message: "Login successful", user });
      });
    }
  )(req, res, next);
});

router.get("/user", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    const { email, username, id } = req.user;
    res.status(200).send({ user: { id, email, username } });
  } else {
    console.log("Not authenticated");
    res.status(401).send({ message: "Not authenticated" });
  }
});

router.post("/logout", (req, res) => {
  req.logout((err: string) => {
    if (err) {
      console.error({ message: "Logout failed", error: err });
      return res.status(500).send({ message: "Logout failed", error: err });
    }
    console.log("User logged out", req.user);
    res.status(200).send({ message: `User logged out succefully` });
  });
});

module.exports = router;
