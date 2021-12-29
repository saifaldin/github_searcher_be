import { Router } from 'express';

import { ISearchBodyParams } from './interfaces/ISearchBodyParams';
import searchBodySchema from './validation-schemas/search.schema';
import apiService from '../services/api.service';
import { ISearchResponseShape } from './interfaces/ISearchResponseShape';

const router = Router();

router
  .get('/search', async (req, res, next) => {
    try {
      const bodyParams: ISearchBodyParams = await searchBodySchema.validateAsync(req.body);
      const response: ISearchResponseShape = await apiService.search(bodyParams);
      return res.send(response);
    } catch (error) {
      return next(error);
    }
  });

export default router;
