import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local', override: true });
}

dotenv.config();

const PORT_FE = process.env.PORT_FE;
const PORT_BE = process.env.PORT_BE;
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const APPLICATION_CODE = process.env.APPLICATION_CODE;

export const ROBBE_BE_URL = `${HOST}:${PORT_BE}`;
export const ROBBE_FE_URL = `${HOST}:${PORT_FE}`;
