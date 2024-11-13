import mongoose, { Schema, Document } from 'mongoose';

export interface CourseVideoDTO extends Document {
  videoName: string;
  videoDescription: string;
  videoId: string;
}

const courseVideoSchema = new Schema<CourseVideoDTO>({
  videoName: { type: String, required: true },
  videoDescription: { type: String, required: true },
  videoId: { type: String, required: true },
});

export const CourseVideo = mongoose.model<CourseVideoDTO>('CourseVideo', courseVideoSchema);
