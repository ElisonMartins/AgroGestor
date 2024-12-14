import express, { Request, Response, NextFunction } from "express";
import { upload } from "../services/s3Service";

const router = express.Router();

// Rota para upload de arquivos
router.post("/", upload.single("image"), (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verifica se o arquivo foi enviado na requisição
        if (!req.file) {
            res.status(400).json({ error: "Nenhum arquivo enviado." });
            return; // Encerra a execução caso nenhum arquivo seja enviado
        }

        // Obtém o arquivo enviado e sua localização no S3
        const file = req.file as Express.MulterS3.File;
        res.status(200).json({ url: file.location }); // Retorna a URL do arquivo no S3
    } catch (error) {
        // Trata erros que podem ocorrer durante o upload
        console.error("Erro no upload:", error);
        next(error); // Encaminha o erro para o middleware de erro
    }
});

export default router;
