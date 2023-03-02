import { Injectable } from '@nestjs/common';
import { BugReportSC } from './bugReport.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BugReportService {
    constructor(
        @InjectModel(BugReportSC)
        private readonly bugreportSC: ReturnModelType<typeof BugReportSC>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async create(payload: any): Promise<BugReportSC> {
        const slack_message = {
            text: 'title: 8\ndescription: 8',
            attachments: [
                {
                    title: 'screen shot',
                    image_url:
                        'https://kote-bug-reports.s3.amazonaws.com/development/ef19c77c-11db-4c9e-aebd-8e3c63b50106.png',
                },
            ],
        };
        await this.httpService
            .post(
                'https://hooks.slack.com/services/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',
                { slack_message },
                { headers: { 'Content-type': 'application/json' } },
            )
            .toPromise();
        const slack_message_str = JSON.stringify(slack_message);
        console.log(slack_message_str);

        const bucket = this.configService.get<string>('AWS_BUCKET_NAME');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey =
            this.configService.get<string>('AWS_SECRET_KEY');
        const region = this.configService.get<string>('AWS_REGION');

        const directory = this.configService.get<string>('NODE_ENV');
        const name = `${directory}/${randomUUID()}.png`;
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

        const domain = this.configService.get<string>('S3_IMAGE_URL_DOMAIN');
        const url = `${domain}/${name}`;

        payload.screenshot = name;
        return await this.bugreportSC.create(payload);
    }
}
