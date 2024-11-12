"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_1 = require("../controllers/video");
const videoRouter = (0, express_1.Router)();
videoRouter.post('/upload/:id', video_1.uploadVideo);
videoRouter.delete('/delete/:id', video_1.deleteVideo);
videoRouter.get('/getvideo/:id', video_1.getVideoById);
exports.default = videoRouter;
