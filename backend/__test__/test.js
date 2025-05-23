// The following file is used for all the tests needed for the backend service. Tests all API calls and some edge cases.

const { app, server, imageCache, contentTypeCache, CACHE_EXPIRATION_TIME } = require('../server.js');
const request = require('supertest');
const pool = require('../db'); // Adjust path to your DB connection file
const fetchMock = require('jest-fetch-mock');
const fs = require('fs');

// Global variables used for testing.
// Mock the PostgreSQL pool
jest.mock('../db', () => ({
  query: jest.fn()
}));

beforeEach(() => {
  global.imageCache = new Map();
  global.contentTypeCache = new Map();
  global.CACHE_EXPIRATION_TIME = 60 * 60 * 1000;
  global.GOOGLE_API_KEY = 'mock-key';

  jest.clearAllMocks();
});

describe('API Endpoints', () => {

  // Test 1: Get all the restaurants information.
  describe('GET /api/serve/get-all-restaurants', () => {
    it('GET should return a list of all restaurants from maxDistance', async () => {
      const res = await request(server).get('/api/serve/get-all-restaurants?maxDistance=100&minRating=0.0'); // Measured in kilometers.
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
      const res = await request(server).get('/api/serve/get-all-restaurants?maxDistance=100');
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
    const res = await request(server).get('/api/serve/get-all-restaurants?maxDistance=100&minRating=3.0');
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

  // Test 2: Get userId with username
  describe('GET /api/serve/get-restaurant-photo', () => {
    beforeAll(() => {
      fetchMock.enableMocks();
    });

    beforeEach(() => {
      fetchMock.resetMocks();
      // Clear caches before each test
      imageCache.clear();
      contentTypeCache.clear();
    });

    afterAll(() => {
      server.close();
    });

    it('should return 400 if rinfo not provided', async () => {
      const res = await request(server).get('/api/serve/get-restaurant-photo');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Missing restaurant photo reference (rinfo)." });
    });

    it('should fetch image and cache it', async () => {
      const fakeImage = Buffer.from([0x01, 0x02, 0x03]);
      fetchMock.mockResponseOnce(fakeImage, {
        status: 200,
        headers: { 'content-type': 'image/png' },
      });

      const rinfo = 'photoRef1';
      const res = await request(server).get(`/api/serve/get-restaurant-photo?rinfo=${rinfo}`);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toBe('image/png');
      expect(res.body).toEqual(fakeImage);
      expect(imageCache.has(rinfo)).toBe(true);
      expect(contentTypeCache.get(rinfo)).toBe('image/png');
    });

    it('should serve cached image on subsequent requests', async () => {
      const fakeImage = Buffer.from([0x0A, 0x0B, 0x0C]);
      fetchMock.mockResponseOnce(fakeImage, {
        status: 200,
        headers: { 'content-type': 'image/jpeg' },
      });

      const rinfo = 'photoRef2';
      // First request fetches and caches
      await request(server).get(`/api/serve/get-restaurant-photo?rinfo=${rinfo}`);
      // Clear fetch mocks so any fetch calls will be evident
      fetchMock.mockClear();

      const res2 = await request(server).get(`/api/serve/get-restaurant-photo?rinfo=${rinfo}`);
      expect(res2.status).toBe(200);
      expect(res2.header['content-type']).toBe('image/jpeg');
      expect(res2.body).toEqual(fakeImage);
      // Ensure no new fetch call was made
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should return 500 when Google API fails', async () => {
      fetchMock.mockRejectOnce(new Error('Google API down'));

      const rinfo = 'failRef';
      const res = await request(server).get(`/api/serve/get-restaurant-photo?rinfo=${rinfo}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Failed to fetch image');
    });

    it('should refetch image when cache expired', async () => {
      jest.useFakeTimers();
      const fakeImage1 = Buffer.from([0xAA]);
      const fakeImage2 = Buffer.from([0xBB]);

      fetchMock
        .mockResponseOnce(fakeImage1, {
          status: 200,
          headers: { 'content-type': 'image/gif' },
        })
        .mockResponseOnce(fakeImage2, {
          status: 200,
          headers: { 'content-type': 'image/gif' },
        });

      const rinfo = 'photoRef3';
      // First fetch
      const res1 = await request(server).get(`/api/serve/get-restaurant-photo?rinfo=${rinfo}`);
      expect(res1.body).toEqual(fakeImage1);

      // Advance time beyond expiration
      jest.advanceTimersByTime(CACHE_EXPIRATION_TIME + 1000);
      // Second request should trigger new fetch
      const res2 = await request(server).get(`/api/serve/get-restaurant-photo?rinfo=${rinfo}`);
      expect(res2.body).toEqual(fakeImage2);
      expect(fetchMock).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });
  });

  // Test 3: Get userId with username
  describe('GET /api/serve/get-userid-with-uname', () => {
    it('should return user ID when valid username is provided', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [{ userid: '123' }]
      });

      const response = await request(server)
        .get('/api/serve/get-userid-with-uname')
        .query({ uname: 'testuser' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ userid: '123' }]);
      expect(pool.query).toHaveBeenCalledWith("SELECT userid FROM Users WHERE name='testuser';");
    });

    it('should return 400 when username is not provided', async () => {
      const response = await request(server)
        .get('/api/serve/get-userid-with-uname');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not fetch undefined username.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(server)
        .get('/api/serve/get-userid-with-uname')
        .query({ uname: 'testuser' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 4: Get user info with ID
  describe('GET /api/serve/get-user-with-id', () => {
    it('should return user info when valid user ID is provided', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [{ userid: '123', name: 'testuser', bio: 'Test bio', nswipes: 5 }]
      });

      const response = await request(app)
        .get('/api/serve/get-user-with-id')
        .query({ uid: '123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ userid: '123', name: 'testuser', bio: 'Test bio', nswipes: 5 }]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Users WHERE userid='123';");
    });

    it('should return 400 when user ID is not provided', async () => {
      const response = await request(app)
        .get('/api/serve/get-user-with-id');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not fetch undefined user.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/serve/get-user-with-id')
        .query({ uid: '123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 5: Add user
  describe('POST /api/serve/add-user', () => {
    it('should add a new user when all information is provided', async () => {
      // Mock checking if user exists (returns empty array)
      pool.query.mockResolvedValueOnce({
        rows: []
      });

      // Mock adding user
      pool.query.mockResolvedValueOnce({
        rowCount: 1
      });

      const userData = {
        uid: 123,
        uname: 'newuser',
        ubio: 'New user bio',
        nswipe: 10,
        email: 'test_email@testemail.com',
      };

      const response = await request(app)
        .post('/api/serve/add-user')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual("User succesfully added.");
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 when user information is missing', async () => {
      const response = await request(app)
        .post('/api/serve/add-user')
        .send({ uid: 123, uname: 'newuser' }); // Missing ubio and nswipes

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not create user. User information is missing.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return a warming and 200 when username already exists', async () => {
      // Mock checking if user exists (returns a user)
      pool.query.mockResolvedValueOnce({
        rows: [{ userid: 123, name: 'existinguser' }]
      });

      const userData = {
        uid: 123,
        uname: 'existinguser',
        ubio: 'User bio',
        nswipe: 10,
        email: 'test_email@testemail.com',
      };

      const response = await request(app)
        .post('/api/serve/add-user')
        .send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({error: 'User already exists.'});
    });
  });

  // Test 6: Get restaurant ID with restaurant name
  describe('GET /api/serve/get-rid-with-rname', () => {
    it('should return restaurant name when valid restaurant name is provided', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [{ name: 'Test Restaurant' }]
      });

      const response = await request(app)
        .get('/api/serve/get-rid-with-rname')
        .query({ rname: 'Test Restaurant' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ name: 'Test Restaurant' }]);
      expect(pool.query).toHaveBeenCalledWith("SELECT name FROM restaurants WHERE name='Test Restaurant';");
    });

    it('should return 400 when restaurant name is not provided', async () => {
      const response = await request(app)
        .get('/api/serve/get-rid-with-rname');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not fetch undefined restuarant.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/serve/get-rid-with-rname')
        .query({ rname: 'Test Restaurant' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 7: Get restaurant info with restaurant ID
  describe('GET /api/serve/get-rinfo-with-rid', () => {
    it('should return restaurant info when valid restaurant ID is provided', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [{ placeid: 'rest123', name: 'Test Restaurant', price: 2, rating: 4.5 }]
      });

      const response = await request(app)
        .get('/api/serve/get-rinfo-with-rid')
        .query({ rid: 'rest123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ placeid: 'rest123', name: 'Test Restaurant', price: 2, rating: 4.5 }]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM restaurants WHERE placeid='rest123';");
    });

    it('should return 400 when restaurant ID is not provided', async () => {
      const response = await request(app)
        .get('/api/serve/get-rinfo-with-rid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not fetch undefined restuarant.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/serve/get-rinfo-with-rid')
        .query({ rid: 'rest123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 8: Add restaurant
  describe('POST /api/serve/add-restaurant', () => {
    it('should add a new restaurant when all information is provided', async () => {
      // Mock checking if restaurant exists (returns empty array)
      pool.query.mockResolvedValueOnce({
        rows: []
      });

      // Mock adding restaurant
      pool.query.mockResolvedValueOnce({
        rowCount: 1
      });

      const restaurantData = {
        rid: 'rest123',
        rname: 'New Restaurant',
        price: 'PRICE_LEVEL_MODERATE',
        rating: 4.5,
        weburl: 'http://example.com',
        gmapurl: 'http://maps.google.com',
        address: '123 Test Dr.',
        photoUrl: 'abcdefghijklmnop.com'
      };

      const response = await request(app)
        .post('/api/serve/add-restaurant')
        .send(restaurantData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual("User succesfully added.");
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 when restaurant information is missing', async () => {
      const response = await request(app)
        .post('/api/serve/add-restaurant')
        .send({ rid: 'rest123', rname: 'New Restaurant' }); // Missing price, rating, etc.

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not create user. User information is missing.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return warning when restaurant name already exists', async () => {
      // Mock checking if restaurant exists (returns a restaurant)
      pool.query.mockResolvedValueOnce({
        rows: [{ placeid: 'rest123', name: 'Existing Restaurant' }]
      });

      const restaurantData = {
        rid: 'rest123',
        rname: 'Existing Restaurant',
        price: 'PRICE_LEVEL_MODERATE',
        rating: 4.5,
        weburl: 'http://example.com',
        gmapurl: 'http://maps.google.com',
        address: '123 Test Dr.',
        photoUrl: 'abcdefghijklmnop.com'
      };

      const response = await request(app)
        .post('/api/serve/add-restaurant')
        .send(restaurantData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ warning: `Username ${restaurantData.rname} already exists.` });
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test 9: Get user trashed restaurants
  describe('GET /api/serve/get-user-trashed-restaurant', () => {
    it('should return trashed restaurants when valid user ID is provided', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [
          { userid: '123', placeid: 'rest1' },
          { userid: '123', placeid: 'rest2' }
        ]
      });

      const response = await request(app)
        .get('/api/serve/get-user-trashed-restaurant')
        .query({ uid: '123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { userid: '123', placeid: 'rest1' },
        { userid: '123', placeid: 'rest2' }
      ]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM trashed_swipes WHERE userid='123';");
    });

    it('should return 400 when user ID is not provided', async () => {
      const response = await request(app)
        .get('/api/serve/get-user-trashed-restaurant');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not fetch undefined user.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/serve/get-user-trashed-restaurant')
        .query({ uid: '123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 10: Add user trashed restaurant
  describe('POST /api/serve/add-user-trashed-restaurant', () => {
    it('should add a trashed restaurant when valid user ID and restaurant ID are provided', async () => {
      // Mock checking if relation exists (returns empty array)
      pool.query.mockResolvedValueOnce({
        rows: []
      });

      // Mock adding relation
      pool.query.mockResolvedValueOnce({
        rowCount: 1
      });

      const data = {
        uid: '123',
        rid: 'rest123'
      };

      const response = await request(app)
        .post('/api/serve/add-user-trashed-restaurant')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body).toEqual("User succesfully added.");
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 when information is missing', async () => {
      const response = await request(app)
        .post('/api/serve/add-user-trashed-restaurant')
        .send({ uid: '123' }); // Missing rid

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not create user. User information is missing.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return warning when relation already exists', async () => {
      // Mock checking if relation exists (returns a relation)
      pool.query.mockResolvedValueOnce({
        rows: [{ userid: '123', placeid: 'rest123' }]
      });

      const data = {
        uid: '123',
        rid: 'rest123',
        rname: 'Test Restaurant' // This isn't used but is in error message
      };

      const response = await request(app)
        .post('/api/serve/add-user-trashed-restaurant')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ warning: `Swipe with ${data.rname} already exists.` });
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test 11: Get user favorite restaurants
  describe('GET /api/serve/get-user-favorite-restaurants', () => {
    it('should return favorite restaurants when valid user ID is provided', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [
          { userid: '123', placeid: 'rest1' },
          { userid: '123', placeid: 'rest2' }
        ]
      });

      const response = await request(app)
        .get('/api/serve/get-user-favorite-restaurants')
        .query({ uid: '123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { userid: '123', placeid: 'rest1' },
        { userid: '123', placeid: 'rest2' }
      ]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM liked_swipes WHERE userid='123';");
    });

    it('should return 400 when user ID is not provided', async () => {
      const response = await request(app)
        .get('/api/serve/get-user-favorite-restaurants');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not fetch undefined user.' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/serve/get-user-favorite-restaurants')
        .query({ uid: '123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 12: Add user favorite restaurant
  describe('POST /api/serve/add-user-favorite-restaurant', () => {
    it('should add a favorite restaurant when valid user ID and restaurant ID are provided', async () => {
      // Mock checking if relation exists (returns empty array)
      pool.query.mockResolvedValueOnce({
        rows: []
      });

      // Mock adding relation
      pool.query.mockResolvedValueOnce({
        rowCount: 1
      });

      const data = {
        uid: '123',
        rid: 'rest123'
      };

      const response = await request(app)
        .post('/api/serve/add-user-favorite-restaurant')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body).toEqual("User succesfully added.");
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 when information is missing', async () => {
      const response = await request(app)
        .post('/api/serve/add-user-favorite-restaurant')
        .send({ uid: '123' }); // Missing rid

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Could not create user. User information is missing.' });
      expect(pool.query).not.toHaveBeenCalled();
    });    

  // Test 11: DELETE /api/serve/delete-trashed-swipe-with-rid-uid
  describe('DELETE /api/serve/delete-trashed-swipe-with-rid-uid', () => {
    it('should successfully delete a specific trashed swipe for a user', async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 1 // Simulating one row deleted
      });

      const response = await request(app)
        .delete('/api/serve/delete-trashed-swipe-with-rid-uid')
        .query({ rid: 'restaurant123', uid: 'user456' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        transactionComplete: "Deleted trashed swipes of placeidown by user" 
      });
      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM trashed_swipes WHERE placeid='restaurant123' AND userid='user456'`
      );
    });

    it('should return 400 when both rid and uid are undefined', async () => {
      const response = await request(app)
        .delete('/api/serve/delete-trashed-swipe-with-rid-uid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ 
        error: 'Could not fetch with undefined user and restaurant id.' 
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      // Mock the database query to reject
      pool.query.mockRejectedValueOnce(new Error('Database connection error'));

      const response = await request(app)
        .delete('/api/serve/delete-trashed-swipe-with-rid-uid')
        .query({ rid: 'restaurant123', uid: 'user456' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 12: DELETE /api/serve/delete-favorite-swipe-with-rid-uid
  describe('DELETE /api/serve/delete-favorite-swipe-with-rid-uid', () => {
    it('should successfully delete a specific favorite swipe for a user', async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 1
      });

      const response = await request(app)
        .delete('/api/serve/delete-favorite-swipe-with-rid-uid')
        .query({ rid: 'restaurant789', uid: 'user123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        transactionComplete: "Deleted favorite_swipe of placeidown by user" 
      });
      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM liked_swipes WHERE placeid='restaurant789' AND userid='user123'`
      );
    });

    it('should return 400 when both rid and uid are undefined', async () => {
      const response = await request(app)
        .delete('/api/serve/delete-favorite-swipe-with-rid-uid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ 
        error: 'Could not fetch with undefined user and restaurant id.' 
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database connection error'));

      const response = await request(app)
        .delete('/api/serve/delete-favorite-swipe-with-rid-uid')
        .query({ rid: 'restaurant789', uid: 'user123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 13: DELETE /api/serve/delete-trashed-swipe-with-uid
  describe('DELETE /api/serve/delete-trashed-swipe-with-uid', () => {
    it('should successfully delete all trashed swipes for a user', async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 3 // Simulating 3 rows deleted
      });

      const response = await request(app)
        .delete('/api/serve/delete-trashed-swipe-with-uid')
        .query({ uid: 'user456' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        transactionComplete: "Deleted all trashed_swipes own by user" 
      });
      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM trashed_swipes WHERE userid='user456';`
      );
    });

    it('should return 400 when uid is undefined', async () => {
      const response = await request(app)
        .delete('/api/serve/delete-trashed-swipe-with-uid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ 
        error: 'Could not fetch with undefined user.' 
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database connection error'));

      const response = await request(app)
        .delete('/api/serve/delete-trashed-swipe-with-uid')
        .query({ uid: 'user456' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test 14 DELETE /api/serve/delete-favorite-swipe-with-uid
  describe('DELETE /api/serve/delete-favorite-swipe-with-uid', () => {
    it('should successfully delete all favorite swipes for a user', async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 2 // Simulating 2 rows deleted
      });

      const response = await request(app)
        .delete('/api/serve/delete-favorite-swipe-with-uid')
        .query({ uid: 'user123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        transactionComplete: "Deleted all trashed_swipes own by user" 
      });
      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM liked_swipes WHERE userid='user123';`
      );
    });

    it('should return 400 when uid is undefined', async () => {
      const response = await request(app)
        .delete('/api/serve/delete-favorite-swipe-with-uid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ 
        error: 'Could not fetch with undefined user.' 
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 500 when database query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database connection error'));

      const response = await request(app)
        .delete('/api/serve/delete-favorite-swipe-with-uid')
        .query({ uid: 'user123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

    it('should return warning when relation already exists', async () => {
      // Mock checking if relation exists (returns a relation)
      pool.query.mockResolvedValueOnce({
        rows: [{ userid: '123', placeid: 'rest123' }]
      });

      const data = {
        uid: '123',
        rid: 'rest123',
        rname: 'Test Restaurant' // This isn't used but is in error message
      };

      const response = await request(app)
        .post('/api/serve/add-user-favorite-restaurant')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ warning: `Username ${data.rname} already exists.` });
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });


  // Test 13: Testing the increment of user's swipes/
  describe('GET /api/serve/get-swipes', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => server.close());
  
    it('should return 400 if uid not provided', async () => {
      const res = await request(server).get('/api/serve/get-swipes');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Could not fetch undefined username.' });
    });
  
    it('should return swipes count for valid uid', async () => {
      const mockRows = [{ numswipes: 5 }];
      pool.query.mockResolvedValue({ rows: mockRows });
  
      const uid = '123';
      const res = await request(server).get(`/api/serve/get-swipes?uid=${uid}`);
  
      expect(pool.query).toHaveBeenCalledWith(`SELECT numswipes FROM Users WHERE userid=${uid};`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockRows);
    });
  
    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
  
      const res = await request(server).get('/api/serve/get-swipes?uid=123');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
  
  // Test 14: Testing the increment of user's swipes/
  describe('POST /api/serve/increment-swipes', () => {
    beforeEach(() => jest.clearAllMocks());
  
    it('should return 400 if uid or rid missing', async () => {
      const res = await request(server)
        .post('/api/serve/increment-swipes')
        .send({});
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Could not create user. User information is missing.' });
    });
  
    it('should increment swipes for valid request', async () => {
      pool.query.mockResolvedValue({});
      const payload = { uid: 123, rid: 'abc' };
  
      const res = await request(server)
        .post('/api/serve/increment-swipes')
        .send(payload);
  
      expect(pool.query).toHaveBeenCalledWith(
        `UPDATE users SET numswipes = numswipes +1 WHERE userid=${payload.uid};`
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ transactionComplete: 'Added number of swipes to 1.' });
    });
  
    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('DB fail'));
  
      const res = await request(server)
        .post('/api/serve/increment-swipes')
        .send({ uid: 123, rid: 'abc' });
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
  

  // Test 15: Health check
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ "health-check-status": "working" });
    });
  });

  // Test 16: Root endpoint
  describe('GET /', () => {
    it('should return connection status', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ "connection-status": "valid" });
    });
  });

  // Test 17: API index endpoint
  describe('GET /api', () => {
    it('should return restaurants array', async () => {
      const response = await request(app).get('/api');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ "restaurants": ["resOne", "resTwo"] });
    });
  });
});

afterAll(() => {
  server.close();
});