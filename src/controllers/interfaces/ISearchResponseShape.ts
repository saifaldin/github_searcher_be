export interface ISearchResponseShape {
  results: Results,
  resultsCount: number,
  hasNextPage: boolean,
  rateLimit: {
    remaining: number,
  }
}

export type Results = IUserSearchResponseShape[] | IRepoSearchResponseShape[];

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
