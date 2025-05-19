import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as path from "node:path"
import * as fs from "node:fs"
import { BadRequestException } from "@nestjs/common";

export const profileFileOptions: MulterOptions = {
    storage: diskStorage({
        destination(req: any, file, callback) {
            const { id } = req.user;
            const dir = path.join(process.cwd(), `public/uploads/profile/${id}`);

            if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

            fs.mkdirSync(dir, { recursive: true });
            return callback(null, dir)
        },
        filename(req, file, callback) {
            const nameIs = `photo.${path.extname(file.originalname)}`
            return callback(null, nameIs);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (!file) return callback(null, true);
        if (["png", "jpeg", "jpg"].includes(file.mimetype)) {
            return callback(new BadRequestException("File exts should match png/jpeg/jpg"), false);
        }
        return callback(null, true)
    }
}