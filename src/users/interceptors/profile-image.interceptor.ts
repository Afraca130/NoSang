import { Injectable, mixin, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

export function ProfileImageInterceptor() {
  // 디렉토리 확인 및 생성
  const uploadDir = './uploads/profiles';
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  return FileInterceptor('image', {
    storage: diskStorage({
      destination: uploadDir,
      filename: (req, file, callback) => {
        const uniqueName = uuidv4();
        const fileExtension = extname(file.originalname);
        callback(null, `${uniqueName}${fileExtension}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('지원하지 않는 이미지 형식입니다.'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB 제한
    },
  });
}
