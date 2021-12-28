export interface ISearchResponseShape {
  results: IUserSearchResponseShape[] | IRepoSearchResponseShape[],
  resultsCount: number,
  hasNextPage: boolean,
  rateLimit: {
    remaining: number,
  }
}

interface IUserSearchResponseShape {
  avatar: string,
  name: string,
  profileUrl: string,
}

interface IRepoSearchResponseShape {
  userDetails: IUserSearchResponseShape,
  name: string,
  stars: number,
  repoUrl: string,
}
