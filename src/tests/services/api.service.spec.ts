import redisClient from '../../redis/redis.client';
import service from '../../services/api.service';
import githubService from '../../clients/github/github.service';
import { SearchTypes } from '../../controllers/enums/types.enum';

jest.mock('../../clients/github/github.service', () => {
  const mockResults = [{
    avatar: '',
    name: '',
    profileUrl: '',
  }];
  const mockUserDetailsResult = {
    location: 'xyz',
  };

  return {
    getRemainingRequests: jest.fn().mockResolvedValue({ search: 2, core: 2 }),
    searchGithub: jest.fn().mockResolvedValue(mockResults),
    getUserDetails: jest.fn().mockResolvedValue(mockUserDetailsResult),
  };
});

describe('API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    redisClient.flushAll();
  });
  afterAll(() => {
    redisClient.quit();
  });

  describe('Service Function: search', () => {
    const mockSearchQueryParams = {
      type: SearchTypes.USERS,
      text: 'text',
      page: 1,
      limit: 1,
    };
    const mockResults = [{
      avatar: '',
      name: '',
      profileUrl: '',
    }];
    const mockSearchResponse = {
      hasNextPage: true,
      resultsCount: 1,
      rateLimit: {
        remaining: 1,
      },
      results: mockResults,
    };

    it('should successfully return search results', async () => {
      const searchResult = await service.search(mockSearchQueryParams);
      expect(searchResult).toEqual(mockSearchResponse);
    });
    it('should cache response and return it if queried again', async () => {
      const {
        type,
        text,
        page,
        limit,
      } = mockSearchQueryParams;
      const key = `${type}:${text}:${page}:${limit}`;

      await service.search(mockSearchQueryParams);

      const cachedData = await redisClient.get(key);

      await service.search(mockSearchQueryParams);

      expect(cachedData).not.toEqual(null);
      expect((githubService.searchGithub as jest.Mock).mock.calls.length).toEqual(1);
    });
  });
  describe('Service Function: userDetails', () => {
    const mockUserDetailsQueryParams = {
      user: 'user',
    };
    const mockUserDetailsResult = {
      location: 'xyz',
    };
    const mockUserDetailsResponse = {
      ...mockUserDetailsResult,
      rateLimit: {
        remaining: 1,
      },
    };
    it('should successfully return search results', async () => {
      const response = await service.userDetails(mockUserDetailsQueryParams);
      expect(response).toEqual(mockUserDetailsResponse);
    });
    it('should cache response and return it if queried again', async () => {
      const { user } = mockUserDetailsQueryParams;
      const key = user;

      await service.userDetails(mockUserDetailsQueryParams);

      const cachedData = await redisClient.get(key);

      await service.userDetails(mockUserDetailsQueryParams);

      expect(cachedData).not.toEqual(null);
      expect((githubService.getUserDetails as jest.Mock).mock.calls.length).toEqual(1);
    });
  });
});