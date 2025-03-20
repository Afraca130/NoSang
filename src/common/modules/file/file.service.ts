import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor() {
    // 업로드 폴더가 없으면 생성
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  getFileUrl(filename: string): string {
    if (!filename) return null;
    return `/uploads/${filename}`;
  }

  getFilePath(filename: string): string {
    if (!filename) return null;
    return join(process.cwd(), 'uploads', filename);
  }
}
