import { Request, Response, NextFunction } from 'express';
import { CopyObjectCommand, DeleteObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { BadRequestError } from '../utils';

const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: process.env.AWS_REGION
});

type S3Params = {
    Bucket: string;
    CopySource: string;
    Key: string;
    ACL: ObjectCannedACL;
};

async function uploadImageToS3(file: any, routeImage: string) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: routeImage,
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

export const addImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new BadRequestError("No se ha subido ninguna imagen");
        }

        const imageUrl = await uploadImageToS3(req.file, req.body.routeImage);

        res.json({ success: true, imageUrl: imageUrl });
    } catch (error) {
        next(error);
    }
};

async function updateImageNameInS3(folder: string, oldImageName: string, newImageName: string) {
    const bucketName = process.env.S3_BUCKET_NAME ?? '';

    const copyParams: S3Params = {
        Bucket: bucketName,
        CopySource: `${bucketName}/${folder}/${encodeURIComponent(oldImageName)}`,
        Key: `${folder}/${encodeURIComponent(newImageName)}`,
        ACL: ObjectCannedACL.public_read,
    };

    try {
        const copyCommand = new CopyObjectCommand(copyParams);
        await s3Client.send(copyCommand);

        console.log(`Imagen copiada con éxito de ${oldImageName} a ${newImageName}`);

        return `https://${copyParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(copyParams.Key)}`;
    } catch (error) {
        throw error;
    }
}

async function deleteOldImageFromS3(folder: string, oldImageName: string): Promise<void> {
    const bucketName = process.env.S3_BUCKET_NAME;

    const deleteParams = {
        Bucket: bucketName,
        Key: `${folder}/${encodeURIComponent(oldImageName)}`,
    };

    try {
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3Client.send(deleteCommand);

        console.log(`Imagen ${oldImageName} eliminada con éxito`);
    } catch (error) {
        throw error;
    }
}

export const updateImageName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folder, oldImageName, newImageName } = req.body;

        if (!folder || !oldImageName || !newImageName) {
            throw new BadRequestError("Se deben proporcionar ambos nombres de la imagen, y la carpeta correspondiente");
        }

        const imageUrl = await updateImageNameInS3(folder, oldImageName, newImageName);

        res.json({ success: true, imageUrl: imageUrl });
    } catch (error) {
        next(error);
    }
};

export const deleteImageName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folder, imageToRemove } = req.body;

        if (!folder || !imageToRemove) {
            throw new BadRequestError("Se debe proporcionar un nombre de una imagen y su carpeta correspondiente");
        }

        await deleteOldImageFromS3(folder, imageToRemove);

        res.json({ success: true, message: `Imagen renombrada ${imageToRemove} eliminada` });
    } catch (error) {
        next(error);
    }
};
