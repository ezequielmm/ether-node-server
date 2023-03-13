import { Injectable } from '@nestjs/common';
import { BugReportSC } from './bugReport.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BugReportService {
    constructor(
        @InjectModel(BugReportSC)
        private readonly bugreportSC: ReturnModelType<typeof BugReportSC>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async create(payload: any): Promise<BugReportSC> {
        //send image to s3
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

        // send to slack
        const userTitle = payload.userTitle;
        const userDescription = payload.userDescription;
        const expeditionId = payload.expeditionId;

        const slackUrl = this.configService.get<string>('SLACK_WEBHOOK_URL');

        const domain = this.configService.get<string>('S3_IMAGE_URL_DOMAIN');
        const image_url = `${domain}/${name}`;
        const slack_message = {
            text:
                'expeditionId: ' +
                expeditionId +
                '\ntitle: ' +
                userTitle +
                '\ndescription: ' +
                userDescription,
            attachments: [
                {
                    title: 'screen shot',
                    image_url: image_url,
                },
            ],
        };
        const slack_message_str = JSON.stringify(slack_message);
        await lastValueFrom(
            this.httpService.post(slackUrl, slack_message_str, {
                headers: { 'Content-type': 'application/json' },
            }),
        );

        // write to DB
        payload.screenshot = name;
        return await this.bugreportSC.create(payload);
    }
}
