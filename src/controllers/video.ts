import { NextFunction, Request, Response } from "express";
import { CourseVideo } from "../models/video";
import course from "../models/course";
import { Types } from "mongoose";
import { MongoClient, GridFSBucket } from 'mongodb';
import { MONGO_URI } from "../config/db";
import fileUpload, { UploadedFile } from "express-fileupload";
import { log } from "console";
import { Readable } from "stream";


const client = new MongoClient(MONGO_URI);
let gfs: GridFSBucket;
// export const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {

//     const courseId = req.params.id;
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }

//     try {

//       const newVideo = new CourseVideo({
//         videoName: req.file.filename,
//         videoDescription: "string",
//         videoDuration: 789898,
//         videoUrl: req.file.path
//       });

//       await newVideo.save();

//       const uploadToCourse = await course.findById(courseId);
//       if (!uploadToCourse) {
//         return res.status(404).json({ success: false, message: 'Course not found' });
//       }


//       const vidId = new Types.ObjectId(newVideo._id as string)

//       uploadToCourse.courseVideos?.push(vidId);

//       await uploadToCourse.save();

//       return res.status(200).json({
//         success: true,
//         message: 'Video uploaded successfully',
//         video: newVideo
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         success: false,
//         message: 'Error uploading video',
//         error: error
//       });
//     }
//  }








client.connect().then(() => {
  log('i am connected')
  const db = client.db('smart-learn');
  gfs = new GridFSBucket(db, { bucketName: 'uploads' });
});


export const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded');
    }

    // Cast file to UploadedFile type
    const file = req.files.file as UploadedFile;

    // Open an upload stream with GridFS, using file name and mimetype
    const uploadStream = gfs.openUploadStream(file.name, {
      contentType: file.mimetype,
    });

    // Handle successful upload completion
    uploadStream.on('finish', () => {
      log(uploadStream)
      res.status(200).json({ success: true, fileId: uploadStream.id });
    });

    // Handle errors
    uploadStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).json({ success: false, error: err.message });
    });

    // Pipe the file data directly to the upload stream
    const fileDataStream = Readable.from(file.data);
    fileDataStream.pipe(uploadStream);

  } catch (error) {
    console.error('Error in uploadVideo:', error);
    res.status(500).json({ success: false, error: 'Server error during upload' });
  }
};

export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const videoId = req.params.id;

    if (!videoId) {
      return res.status(400).json({ message: "invalid video id", success: false });
    }

    const video = await CourseVideo.findByIdAndDelete(videoId);

    await course.updateMany(
      { courseVideos: videoId },
      { $pull: { courseVideos: videoId } }
    );

    if (!video) {
      return res.status(400).json({ message: "could not delete video", success: false })
    }

    return res.status(200).json({ message: "video deleted successfully", success: true, video: video });

  } catch (error) {
    return res.status(500).json({ message: "error deleting video", success: false });
  }
}

export const getVideoById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const videoId = req.params.id;
    if (!videoId) {
      return res.status(400).json({ message: "invalid video id", success: false });
    }

    const video = await CourseVideo.findById(videoId);

    if (!video) {
      return res.status(400).json({ message: "could not find video", success: false })
    }

    return res.status(200).json({ message: "video found successfully", success: true, video: video });


  } catch (error) {
    return res.status(500).json({ message: "video not found", success: false, error: error });
  }
}

