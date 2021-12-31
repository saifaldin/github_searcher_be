import { AxiosResponse } from 'axios';

import GITHUB_CLIENT from './github.client';
import { SearchTypes } from '../../controllers/enums/types.enum';
import { ISearchQueryParams } from '../../controllers/interfaces/ISearchQueryParams';
import { IGithubSearchParams } from './interfaces/IGithubSearchParams';
import { Results } from '../../controllers/interfaces/ISearchResponseShape';
import { IUserDetailsQueryParams } from '../../controllers/interfaces/IUserDetailsQueryParams';
import { IUserDetails } from '../../controllers/interfaces/IUserDetailsResponseShape';

const userResultsMapper = (result: any) => ({
  avatar: result.avatar_url,
  name: result.login,
  profileUrl: result.html_url,
});

const repoResultsMapper = (result: any) => ({
  userDetails: {
    avatar: result.owner.avatar_url,
    name: result.owner.login,
    profileUrl: result.owner.html_url,
  },
  name: result.name,
  stars: result.stargazers_count,
  repoUrl: result.html_url,
});

export default {
  async searchGithub(queryParams: ISearchQueryParams): Promise<Results> {
    const {
      text, type, page, limit,
    } = queryParams;

    const params: IGithubSearchParams = { q: text, page: page || 1, per_page: limit || 30 };
    const githubResponse: AxiosResponse = await GITHUB_CLIENT.search(type, { params });
    let { data: { items: searchResults } } = githubResponse;

    searchResults = searchResults.map(
      (result: any) => {
        if (type === SearchTypes.USERS) {
          return userResultsMapper(result);
        }
        return repoResultsMapper(result);
      },
    );

    return searchResults;
  },
  async getUserDetails(queryParams: IUserDetailsQueryParams): Promise<IUserDetails> {
    const { user } = queryParams;

    const githubResponse: AxiosResponse = await GITHUB_CLIENT.userDetails(user);
    const { data } = githubResponse;

    return {
      location: data.location,
      followers: data.followers,
      publicRepos: data.public_repos,
    };
  },
  async getRemainingRequests() {
    const { data: { resources: { search, core } } } = await GITHUB_CLIENT.rateLimitDetails('');
    return {
      search: search.remaining,
      core: core.remaining,
    };
  },
};