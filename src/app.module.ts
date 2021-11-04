import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { v4 as uuid } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { file } from './entities/image.entity';
import { imageExt, videoExt } from './fileTypes';

@Module({
  imports: [
    TypeOrmModule.forFeature([file]),
    TypeOrmModule.forRoot(typeOrmConfig),
    MulterModule.register({
      storage: diskStorage({
        destination: async function (req, file, cb) {
          const ext = extname(file.originalname);
          if (imageExt.includes(ext)) {
            return cb(null, './uploads/images');
          }
          if (videoExt.includes(ext)) {
            return cb(null, './uploads/videos');
          }
          cb(null, './uploads');
        },
        filename: function (req, file, cb) {
          const random = uuid();
          const filename = file.originalname.split('.').slice(0, -1).join('.');
          console.log('filename', filename);
          cb(null, filename + '&%-%&' + random + extname(file.originalname));
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
