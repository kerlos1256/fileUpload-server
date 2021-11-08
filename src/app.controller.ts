import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  Req,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { createReadStream, createWriteStream, ReadStream, statSync } from 'fs';
import { google } from 'googleapis';
import { join } from 'path';
import { Readable } from 'stream';
import { AppService } from './app.service';
import { CustomMulterFile } from './interfaces';

const keyPath = `${process.cwd()}/key.json`;

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() uploadedFile: CustomMulterFile,
    @Res() res: Response,
  ) {
    // const fileMetadata = {
    //   name: uploadedFile.originalname,
    // };

    // const media = {
    //   mimeType: uploadedFile.mimetype,
    //   body: uploadedFile.stream,
    // };

    // const file = await drive.files.create({
    //   requestBody: fileMetadata,
    //   media,
    //   fields: 'id',
    // });
    const File = await this.appService.addFile(uploadedFile);
    const fileDetials = {
      fileId: File.driveId,
      type: File.type,
    };
    res.send(fileDetials);
  }

  @Get('/files')
  async getFiles() {
    return this.appService.getFiles();
  }

  @Get('/image/:id')
  async getFile(@Res() resp: Response, @Param('id') fileId: string) {
    drive.files
      .get({ fileId, alt: 'media' }, { responseType: 'stream' })
      .then((res) => {
        return new Promise((resolve, reject) => {
          res.data
            .on('end', () => {
              console.log('Done downloading file.');
              resolve('');
            })
            .on('error', (err) => {
              console.error('Error downloading file.');
              reject(err);
            })
            .pipe(resp);
        });
      });
  }

  @Get('/video/:id')
  async getVideo(
    @Res() resp: Response,
    @Param('id') fileId: string,
    @Req() req: Request,
  ) {
    const fileInfo = await this.appService.getFile(fileId);
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      return resp.status(400).send('Requires Range header');
    }

    const videoSize = fileInfo.size;

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
    resp.writeHead(206, headers);

    // create video read stream for this particular chunk
    await drive.files
      .get(
        { fileId, alt: 'media' },
        { responseType: 'stream', headers: { Range: `bytes=${start}-${end}` } },
      )
      .then((res) => {
        return new Promise((resolve, reject) => {
          res.data
            .on('end', () => {
              console.log('Done downloading file.');
              resolve('');
            })
            .on('error', (err) => {
              console.error('Error downloading file.');
              reject(err);
            })
            .pipe(resp);
        });
      });
  }
}
