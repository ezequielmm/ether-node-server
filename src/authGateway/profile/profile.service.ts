import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDTO, UpdateProfileDTO } from './dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private readonly profile: Model<ProfileDocument>,
    ) {}

    async create(payload: CreateProfileDTO): Promise<ProfileDocument> {
        return await this.profile.create(payload);
    }

    async update(
        id: number,
        payload: UpdateProfileDTO,
    ): Promise<ProfileDocument> {
        return await this.profile.findByIdAndUpdate(id, payload, { new: true });
    }

    async findOne(id: number): Promise<ProfileDocument> {
        return await this.profile.findById(id).lean();
    }
}
