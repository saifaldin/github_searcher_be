## Github Searcher BE
### Start using docker & docker-compose
Using docker-compose would be a better option for starting redis too.
Run: `docker-compose up`

### Available Scripts

In the project directory, you can run:

#### `npm start`
#### `npm run build` 
#### `npm run start:watch`
#### `npm run build:watch`
#### `npm run test`

## My solution

- Complete Swagger documentation can be found on `/api/docs`.
- Added configurations and basics: `dotenv`, `winston` for logging, `helmet`, and rate limiting.
- Added docker and docker-compose files for an easier start of the application.
- Added basic unit tests for methods. I couldn't add flow unit tests for controllers, or integration tests due to time.
- **Problem:** Github's small rate limit.<br/>**Solution:** I added rate limiting info in response body, so that frontend can use it.
- **Problem:** Github's search response doesnt contain user details such as: location, followers, and public repos number.<br/>It had to be retrieved from core api not search. The core api also had a tight rate limit of it's own, so I couldn't make an additional call for every result because that would depelete the rate limit in 1 or 2 requests.<br/>**Solution:** I created an additional endpoint `GET /user-details`, so that I can make a button in the frontend that retrieves one user details instead of 20 or 30.

