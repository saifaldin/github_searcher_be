import path from 'path';
import * as dotenv from 'dotenv';
import app from './app';
import logger from './logger';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { PORT } = process.env;

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException \n${error.stack}`);
});
