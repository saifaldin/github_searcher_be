import GITHUB_CLIENT from '../../clients/github/github.client';
import githubService from '../../clients/github/github.service';
import { SearchTypes } from '../../controllers/enums/types.enum';
import redisClient from '../../redis/redis.client';

jest.mock('../../clients/github/github.client', () => {
  const mockSearchResult = [{
    login: 'name',
    avatar_url: 'url',
    html_url: 'url',
  }];
  const mockUserDetailsResult = {
    location: '',
    followers: 1,
    public_repos: 1,
  };
  const mockRateLimitResult = {
    resources: {
      search: { remaining: 1 },
      core: { remaining: 1 },
    },
  };
  return {
    search: jest.fn().mockResolvedValue({ data: { items: mockSearchResult } }),
    userDetails: jest.fn().mockResolvedValue({ data: mockUserDetailsResult }),
    rateLimitDetails: jest.fn().mockResolvedValue({ data: mockRateLimitResult }),
  };
});

describe('Github Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    redisClient.quit();
  });
  describe('Service Function: searchGithub', () => {
    const mockSearchQueryParams = {
      type: SearchTypes.USERS,
      text: 'text',
      page: 1,
      limit: 1,
    };

    const mockUserSearchResult = [{
      name: 'name',
      avatar: 'url',
      profileUrl: 'url',
    }];

    const mockGithubSearchParams = {
      params: {
        q: mockSearchQueryParams.text,
        page: mockSearchQueryParams.page,
        per_page: mockSearchQueryParams.limit,
      },
    };

    it('should successfully return', async () => {
      const searchResult = await githubService.searchGithub(mockSearchQueryParams);
      expect(GITHUB_CLIENT.search).toBeCalledWith(
        mockSearchQueryParams.type,
        mockGithubSearchParams,
      );
      expect(searchResult).toEqual(mockUserSearchResult);
    });
  });
  describe('Service Function: getUserDetails', () => {
    const mockUserDetailsQueryParams = {
      user: 'user',
    };

    const mockUserDetailsResult = {
      location: '',
      followers: 1,
      publicRepos: 1,
    };
    const mockGithubSearchParams = {
      user: mockUserDetailsQueryParams.user,
    };

    it('should successfully return', async () => {
      const userDetailResult = await githubService.getUserDetails(mockUserDetailsQueryParams);
      expect(GITHUB_CLIENT.userDetails).toBeCalledWith(mockGithubSearchParams.user);
      expect(userDetailResult).toEqual(mockUserDetailsResult);
    });
  });
  describe('Service Function: getRemainingRequests', () => {
    const mockRateLimitResult = {
      search: 1,
      core: 1,
    };
    it('should successfully return', async () => {
      const userDetailResult = await githubService.getRemainingRequests();
      expect(GITHUB_CLIENT.rateLimitDetails).toBeCalled();
      expect(userDetailResult).toEqual(mockRateLimitResult);
    });
  });
});