import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const PORT_FE = process.env.PORT_FE;
const PORT_BE = process.env.PORT_BE;
const APPLICATION_CODE = process.env.APPLICATION_CODE;

export { PORT, HOST, PORT_FE, PORT_BE, APPLICATION_CODE };

export const ROBBE_BE_URL = `${HOST}:${PORT_BE}`;
export const ROBBE_FE_URL = `${HOST}:${PORT_FE}`;
