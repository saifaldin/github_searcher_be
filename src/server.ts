import path from 'path';
import * as dotenv from 'dotenv';
import app from './app';
import logger from './logger';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { PORT } = process.env;

app.listen(PORT || 5000, () => {
  logger.info(`Listening on port ${PORT || 5000}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException \n${error.stack}`);
});
