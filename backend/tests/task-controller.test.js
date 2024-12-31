import request from 'supertest';
import { setupTestDB } from './test-setup.js'; // Assuming you have the setupTestDB file
import app from '../index.js'; // Your Express app instance
import { Task } from '../models/task';

// Set up the test database, including seeding if needed
setupTestDB();

describe('Task Controller Tests', () => {

    // Seed the database with some test data before running the tests
    beforeEach(async () => {
        await Task.insertMany([
            { title: 'Task 1', description: 'First task', status: 'open' },
            { title: 'Task 2', description: 'Second task', status: 'in progress' },
        ]);
    });

    // Clean the database after each test
    afterEach(async () => {
        await Task.deleteMany({});
    });

    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks').expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0].title).toBe('Task 1');
    });

    it('should get a task by ID', async () => {
        const task = await Task.findOne({ title: 'Task 1' });
        const response = await request(app).get(`/tasks/${task.id}`).expect(200);

        expect(response.body.title).toBe('Task 1');
        expect(response.body.description).toBe('First task');
    });

    it('should return 404 if task is not found by ID', async () => {
        const response = await request(app).get('/tasks/614c1b3f4f1b25639cfa832a').expect(404);

        expect(response.body.message).toBe('Not Found');
    });

    it('should create a new task', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ title: 'Task 3', description: 'New task', status: 'open' })
            .expect(201);

        expect(response.body.message).toBe('ok');

        const task = await Task.
        findOne({ title: 'Task 3' });
        expect(task).not.toBeNull();
        expect(task.title).toBe('Task 3');
        expect(task.description).toBe('New task');
        expect(task.status).toBe('open');
    });

    it('should not create a task with an existing title', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ title: 'Task 1', description: 'Duplicate task', status: 'open' })
            .expect(401);

        expect(response.body.message).toBe('Task Exists');
    });

    it('should update a task by ID', async () => {
        const task = await Task.findOne({ title: 'Task 1' });

        const response = await request(app)
            .put(`/tasks/${task._id}`)
            .send({ title: 'Updated Task 1', description: 'Updated description', status: 'done' })
            .expect(200);

        expect(response.body.message).toBe('successful');

        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.title).toBe('Updated Task 1');
        expect(updatedTask.description).toBe('Updated description');
        expect(updatedTask.status).toBe('done');
    });

    it('should delete a task by ID', async () => {
        const task = await Task.findOne({ title: 'Task 1' });

        const response = await request(app).delete(`/tasks/${task._id}`).expect(200);

        expect(response.body.message).toBe('Task deleted successfully');

        const deletedTask = await Task.findById(task._id);
        expect(deletedTask).toBeNull();
    });
});