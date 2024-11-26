import { Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ResponseMessage } from '@/decorators/customize';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload')
  @ResponseMessage("Upload file")
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^(jpg|jpeg|png|image\/png|gif|txt|pdf|application\/pdf|doc|docx|application\/msword|text\/plain|)$/i,
      })
      .addMaxSizeValidator({
        maxSize: 1000 * 1024, // 1MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File) {
    // return this.fileService.uploadFile(file);
    console.log(file)
  }

}
