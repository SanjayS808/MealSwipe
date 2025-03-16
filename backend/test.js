// The following file is used for all the tests needed for the backend service. Tests all API calls and some edge cases.

const { app, server } = require('./server.js')
const supertest = require('supertest')
const supertestRequest = supertest(server)

// describe block to explain how our GET route functions.
describe('GET /api/serve/get-all-restaurants', () => {
  it('GET should return a list of all restaurants from maxDistance', async () => {
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

  it('GET should always contain location information.', async () => {
    const res = await supertestRequest.get('/api/serve/get-all-restaurants?maxDistance=100');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      res.body.forEach(item => {
        expect(item).toHaveProperty('location');
      });
    }
  });

  it('GET with custom minRating should get values above minRating', async () => {
    const res = await supertestRequest.get('/api/serve/get-all-restaurants?maxDistance=100&minRating=3.0');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      res.body.forEach(item => {
        expect(item).toHaveProperty('rating');
        expect(item['rating']).toBeGreaterThan(3.0)
      });
    }
  });
});

afterAll(() => {
  server.close();
});