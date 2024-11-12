"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoById = exports.deleteVideo = exports.uploadVideo = void 0;
const video_1 = require("../models/video");
const course_1 = __importDefault(require("../models/course"));
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const console_1 = require("console");
const stream_1 = require("stream");
const client = new mongodb_1.MongoClient(db_1.MONGO_URI);
let gfs;
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
    (0, console_1.log)('i am connected');
    const db = client.db('smart-learn');
    gfs = new mongodb_1.GridFSBucket(db, { bucketName: 'uploads' });
});
const uploadVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).send('No file uploaded');
        }
        // Cast file to UploadedFile type
        const file = req.files.file;
        // Open an upload stream with GridFS, using file name and mimetype
        const uploadStream = gfs.openUploadStream(file.name, {
            contentType: file.mimetype,
        });
        // Handle successful upload completion
        uploadStream.on('finish', () => {
            (0, console_1.log)(uploadStream);
            res.status(200).json({ success: true, fileId: uploadStream.id });
        });
        // Handle errors
        uploadStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            res.status(500).json({ success: false, error: err.message });
        });
        // Pipe the file data directly to the upload stream
        const fileDataStream = stream_1.Readable.from(file.data);
        fileDataStream.pipe(uploadStream);
    }
    catch (error) {
        console.error('Error in uploadVideo:', error);
        res.status(500).json({ success: false, error: 'Server error during upload' });
    }
});
exports.uploadVideo = uploadVideo;
const deleteVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = req.params.id;
        if (!videoId) {
            return res.status(400).json({ message: "invalid video id", success: false });
        }
        const video = yield video_1.CourseVideo.findByIdAndDelete(videoId);
        yield course_1.default.updateMany({ courseVideos: videoId }, { $pull: { courseVideos: videoId } });
        if (!video) {
            return res.status(400).json({ message: "could not delete video", success: false });
        }
        return res.status(200).json({ message: "video deleted successfully", success: true, video: video });
    }
    catch (error) {
        return res.status(500).json({ message: "error deleting video", success: false });
    }
});
exports.deleteVideo = deleteVideo;
const getVideoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = req.params.id;
        if (!videoId) {
            return res.status(400).json({ message: "invalid video id", success: false });
        }
        const video = yield video_1.CourseVideo.findById(videoId);
        if (!video) {
            return res.status(400).json({ message: "could not find video", success: false });
        }
        return res.status(200).json({ message: "video found successfully", success: true, video: video });
    }
    catch (error) {
        return res.status(500).json({ message: "video not found", success: false, error: error });
    }
});
exports.getVideoById = getVideoById;
