import Joi from 'joi';
import { SearchTypes } from './enums/types.enum';

const searchQuerySchema = Joi.object({
  type: Joi.string().valid(SearchTypes.REPOSITORIES, SearchTypes.USERS).required(),
  text: Joi.string().required(),
  page: Joi.number().default(1),
  limit: Joi.number().default(30),
});

const userDetailsQuerySchema = Joi.object({
  user: Joi.string().required(),
});

export default {
  searchQuerySchema,
  userDetailsQuerySchema,
};