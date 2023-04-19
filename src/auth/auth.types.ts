import { Request } from 'express';
import { Socket } from 'socket.io';

export interface AuthorizedRequest extends Request {
    userAddress: string;
}

export interface AuthorizedSocket extends Socket {
    userAddress: string;
}
