import { Injectable } from '@nestjs/common';
import { AutoCompleteNodeStrategy } from './auto-complete-node-strategy';

@Injectable()
export class RoyalHouseNodeStrategy extends AutoCompleteNodeStrategy {}
