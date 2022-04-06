import { Document } from 'mongoose';
import { Expedition } from 'src/expedition/expedition.schema';

export type ExpeditionDocument = Expedition & Document;
