import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  
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
