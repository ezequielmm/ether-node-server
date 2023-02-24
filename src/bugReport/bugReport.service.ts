import { Injectable } from '@nestjs/common';
import { BugReportSC } from './bugReport.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BugReportService {
    constructor(
        @InjectModel(BugReportSC)
        private readonly bugreportSC: ReturnModelType<typeof BugReportSC>,
        private readonly configService: ConfigService,
    ) {}

    async create(payload: any): Promise<BugReportSC> {
        const bucket = this.configService.get<string>('AWS_BUCKET_NAME');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey =
            this.configService.get<string>('AWS_SECRET_KEY');
        const region = this.configService.get<string>('AWS_REGION');

        const name = `uploads/${randomUUID()}.png`;
        const imageBase64 = payload.screenshot;
        const file = Buffer.from(imageBase64, 'base64');

        const s3 = new S3({
            region,
            accessKeyId,
            secretAccessKey,
        });

        const promise = new Promise((resolve, reject) => {
            s3.upload(
                {
                    Bucket: bucket,
                    Key: String(name),
                    Body: file,
                },
                (err, data) => {
                    if (err) reject(err.message);
                    resolve(data);
                },
            );
        });

        await promise;

        payload.screenshot = name;
        return await this.bugreportSC.create(payload);
    }
}
