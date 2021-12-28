import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import SwaggerUI from 'swagger-ui-express';
import logger from './logger';
import router from './controllers/api.controller';

const app = express();

app.use(helmet());
app.use(rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 500,
  message: 'Too many requests, please try again after 5 minutes',
}));
app.use(cors());
app.use(express.json());
app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(require('../docs/swagger.json')));

app.use('/', (req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api', router);

export default app;