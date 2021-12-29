import githubService from '../clients/github/github.service';
import { ISearchBodyParams } from '../controllers/interfaces/ISearchBodyParams';
import { ISearchResponseShape, Results } from '../controllers/interfaces/ISearchResponseShape';
import redisClient from '../redis/redis.client';

const cache = async (bodyParams: ISearchBodyParams, value: Results) => {
  const {
    type,
    text,
    page,
    limit,
  } = bodyParams;
  const threeHours = 3 * 60 * 60;

  return redisClient.setEx(`${type}:${text}:${page}:${limit}`, threeHours, JSON.stringify(value));
};

const getCachedData = async (
  bodyParams: ISearchBodyParams,
): Promise<Results | null> => {
  const {
    type,
    text,
    page,
    limit,
  } = bodyParams;

  const cachedData = await redisClient.get(`${type}:${text}:${page}:${limit}`);

  return JSON.parse((cachedData || null) as string);
};

const setSearchResultResponse = (
  results: Results,
  limit: number,
  remainingRequests: number,
): ISearchResponseShape => ({
  hasNextPage: results.length === limit,
  resultsCount: results.length,
  rateLimit: {
    remaining: remainingRequests,
  },
  results,
});

export default {
  async search(bodyParams: ISearchBodyParams): Promise<ISearchResponseShape> {
    const { limit } = bodyParams;

    const remainingRequests = await githubService.getRemainingRequests();

    const cachedResults = await getCachedData(bodyParams);
    if (cachedResults) {
      return setSearchResultResponse(cachedResults, limit, remainingRequests);
    }

    if (remainingRequests === 0) {
      return setSearchResultResponse([], limit, remainingRequests);
    }

    const results = await githubService.searchGithub(bodyParams);

    cache(bodyParams, results);

    return setSearchResultResponse(results, limit, remainingRequests);
  },
};