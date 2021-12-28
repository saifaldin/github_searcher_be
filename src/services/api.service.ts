import githubService from '../clients/github/github.service';
import { ISearchBodyParams } from '../controllers/interfaces/ISearchBodyParams';
import { ISearchResponseShape } from '../controllers/interfaces/ISearchResponseShape';

export default {
  async search(bodyParams: ISearchBodyParams) {
    const { limit } = bodyParams;

    const {
      searchResults: results, remainingRequests,
    } = await githubService.searchGithub(bodyParams);

    const finalResponseShape: ISearchResponseShape = {
      hasNextPage: results.length === limit,
      resultsCount: results.length,
      rateLimit: {
        remaining: remainingRequests,
      },
      results,
    };
    return finalResponseShape;
  },
};