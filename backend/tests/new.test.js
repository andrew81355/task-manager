import request from 'supertest';
import { setupTestDB } from './test-setup.js';
import app from '../index.js';
import { Task } from '../models/task.js';
import { expect } from 'vitest';
setupTestDB();

describe(' Task contoller 10 tests', () => {
    beforeEach(async () => {
        // insert 2 taks in the db before every test we do
        await Task.insertMany([ 
        {title: 'Task 1', description: 'First task', status: 'open'}, 
        {title: 'Task 2', description: 'Second task', status: 'in progress'}
        ]);
    });
    afterEach(async () => { 
        // delete the tasks from the db after every test we do
        await Task.deleteMany({}); 
    });
    it('create a task with status open if the status is not given', async () => {
        await request(app) 
        // create a task
            .post('/tasks') 
            // send title and description without status
            .send({title: 'Task 3', description: 'Third task'}) 
            // expect to get 201 status code
            .expect(201); 
        // to find the task we created
        const insertedTask = await Task.findOne({title: 'Task 3'}).lean();
        // check if the task is created 
        expect(insertedTask).toBeTruthy();
        // check if the status is open 
        expect(insertedTask.status).toBe('open'); 
    });

    it(' do not delete unneeded spaces from title and description when creating a task( no trim)', async () => {
        await request(app)
            .post('/tasks')
            // send title and description with unneeded spaces
            .send({title: '   Task 3   ', description: '   Third Task   '}) 
            .expect(201);

        const insertedTask = await Task.findOne({title: '   Task 3   '}).lean();
        expect(insertedTask).toBeTruthy();
        // check if the description is the same as we sent
        expect(insertedTask.description).toBe('   Third Task   '); 
    });

    it(' A very long title is accepted (more than 100 symbols', async () => {
        // create a string with 101 symbols
        const longTitle = 'a'.repeat(101); 
        await request(app)
            .post('/tasks')
            // send the long title
            .send({title: longTitle, description: 'Third Task'}) 
            .expect(201);
        // find task with the long title
        const insertedTask = await Task.findOne({title: longTitle}).lean(); 
        expect(insertedTask).toBeTruthy();
        // check the length of the title
        expect(insertedTask.title.length).toBe(101); 
    });

    it (' A very long description is accepted (more than 500 symbols', async () => {
        const longDescription = 'a'.repeat(501);
        await request(app)
            .post('/tasks')
            .send({title: 'Task 3', description: longDescription})
            .expect(201);

        const insertedTask = await Task.findOne({title: 'Task 3'}).lean();
        expect(insertedTask).toBeTruthy();
        expect(insertedTask.description.length).toBe(501); 
    });

    it('case sensitive duplicate titles are allowed(Task and task)', async () => {
        await request(app).post('/tasks').send({title: 'Task A', description: 'Description a'}).expect(201);
        await request(app).post('/tasks').send({title: 'Task a', description: 'Description b'}).expect(201);
        await Task.findOne({title: 'Task a'}).lean();      
    });

    it(' should not create a task without title', async () => {
        // we try to create a task that has no title
        await expect(Task.create({ description: 'No title here', status: 'open' }))
             // this message means error is thrown because title is required 
            .rejects.toThrow(/title.*required/iu); 
    });


    it('we can set any status when creating a task', async () => {
        // get the first task
        const task1 = await Task.findOne({title: 'Task 1'}); 
        // updating the status of this task
        const response = await request(app)
        // request to update the task 
            .put(`/tasks/${task1._id}`) 
            // send random status
            .send({status: 'error status'}) 
            .expect(200);
        // get updated task from db
        const updatedTask = await Task.findById(task1._id).lean(); 
        // checking the status of the updated task to be same that was send
        expect(updatedTask.status).toBe('error status'); 
        // making sure response is succesful
        expect(response.body.message).toBe('successful'); 

    });

    it('it ignores unknown fields, for example priority, no in data base', async () => {
        await request(app)
            .post('/tasks')
            .send({title: 'New Task', description: 'New Description', priority: 'high'}) 
            .expect(201);
        
        const insertedTask = await Task.findOne({title: 'New Task'}).lean();
        // checking the task we created
        expect(insertedTask).toBeTruthy();  
        // check if the unknown field is not added to our dataBASE
        expect(insertedTask.priority).toBeUndefined(); 
    });

    it('update description without changing any other field', async () => {
        // get the ffirst task
        const newTask = await Task.findOne({title: 'Task 1'}); 
        await request(app)
            .put(`/tasks/${newTask._id}`)
            // sending only the description
            .send({description: 'new Description'}) 
            .expect(200);
        // getting the updated task from database
        const updatedTask = await Task.findById(newTask._id).lean(); 
        // mmake sure that title is the same
        expect(updatedTask.title).toBe('Task 1'); 
        // same with status
        expect(updatedTask.status).toBe('open'); 
        // checking the description is update
        expect(updatedTask.description).toBe('new Description'); 
    });

    it('when updating body with nothing, it does not change anything', async () => {
        // find 1 task
        const beforeTask = await Task.findOne({title: 'Task 1'}).lean(); 
        const response = await request(app)
            .put(`/tasks/${beforeTask._id}`) 
            // sending nothing to update task
            .send({}) 
            .expect(200);
        // response must be succucsful
        expect(response.body.message).toBe('successful'); 
        const afterTask = await Task.findById(beforeTask._id).lean();
        // title are same or not
        expect(afterTask.title).toBe(beforeTask.title); 
        // description are same or not
        expect(afterTask.description).toBe(beforeTask.description); 
        // status are same or not
        expect(afterTask.status).toBe(beforeTask.status); 
    });
});