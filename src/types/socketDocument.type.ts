import { SocketClient } from 'src/socketClient/socketClient.schema';
import { Document } from 'mongoose';

export type SocketClientDocument = SocketClient & Document;
