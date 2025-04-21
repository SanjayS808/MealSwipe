
jest.mock('dotenv', () => ({ config: jest.fn() }));

// 2) Provide a fake Pool class that we can inspect:
const mockPoolInstance = { query: jest.fn(), connect: jest.fn() };
const mockPoolConstructor = jest.fn(() => mockPoolInstance);
jest.mock('pg', () => ({ Pool: mockPoolConstructor }));

describe('DB configuration', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();           // clear module cache
    process.env = { ...OLD_ENV };  // clone env
    // default dev values
    process.env.DB_PASSWORD_DEV = 'dev-pass';
    process.env.DB_USER_DEV     = 'dev-user';
    process.env.DB_USER_PROD    = 'prod-user';
    process.env.DB_URL_PATH     = 'localhost';
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore
  });

  it('uses dev credentials & no SSL when NODE_ENV !== production', () => {
    process.env.NODE_ENV = 'development';

    // re-require after setting env
    const pool = require('../db'); 

    expect(mockPoolConstructor).toHaveBeenCalledWith({
      user: 'dev-user',
      host: 'localhost',
      database: 'dev',
      password: 'dev-pass',
      port: 5432,
      ssl: false,
    });
    expect(pool).toBe(mockPoolInstance);
  });

  it('uses prod credentials & SSL when NODE_ENV === production', () => {
    process.env.NODE_ENV        = 'production';
    process.env.DB_PASSWORD_DEV = 'prod-pass';    // your code only reads DB_PASSWORD_DEV
    // NOTE: if you actually had DB_PASSWORD_PROD, you’d adjust the code & test accordingly.

    const pool = require('../db');

    expect(mockPoolConstructor).toHaveBeenCalledWith({
      user: 'prod-user',
      host: 'localhost',
      database: 'dev',
      password: 'prod-pass',
      port: 5432,
      ssl: { rejectUnauthorized: false },
    });
    expect(pool).toBe(mockPoolInstance);
  });
});
