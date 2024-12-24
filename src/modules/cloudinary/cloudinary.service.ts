// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const originalName = file.originalname.split('.')[0];
        const uniqueFilename = `${originalName}-${Date.now()}`;

        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: "images",
                public_id: uniqueFilename,
                transformation: [
                    { crop: 'scale' },
                    { fetch_format: 'auto' },
                    { quality: 'auto' },
                ],
            },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async uploadMultipleFiles(files: Express.Multer.File[]): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
        const uploadPromises = files.map((file) => this.uploadFile(file));
        return Promise.all(uploadPromises);
    }
}
