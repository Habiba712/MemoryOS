require('dotenv').config();
module.exports = {
//   cors: {
//     origin: process.env.CORS_ALLOW,
//   },
  mongodbUri : process.env.MONGODB_URI,
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
//   cloudinary: {
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//     apiKey: process.env.CLOUDINARY_API_KEY,
//     apiSecret: process.env.CLOUDINARY_API_SECRET,
//   },
//   email: {
//     pass: process.env.EMAIL_PASS,
//     adminEmail: process.env.ADMIN_EMAIL,
//   },
};