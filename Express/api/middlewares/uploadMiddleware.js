import multer from "multer";

// Configure multer for in-memory storage
const storage = multer.memoryStorage();

// File filter to accept only audio files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
    "audio/mp3",
    "audio/x-m4a"
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a|webm|ogg)$/i)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only audio files are allowed."), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (Whisper API constraint)
  },
});

export default upload;
