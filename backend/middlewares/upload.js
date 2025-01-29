import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/"); // Specify the directory to temporarily store the files
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
