import * as path from 'path';

const p = path.join(process.cwd(), '.env');
const dotEnvOptions = {
    path: p,
};

export { dotEnvOptions };
