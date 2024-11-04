
export interface courseDTO{
    courseName:string;
    courseDescription:string;
    courseDuration: number;
    coursePrice: number;
    courseVideos : courseVideo[]
}

export interface courseVideo{
    videoName:string;
    videoDescription:string;
    videoDuration: number;
    videoUrl:string
}