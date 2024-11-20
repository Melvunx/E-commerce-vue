import { NextFunction, Request, Response } from "express";
import { UserAccount } from "../models/account.models";

export function userAuthentification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user: UserAccount = req.cookies.userCookie;
  if (!user) {
    res.status(401).send({ message: "User not found" });
    return;
  } else if (!req.isAuthenticated()) {
    res.status(401).send({ message: "You must be logged in !" });
    return;
  }

  console.log(`\nUser ${user.username} is authentificated !\n`);
  res.status(200);
  next();
}
