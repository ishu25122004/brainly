import type { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {JWT_PASSWORD} from "./config.js";

export const userMiddleware = (req:Request, res:Response, next:NextFunction) => {
     const header = req.headers["authorization"];
     
     if (!header) {
         res.status(403).json({ message: "You are not logged in" });
         return;
     }

     try {
         const decoded = jwt.verify(header as string, JWT_PASSWORD) as { id: string };
         if (decoded) {
             res.locals.userId = decoded.id;
             next();
         } else {
             res.status(403).json({ message: "You are not logged in" });
         }
     } catch (e) {
         res.status(403).json({ message: "Invalid or expired token" });
     }
}