import multer from "multer";
import AppError from "../utils/app-error.ts";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if(!allowedTypes.includes(file.mimetype)) {
            return cb(new AppError(400, "Format d'image non autorisé"))
        }

        cb(null, true)
    }
})

export default upload