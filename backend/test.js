// The following file is used for all the tests needed for the backend service. Tests all API calls and some edge cases.

const server = require('./server.js')
const supertest = require('supertest')
const supertestRequest = supertest(server)

// describe block to explain how our GET route functions.
describe('GET /api/serve/get-all-restaurants', () => {
  it('GET should return all users with max distance', async () => {
    const res = await supertestRequest.get('/api/serve/get-all-restaurants?maxDistance=100&minRating=0.0'); // Measured in kilometers.
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      res.body.forEach(item => {
        expect(item).toEqual(expect.objectContaining({}));
      });
    }
  });
});