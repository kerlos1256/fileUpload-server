import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const File = await this.appService.addFile(file);
    const fileId = file.filename
      .split('.')
      .slice(0, -1)
      .join('.')
      .split('&%-%&')[1];

    const fileDetials = {
      fileId,
      type: File.type,
    };
    res.send(fileDetials);
  }

  @Get('/files')
  async getFiles() {
    return this.appService.getFiles();
  }

  @Post('new/:test')
  async new(@Param('test') test) {
    return this.appService.new(test);
  }

  @Get('/image/:uuid')
  async getFile(@Res() res: Response, @Param('uuid') uuid) {
    const path = await this.appService.getImagePath(uuid);
    if (!path) return 'not found';
    const streamFile = createReadStream(join(process.cwd(), path));
    streamFile.pipe(res);
  }

  @Get('/video/:uuid')
  async getVideo(@Res() res: Response, @Param('uuid') uuid, @Req() req: any) {
    const videoPath = await this.appService.getVideoPath(uuid);
    if (!videoPath) return 'not found';

    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      res.status(400).send('Requires Range header');
    }

    const videoSize = statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }
}
