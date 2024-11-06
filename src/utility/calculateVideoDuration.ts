import ffmpeg from 'fluent-ffmpeg';


// 
const getVideoDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration as number);
    });
  });
};



  

export default getVideoDuration