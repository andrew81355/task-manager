import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('GET /resources/:id', () => {
  
  // AC1: Returns 200 OK with resource details for valid ID
  it('AC1: Returns 200 OK with resource details for valid ID', async () => {
    const response = await request(app).get('/resources/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('created_at');
  });

  // AC2: Returns 404 Not Found if resource with provided ID does not exist
  it('AC2: Returns 404 Not Found if resource with provided ID does not exist', async () => {
    const response = await request(app).get('/resources/9999');
    expect(response.status).toBe(404);
  });

  // AC3: Returns 400 Bad Request if provided resource ID is in an invalid format
  it('AC3: Returns 400 Bad Request if provided resource ID is in an invalid format', async () => {
    const response = await request(app).get('/resources/abc');
    expect(response.status).toBe(400);
  });

  // AC4: Response is in JSON format and includes id, name, description, and created_at fields
  it('AC4: Response includes id, name, description, and created_at fields', async () => {
    const response = await request(app).get('/resources/1');
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('created_at');
  });

  // AC5: Handles requests within 500ms under normal load conditions
  it('AC5: Handles requests within 500ms under normal load conditions', async () => {
    const startTime = Date.now();
    const response = await request(app).get('/resources/1');
    const duration = Date.now() - startTime;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThanOrEqual(500);
  });

});