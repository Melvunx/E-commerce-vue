import { NextFunction, Request, Response } from "express";

export function userAuthentification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "You must be logged in" });
    return;
  }

  console.log("User is authenticated");
  res.sendStatus(200);
  next();
}
