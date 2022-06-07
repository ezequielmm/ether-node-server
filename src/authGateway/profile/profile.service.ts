import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDTO } from './dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private readonly profile: Model<ProfileDocument>,
    ) {}

    async findOneByAuthServiceId(
        auth_service_id: number,
    ): Promise<ProfileDocument> {
        return await this.profile.findOne({ auth_service_id }).lean();
    }

    async updateOrCreate(
        payload: CreateProfileDTO,
        id?: string,
    ): Promise<ProfileDocument> {
        const { auth_service_id, name, email } = payload;
        const filter = id ? { id } : { email };

        return await this.profile
            .findOneAndUpdate(
                filter,
                { auth_service_id, email, name },
                { upsert: true, new: true },
            )
            .lean();
    }
}
