import { Injectable } from '@nestjs/common';
import { BugReportSC } from './bugReport.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
@Injectable()
export class BugReportService {
    constructor(
        @InjectModel(BugReportSC)
        private readonly bugreportSC: ReturnModelType<typeof BugReportSC>,
    ) {}

    async create(payload: any): Promise<BugReportSC> {
        const bucket = process.env.AWS_S3_BUCKET_NAME;
        const region = 'us-west-2';
        const name = 'uploads/' + randomUUID() + '.png';
        const image_base64 = payload.screenshot;
        const file = Buffer.from(image_base64, 'base64');
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        const promise = new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err.message);
                }
                resolve(data);
            });
        });

        await promise;

        payload.screenshot = name;
        return await this.bugreportSC.create(payload);
    }
}
