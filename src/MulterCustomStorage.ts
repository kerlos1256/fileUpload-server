import fs from 'fs';
import { google } from 'googleapis';

const keyPath = `${process.cwd()}/key.json`;

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

function MyCustomStorage(opts) {}

MyCustomStorage.prototype._handleFile = async function _handleFile(
  req,
  file: Express.Multer.File,
  cb,
) {
  const fileMetadata = {
    name: file.originalname,
  };

  const media = {
    mimeType: file.mimetype,
    body: file.stream,
  };
  const fields = 'id, size';
  const driveFile = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields,
  });
  cb(null, {
    driveId: driveFile.data.id,
    driveSize: driveFile.data.size,
  });
};

MyCustomStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  console.log(file);
};

module.exports = function (opts) {
  return new MyCustomStorage(opts);
};
