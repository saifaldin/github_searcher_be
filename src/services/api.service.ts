import githubService from '../clients/github/github.service';
import { ISearchQueryParams } from '../controllers/interfaces/ISearchQueryParams';
import { ISearchResponseShape, Results } from '../controllers/interfaces/ISearchResponseShape';
import { IUserDetailsQueryParams } from '../controllers/interfaces/IUserDetailsQueryParams';
import { IUserDetails, IUserDetailsResponseShape } from '../controllers/interfaces/IUserDetailsResponseShape';
import redisClient from '../redis/redis.client';

const cache = async (key: string, value: Results | IUserDetails) => {
  const threeHours = 3 * 60 * 60;

  return redisClient.setEx(key, threeHours, JSON.stringify(value));
};

const getCachedData = async (key: string) => {
  const cachedData = await redisClient.get(key);

  return JSON.parse((cachedData || null) as string);
};

const setSearchResultResponse = (
  results: Results,
  limit: number,
  remainingRequests: number,
): ISearchResponseShape => (
  {
    hasNextPage: results.length === limit,
    resultsCount: results.length,
    rateLimit: {
      remaining: remainingRequests,
    },
    results,
  }
);

const setUserDetailsResponse = (
  userDetails: IUserDetails,
  remainingRequests: number,
): IUserDetailsResponseShape => ({
  ...userDetails,
  rateLimit: {
    remaining: remainingRequests,
  },
});

export default {
  async search(queryParams: ISearchQueryParams): Promise<ISearchResponseShape> {
    const {
      type,
      text,
      page,
      limit,
    } = queryParams;

    const { search: remainingRequests } = await githubService.getRemainingRequests();

    const cachedResults = await getCachedData(`${type}:${text}:${page}:${limit}`);
    if (cachedResults) {
      return setSearchResultResponse(cachedResults, limit, remainingRequests);
    }

    if (remainingRequests === 0) {
      return setSearchResultResponse([], limit, remainingRequests);
    }

    const results = await githubService.searchGithub(queryParams);

    cache(`${type}:${text}:${page}:${limit}`, results);

    return setSearchResultResponse(results, limit, remainingRequests - 1);
  },
  async userDetails(queryParams: IUserDetailsQueryParams) {
    const { user } = queryParams;

    const { core: remainingRequests } = await githubService.getRemainingRequests();

    const cachedUser = await getCachedData(user);
    if (cachedUser) {
      return setUserDetailsResponse(cachedUser, remainingRequests);
    }

    if (remainingRequests === 0) {
      return setUserDetailsResponse({} as IUserDetails, remainingRequests);
    }

    const userDetails = await githubService.getUserDetails(queryParams);

    cache(user, userDetails);

    return setUserDetailsResponse(userDetails, remainingRequests - 1);
  },
  async clearCache(): Promise<void> {
    await redisClient.flushAll();
  },
};