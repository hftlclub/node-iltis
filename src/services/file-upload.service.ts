import { Request, Response, Next } from 'restify';
import * as request from 'request-promise-native';
import * as fs from 'fs';
import * as multer from 'multer';

import { FileUploadResponse } from '../shared/models/file-upload-response.interface';
const config = require('../../config');

export class FileUploadService {
    static async uploadFileToCDN(path: string, newFilename?: string): Promise<FileUploadResponse> {

        const url = `${config.fileUploadUrl}?secret=${config.fileUploadSecret}`;
        const formData = {
            file: {
                value: fs.createReadStream(path),
                options: {}
            }
        };

        if (newFilename) {
            formData.file.options['filename'] = newFilename;
        }

        const body = await request.post({ url: url, formData: formData });
        return JSON.parse(body);
    }

    static uploadMultipartFile(req: Request | any, res: Response): Promise<any> {
        const fileKey = 'file';
        return new Promise((resolve, reject) => {
            const uploadMiddleware = multer().single(fileKey);
            uploadMiddleware(req, res, (err) => {
                if (err) reject(err);
                resolve(req.files[fileKey]);
            });
        });
    }
}
