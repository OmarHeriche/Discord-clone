const superTest = require('supertest');
const createApp = require('../app');

// const express = jest.fn().mockReturnValue({ use: jest.fn(), json: jest.fn() });
const notFound = jest.fn();
// const userRouter = jest.fn();
const friendRouter = jest.fn();
const register_login_router = jest.fn();
const groupRouter = jest.fn();

//?

// Mock only necessary dependencies
const express = jest.fn().mockReturnValue({ use: jest.fn() });
const userRouter = jest.fn().get('/api/v1/users', (req, res) => res.status(200).json({ message: 'Success' }));

describe('dealing with users route', () => {
  it('GET /api/v1/users should return status 200', async () => {
    const app = createApp(express, notFound, userRouter, friendRouter, register_login_router, groupRouter);
    const response = await superTest(app).get('/api/v1/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' }); // Assert response body
  });
});
