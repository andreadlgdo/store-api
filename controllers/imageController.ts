import { Request, Response } from 'express';

const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: process.env.AWS_REGION
});


async function uploadImageToS3(file: any, key: string) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(params.Key)}`;


    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw error;
    }
}

export const addImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha subido ninguna imagen" });
        }

        const imageUrl = await uploadImageToS3(req.file, req.body.routeImage);

        res.json({ success: true, imageUrl: imageUrl });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
