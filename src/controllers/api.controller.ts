import { Router } from 'express';

import { ISearchQueryParams } from './interfaces/ISearchQueryParams';
import validations from './validations';
import apiService from '../services/api.service';
import { ISearchResponseShape } from './interfaces/ISearchResponseShape';
import { IUserDetailsQueryParams } from './interfaces/IUserDetailsQueryParams';
import { IUserDetailsResponseShape } from './interfaces/IUserDetailsResponseShape';

const router = Router();

router
  .get('/search', async (req, res, next) => {
    try {
      const queryParams: ISearchQueryParams = await validations
        .searchQuerySchema.validateAsync(req.query);

      const response: ISearchResponseShape = await apiService.search(queryParams);

      return res.send(response);
    } catch (error) {
      return next(error);
    }
  })
  .get('/user-details', async (req, res, next) => {
    try {
      const queryParams: IUserDetailsQueryParams = await validations
        .userDetailsQuerySchema.validateAsync(req.query);

      const response: IUserDetailsResponseShape = await apiService.userDetails(queryParams);

      return res.send(response);
    } catch (error) {
      return next(error);
    }
  })
  .post('/clear-cache', async (req, res, next) => {
    try {
      await apiService.clearCache();
      return res.send();
    } catch (error) {
      return next(error);
    }
  });

export default router;
