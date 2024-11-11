import { Router } from "express";
import { deleteVideo, getVideoById, uploadVideo } from "../controllers/video";

const videoRouter = Router();


videoRouter.post('/upload/:id', uploadVideo as any);
videoRouter.delete('/delete/:id',deleteVideo as any);
videoRouter.get('/getvideo/:id',getVideoById as any);

export default videoRouter;