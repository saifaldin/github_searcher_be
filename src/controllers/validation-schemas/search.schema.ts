import Joi from 'joi';
import { SearchTypes } from '../enums/types.enum';

const searchBodySchema = Joi.object({
  type: Joi.string().valid(SearchTypes.REPOSITORIES, SearchTypes.USERS),
  text: Joi.string(),
});

export default searchBodySchema;