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
  test('searches trains by keyword', async () => {
    await getDb().collection('trains').insertOne({
      id: 'search-test-train',
      name: 'Unique Search Test Train',
      operator: 'Test Railway',
      type: 'Express',
      powerSource: 'Electric',
      description: 'A train for testing keyword search'
    });

    const response = await request(app)
      .get('/api/trains?search=Unique%20Search%20Test');

    expect(response.status).toBe(200);
    expect(response.body.trains).toHaveLength(1);
    expect(response.body.trains[0].id).toBe('search-test-train');
    expect(response.body.pagination.totalTrains).toBe(1);
  });

  test('filters trains by type', async () => {
    await getDb().collection('trains').insertOne({
      id: 'type-filter-test-train',
      name: 'Unique Type Filter Train',
      type: 'TestType'
    });

    const response = await request(app)
      .get('/api/trains?type=testtype');

    expect(response.status).toBe(200);
    expect(response.body.trains).toHaveLength(1);
    expect(response.body.trains[0].id).toBe('type-filter-test-train');
    expect(response.body.pagination.totalTrains).toBe(1);
  });

  test('combines keyword search and type filtering', async () => {
    await getDb().collection('trains').insertMany([
      {
        id: 'combined-filter-match',
        name: 'Unique Combined Test Train',
        type: 'CombinedTestType'
      },
      {
        id: 'combined-filter-wrong-type',
        name: 'Unique Combined Test Train',
        type: 'OtherType'
      }
    ]);

    const response = await request(app)
      .get('/api/trains?search=Unique%20Combined&type=CombinedTestType');

    expect(response.status).toBe(200);
    expect(response.body.trains).toHaveLength(1);
    expect(response.body.trains[0].id).toBe('combined-filter-match');
    expect(response.body.pagination.totalTrains).toBe(1);
  });

  test('rejects search input longer than 100 characters', async () => {
    const response = await request(app)
      .get(`/api/trains?search=${'a'.repeat(101)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'error',
      'Search must be a string of no more than 100 characters.'
    );
  });
});
