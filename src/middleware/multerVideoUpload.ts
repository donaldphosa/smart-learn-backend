import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import path from 'path';
import { MONGO_URI } from '../config/db';

const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req: any, file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const fileInfo = {
        filename,
        bucketName: 'uploads' // Collection name
      };
      resolve(console.log('i am not resolving')
      );
    });
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },  
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp4|mkv|avi|mov/;
    const isValidExt = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = fileTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
      cb(null, true);  
    } else {
      cb(null, false);  
    }
  }
});

export default upload;
