import multer, { FileFilterCallback } from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Define where to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Define how to name the uploaded files
  },
});


const upload = multer({ storage , limits : {fieldSize : 1024 * 1024 * 24} });

export default upload;