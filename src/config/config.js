import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local', override: true });
}

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const APPLICATION_CODE = process.env.APPLICATION_CODE;
export const ROBB_E_BE_URL = process.env.HOST_ROBB_E_BE;
export const ROBB_E_FE_URL = process.env.HOST_ROBB_E_FE;
