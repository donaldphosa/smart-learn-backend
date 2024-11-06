import { Router } from "express";
import { uploadVideo } from "../controllers/video";

const videoRouter = Router();


videoRouter.post('/upload/:id',uploadVideo as any);


export default videoRouter;