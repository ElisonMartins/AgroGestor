import express, { Request, Response, NextFunction } from "express";
import { upload } from "../services/s3Service";

const router = express.Router();

router.post("/", upload.single("image"), (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "Nenhum arquivo enviado." });
            return;
        }

        const file = req.file as Express.MulterS3.File;
        res.status(200).json({ url: file.location });
    } catch (error) {
        console.error("Erro no upload:", error);
        next(error);
    }
});

export default router;
