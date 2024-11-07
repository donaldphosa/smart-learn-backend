import { Router } from "express";
import { deleteVideo, getVideoById, uploadVideo } from "../controllers/video";
import upload from "../middleware/multerVideoUpload";

const videoRouter = Router();


videoRouter.post('/upload/:id',upload.single('file'),uploadVideo as any);
videoRouter.delete('/delete/:id',deleteVideo as any);
videoRouter.get('/getvideo/:id',getVideoById as any);

export default videoRouter;