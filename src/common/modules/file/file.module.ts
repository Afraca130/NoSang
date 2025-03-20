import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const fileExtension = extname(file.originalname);
          callback(null, `${uniqueName}${fileExtension}`);
        },
      }),
    }),
  ],
  providers: [FileService],
  exports: [FileService, MulterModule],
})
export class FileModule {}
