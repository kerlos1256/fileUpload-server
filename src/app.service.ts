import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { file } from './entities/image.entity';
import { videoExt, imageExt } from './fileTypes';

@Injectable()
export class AppService {
  constructor(@InjectRepository(file) readonly fileRepo: Repository<file>) {}
  async addFile(file: Express.Multer.File) {
    const ext = extname(file.originalname);
    const fileNameSplit = file.filename
      .split('.')
      .slice(0, -1)
      .join('.')
      .split('&%-%&');
    const type = imageExt.includes(ext)
      ? 'image'
      : videoExt.includes(ext)
      ? 'video'
      : 'unknown';
    return this.fileRepo.save({
      name: fileNameSplit[0],
      uuid: fileNameSplit[1],
      ext: ext,
      type,
      path: file.path,
    });
  }
  async getImagePath(uuid: string) {
    const image = await this.fileRepo.findOne({ uuid });

    if (!image || image.type !== 'image') return false;
    return image.path;
  }
  async getVideoPath(uuid: string) {
    const video = await this.fileRepo.findOne({ uuid });

    if (!video || video.type !== 'video') return false;
    return video.path;
  }
}
