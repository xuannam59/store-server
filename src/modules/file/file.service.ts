import { BadGatewayException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FileService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    // [POST] 
    async uploadFile(file: Express.Multer.File) {
        try {
            const link = await this.cloudinaryService.uploadFile(file);
            return link.secure_url;
        } catch (error) {
            throw new BadGatewayException("Error unable to upload file");
        }
    }
}
