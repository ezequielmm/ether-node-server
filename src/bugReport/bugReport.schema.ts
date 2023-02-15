import { Schema } from 'mongoose';

export interface IBugReport {
    reportId: string;
    environment: string;
    service: string;
    clientId: string;
    account: string;
    knightId: string;
    expeditionId: string;
    userDescription: string;
    userTitle: string;
    screenshot: string;
    frontendVersion: string;
    backendVersion: string;
    messageLog: [];
}

export const bugReportSchema = new Schema<IBugReport>({
    reportId: { type: String },
    environment: { type: String },
    service: { type: String },
    clientId: { type: String },
    account: { type: String },
    knightId: { type: String },
    expeditionId: { type: String },
    userDescription: { type: String },
    userTitle: { type: String },
    screenshot: { type: String },
    frontendVersion: { type: String },
    backendVersion: { type: String },
    messageLog: [],
});
