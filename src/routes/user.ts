import {  Request, Response, NextFunction, Router } from "express";
import { login, purchaseCourse, signup, updateUser } from "../controllers/user";
import { authenticate } from "../middleware/authenticate";


const userRouter = Router();


userRouter.post('/signup',signup as (req:Request,res:Response, next:NextFunction)=> Promise<void>);
userRouter.post("/login", login as (req:Request,res:Response, next:NextFunction)=> Promise<void>);
userRouter.put("/update", authenticate as (req:Request,res:Response, next:NextFunction)=> Promise<void> ,updateUser as (req:Request,res:Response, next:NextFunction)=> Promise<void>);
userRouter.post("/purchase", authenticate as  (req:Request,res:Response, next:NextFunction)=> Promise<void> ,purchaseCourse as any)

export default userRouter;