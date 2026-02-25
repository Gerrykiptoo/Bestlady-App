const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.SUPABASE_REGION,
  endpoint: process.env.SUPABASE_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.SUPABASE_ACCESS_KEY,
    secretAccessKey: process.env.SUPABASE_SECRET_KEY,
  },
  forcePathStyle: true, // required for Supabase
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SUPABASE_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `products/${uniqueSuffix}${ext}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;