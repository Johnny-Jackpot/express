import multer from 'multer';
import {AppError} from "../errors/AppError.js";

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB

export const uploadBannerImg = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new AppError(400, 'Only image files are allowed'))
      return;
    }

    cb(null, true)
  }
})

export const uploadSingleBannerImg = uploadBannerImg.single('image')