import { AxiosResponse } from 'axios';

import GITHUB_CLIENT from './github.client';
import { SearchTypes } from '../../controllers/enums/types.enum';
import { ISearchBodyParams } from '../../controllers/interfaces/ISearchBodyParams';
import { IGithubSearchParams } from './interfaces/IGithubSearchParams';

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
});

export default {
  async searchGithub(bodyParams: ISearchBodyParams) {
    const {
      text, type, page, limit,
    } = bodyParams;

    const remainingRequests = (await GITHUB_CLIENT.rateLimitDetails({}))
      .data.resources.search.remaining;
    if (remainingRequests === 0) {
      return { searchResults: [], remainingRequests };
    }

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

    return { searchResults, remainingRequests };
  },
};