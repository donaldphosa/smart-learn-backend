import { Router } from "express";
import { deleteVideo, downloadVideo, uploadVideo } from "../controllers/video";

const videoRouter = Router();


videoRouter.post('/upload/:id', uploadVideo as any);
videoRouter.delete('/delete/:id',deleteVideo as any);
videoRouter.get('/downloadVideo/:id',downloadVideo as any);

export default videoRouter;