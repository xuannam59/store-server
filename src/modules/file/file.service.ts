import { BadGatewayException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FileService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    // [POST] 
    async uploadFile(file: Express.Multer.File, folderName: string) {
        try {
            const link = await this.cloudinaryService.uploadFile(file, folderName);
            return {
                fileUpload: link.secure_url
            };
        } catch (error) {
            throw new BadGatewayException("Error unable to upload file");
        }
    }

    async uploadMultipleFiles(files: Express.Multer.File[], folderName: string) {
        try {
            const data = await this.cloudinaryService.uploadMultipleFiles(files, folderName)
            const result = data.map(item => item.secure_url)
            return {
                linkUrls: result
            };
        } catch (error) {
            throw new BadGatewayException("Error unable to upload file");
        }
    }
}
