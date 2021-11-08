export interface CustomMulterFile extends Express.Multer.File {
  driveId: string;
  driveSize: string;
}
