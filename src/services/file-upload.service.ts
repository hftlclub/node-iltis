import * as request from 'request-promise-native';
import * as fs from 'fs';
import { FileUploadResponse } from '../shared/models/file-upload-response.interface';
const config = require('../../config');

export class FileUploadService {
    static async uploadFile(filename: string): Promise<FileUploadResponse> {

        const url = `${config.fileUploadUrl}?secret=${config.fileUploadSecret}`;
        const formData = {
            file: fs.createReadStream(filename)
        };
        const body = await request.post({ url: url, formData: formData });
        return JSON.parse(body);
    }
}
