// import multer from "multer";
// // import { CloudinaryStorage } from "multer-storage-cloudinary";
// // import cloudinary from "../config/cloudinary.js";
// // import { uploadOnCloudinary } from "../config/cloudinary.js";
// // import fs from "fs"
// import path from "path";

// // const storage = new CloudinaryStorage({
// //   cloudinary,
// //   params: {
// //     folder: "task_files", // Folder in Cloudinary
// //     allowed_formats: ["jpeg", "png", "jpg", "pdf", "docx"], // Allowed file types
// //   },
// // });

// // const upload = multer({ 
// //     storage,
// //     limits: { fileSize: 5 * 1024 * 1024 },  // Max file size 5MB (optional)
// //   fileFilter: (req, file, cb) => {
// //     const allowedTypes = /jpeg|jpg|png|pdf|docx/;
// //     const extname = allowedTypes.test(file.originalname.toLowerCase());
// //     const mimetype = allowedTypes.test(file.mimetype);

// //     if (extname && mimetype) {
// //       return cb(null, true);  // Accept file
// //     } else {
// //       return cb(new Error("Invalid file type!"), false);  // Reject file
// //     }
// //   },
// // });  // The field name for the file is 'fileUrl'


// const storage = multer.diskStorage({
//     // destination: function (req, file, cb) {
//     //   cb(null, "./public/temp")
//     // },
//     // filename: function (req, file, cb) {
      
//     //   cb(null, file.originalname)
//     // }

//     destination: function (req, file, cb) {
//         cb(null, "uploads/"); // Specify the directory to temporarily store the files
//       },
//       filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
//       },
//   })

// export const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Set max file size limit (5MB)
//   fileFilter: function (req, file, cb) {
//     const fileTypes = /jpeg|jpg|png|pdf|docx/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Invalid file type!"), false);
//     }
//   },
// }).single('fileUrl');
  
// export const upload = multer({ 
//     storage, 
// })

// export default upload;




import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./backend/uploads/"); // Specify the directory to temporarily store the files
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
      },
  })

  export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set max file size limit (5MB)
    fileFilter: function (req, file, cb) {
      const fileTypes = /jpeg|jpg|png|pdf|docx/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error("Invalid file type!"), false);
      }
    },
  });
