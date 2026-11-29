import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { getDb } from '../src/db/connect.js';

describe('GET /api/trains', () => {
  test('returns a successful JSON response', async () => {
    const response = await request(app).get('/api/trains');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveProperty('trains');
    expect(response.body.trains).toBeInstanceOf(Array);
  });

  test('returns the trains from the starter data', async () => {
    const response = await request(app).get('/api/trains');

    expect(response.status).toBe(200);
    expect(response.body.trains).toHaveLength(4);
    expect(response.body.trains).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'series-e353',
          name: 'Series E353 Limited Express',
          powerSource: 'Electric'
        })
      ])
    );
  });

  test('returns a train added to the test database', async () => {
    await getDb().collection('trains').insertOne({
      id: 'test-express',
      name: 'Test Express',
      operator: 'Test Railway'
    });

    const response = await request(app).get('/api/trains');

    expect(response.status).toBe(200);
    expect(response.body.trains).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'test-express',
          name: 'Test Express'
        })
      ])
    );
  });
  test('returns pagination metadata', async () => {
    const response = await request(app).get('/api/trains');

    expect(response.status).toBe(200);
    expect(response.body.pagination).toEqual({
      currentPage: 1,
      pageSize: 10,
      totalTrains: 4,
      totalPages: 1
    });
  });

  test('rejects invalid page numbers', async () => {
    const response = await request(app).get('/api/trains?page=0');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'error',
      'Page must be a positive integer.'
    );
  });

  test('splits trains into pages of 10', async () => {
    const extraTrains = Array.from({ length: 11 }, (_, index) => ({
      id: `pagination-train-${index + 1}`,
      name: `Pagination Train ${index + 1}`,
      operator: 'Test Railway',
      type: 'Express',
      maxSpeedKmh: 200,
      capacity: 300,
      powerSource: 'Electric'
    }));

    await getDb().collection('trains').insertMany(extraTrains);

    const firstPage = await request(app).get('/api/trains?page=1');
    const secondPage = await request(app).get('/api/trains?page=2');

    expect(firstPage.status).toBe(200);
    expect(secondPage.status).toBe(200);

    expect(firstPage.body.trains).toHaveLength(10);
    expect(secondPage.body.trains).toHaveLength(5);

    expect(firstPage.body.pagination.totalTrains).toBe(15);
    expect(secondPage.body.pagination.currentPage).toBe(2);
    expect(secondPage.body.pagination.totalPages).toBe(2);
  });
});
