import { ActivityLog, ActivityLogDocument } from './activityLog.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ActivityLogService {
    constructor(
        @InjectModel(ActivityLog.name)
        private readonly activityLog: Model<ActivityLogDocument>,
    ) {}

    async findAll(): Promise<ActivityLog[]> {
        return this.activityLog.find().lean();
    }

    async findOne(id: string): Promise<ActivityLog> {
        return this.activityLog.findById(id).lean();
    }

    async create(activityLog: ActivityLogDocument): Promise<ActivityLog> {
        return this.activityLog.create(activityLog);
    }

    async update(id: string, activityLog: ActivityLog): Promise<ActivityLog> {
        return this.activityLog
            .findByIdAndUpdate(id, activityLog, { new: true })
            .lean();
    }

    async delete(id: string): Promise<ActivityLog> {
        return this.activityLog.findByIdAndDelete(id).lean();
    }

    async deleteMany(ids: string[]): Promise<ActivityLog[]> {
        return this.activityLog.deleteMany({ _id: { $in: ids } }).lean();
    }
}
