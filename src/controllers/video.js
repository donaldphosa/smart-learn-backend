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
exports.downloadVideo = exports.deleteVideo = exports.uploadVideo = void 0;
const video_1 = require("../models/video");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const console_1 = require("console");
const stream_1 = require("stream");
const course_1 = __importDefault(require("../models/course"));
const client = new mongodb_1.MongoClient(db_1.MONGO_URI);
let gfs;
client.connect().then(() => {
    (0, console_1.log)('i am connected');
    const db = client.db('smart-learn');
    gfs = new mongodb_1.GridFSBucket(db, { bucketName: 'uploads' });
});
const uploadVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description } = req.body;
        const courseId = req.params.id;
        if (!req.files || !req.files.file) {
            return res.status(400).send('No file uploaded');
        }
        const file = req.files.file;
        const uploadStream = gfs.openUploadStream(file.name, {
            contentType: file.mimetype,
        });
        uploadStream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            const video = new video_1.CourseVideo({
                videoName: uploadStream.filename,
                videoDescription: description,
                videoId: uploadStream.id,
            });
            video.save();
            const updatedCourse = yield course_1.default.findByIdAndUpdate(courseId, {
                $push: { courseVideos: video._id }
            }, { new: true });
            res.status(200).json({ success: true, course: updatedCourse });
        }));
        uploadStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            res.status(500).json({ success: false, error: err.message });
        });
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
        const fileId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: 'Invalid file ID' });
        }
        yield gfs.delete(new mongoose_1.default.Types.ObjectId(fileId));
        res.status(200).json({ success: true, message: 'File deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteVideo:', error);
        res.status(500).json({ success: false, error: 'Server error during deletion' });
    }
});
exports.deleteVideo = deleteVideo;
const downloadVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        if (!fileId) {
            return res.status(400).json({ success: false, message: 'No file ID provided' });
        }
        const objectId = new mongoose_1.default.Types.ObjectId(fileId);
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
    }
    catch (error) {
        console.error('Error in downloadVideo:', error);
        res.status(500).json({ success: false, error: 'Server error during download' });
    }
});
exports.downloadVideo = downloadVideo;
