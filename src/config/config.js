import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const PORT_FE = process.env.PORT_FE;
export const PORT_BE = process.env.PORT_BE;
export const APPLICATION_CODE = process.env.APPLICATION_CODE;

export const ROBBE_BE_URL = `${HOST}:${PORT_BE}`;
export const ROBBE_FE_URL = `${HOST}:${PORT_FE}`;
