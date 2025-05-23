import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as path from "node:path"
import * as fs from "node:fs"
import { BadRequestException } from "@nestjs/common";

export const mediaFileOptions: MulterOptions = {
    storage: diskStorage({
        destination(req: any, file, callback) {
            const baseDir = path.join(process.cwd(), `public/uploads/media`);
            if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
            return callback(null, baseDir)
        },
        filename(req: any, file, callback) {
            const { id } = req.user;
            const nameIs = `${id}-${Date.now()}${path.extname(file.originalname)}`
            return callback(null, nameIs);
        },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (!file) return callback(null, true);
        if (["png", "jpeg", "jpg", "mp4"].includes(file.mimetype)) {
            return callback(new BadRequestException("File exts should match png/jpeg/jpg/mp4"), false);
        }
        return callback(null, true)
    }
}