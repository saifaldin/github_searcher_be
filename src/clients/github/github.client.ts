import axios from 'axios';

export default {
  search: axios.create({
    baseURL: 'https://api.github.com/search',
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  }),

  userDetails: axios.create({
    baseURL: 'https://api.github.com/users',
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  }),

  rateLimitDetails: axios.create({
    baseURL: 'https://api.github.com/rate_limit',
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  }),
};