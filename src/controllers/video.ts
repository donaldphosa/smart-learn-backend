import { NextFunction, Request, Response } from "express";
import { CourseVideo } from "../models/video";
import mongoose, { Types } from "mongoose";
import { MongoClient, GridFSBucket } from 'mongodb';
import { MONGO_URI } from "../config/db";
import { UploadedFile } from "express-fileupload";
import { log } from "console";
import { Readable } from "stream";
import course from "../models/course";


const client = new MongoClient(MONGO_URI);
let gfs: GridFSBucket;



client.connect().then(() => {
  log('i am connected')
  const db = client.db('smart-learn');
  gfs = new GridFSBucket(db, { bucketName: 'uploads' });
});


export const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body;
    const courseId = req.params.id;

    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded');
    }

    const file = req.files.file as UploadedFile;

    const uploadStream = gfs.openUploadStream(file.name, {
      contentType: file.mimetype,
    });

    uploadStream.on('finish', async () => {

      const video = new CourseVideo({
        videoName:uploadStream.filename,
        videoDescription:description,
        videoId:uploadStream.id,
      })


      video.save();

      const updatedCourse = await course.findByIdAndUpdate(courseId, {
        $push: { courseVideos: video._id }
      }, { new: true });

      res.status(200).json({ success: true, course: updatedCourse });
    });

    uploadStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).json({ success: false, error: err.message });
    });

    const fileDataStream = Readable.from(file.data);
    fileDataStream.pipe(uploadStream);

  } catch (error) {
    console.error('Error in uploadVideo:', error);
    res.status(500).json({ success: false, error: 'Server error during upload' });
  }
};


export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.id; 

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid file ID' });
    }

    await gfs.delete(new mongoose.Types.ObjectId(fileId));
    

      res.status(200).json({ success: true, message: 'File deleted successfully' });

    
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    res.status(500).json({ success: false, error: 'Server error during deletion' });
  }
}

export const downloadVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'No file ID provided' });
    }

    const objectId = new mongoose.Types.ObjectId(fileId);

    const downloadStream = gfs.openDownloadStream(objectId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (err) => {
      res.status(500).json({ success: false, error: 'File not found or error in download' });
    });

  } catch (error) {
    console.error('Error in downloadVideo:', error);
    res.status(500).json({ success: false, error: 'Server error during download' });
  }
}


