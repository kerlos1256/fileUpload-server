import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { file } from './entities/image.entity';
import { videoExt, imageExt } from './fileTypes';
import { CustomMulterFile } from './interfaces';

@Injectable()
export class AppService {
  constructor(@InjectRepository(file) readonly fileRepo: Repository<file>) {}

  async addFile(file: CustomMulterFile) {
    const ext = extname(file.originalname);
    const fileNameSplit = file.originalname.split('.').slice(0, -1).join('.');
    const type = imageExt.includes(ext)
      ? 'image'
      : videoExt.includes(ext)
      ? 'video'
      : 'unknown';
    return this.fileRepo.save({
      name: fileNameSplit,
      driveId: file.driveId,
      size: JSON.parse(file.driveSize),
      ext: ext,
      type,
    });
  }

  async getFiles() {
    return this.fileRepo.find();
  }

  async getFile(fileId: string) {
    return this.fileRepo.findOne({ driveId: fileId });
  }
}
