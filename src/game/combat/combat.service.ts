import { Injectable } from '@nestjs/common';
import {
    IExpeditionCurrentNode,
    IExpeditionNode,
} from '../components/expedition/expedition.interface';

@Injectable()
export class CombatService {
    private node: IExpeditionNode;

    async generate(): Promise<IExpeditionCurrentNode> {}
}
