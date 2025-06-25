import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration using v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration (memory storage for file uploads)
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage }); // Apply multer with memory storage

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Process single file upload using Multer
    upload.single('file')(req , res, (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Upload to Cloudinary after the file is processed by Multer
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Specify resource type as video
          public_id: `video_${Date.now()}`, // Unique public ID
          folder: 'uploads/videos', // Optional: specify folder
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Upload failed', details: error });
          }

          // Send back the uploaded video URL
          return res.status(200).json({ message: 'Video uploaded successfully', url: result?.secure_url });
        }
      ).end(req.file.buffer); // End the stream by passing file buffer from Multer
    });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

// Disable Next.js bodyParser for file uploads (Multer handles this)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
