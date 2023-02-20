import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'bugreports', versionKey: false },
})
export class BugReportSC {
    @Prop()
    reportId: string;
    @Prop()
    environment: string;
    @Prop()
    service: string;
    @Prop()
    clientId: string;
    @Prop()
    account: string;
    @Prop()
    knightId: string;
    @Prop()
    expeditionId: string;
    @Prop()
    userDescription: string;
    @Prop()
    userTitle: string;
    @Prop()
    screenshot: string;
    @Prop()
    frontendVersion: string;
    @Prop()
    backendVersion: string;
    @Prop()
    messageLog: [];
}
export type BugReportDTO = BugReportSC;
