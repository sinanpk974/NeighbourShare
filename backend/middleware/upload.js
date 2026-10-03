import multer from "multer";

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Create Multer upload middleware
const upload = multer({
  storage,
});

export default upload;