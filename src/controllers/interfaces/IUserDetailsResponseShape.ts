export interface IUserDetailsResponseShape extends IUserDetails {
  rateLimit: {
    remaining: number,
  }
}

export interface IUserDetails {
  location: string,
  followers: number,
  publicRepos: number,
}