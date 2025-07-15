const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');
const User = require('../../src/models/User');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const user = await User.create({
    username: 'testuser',
    password: 'password123',
  });
  userId = user._id;
  token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Bug.deleteMany({});
});

describe('Bug Controller Integration Tests', () => {
  describe('POST /api/bugs', () => {
    it('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'high',
      };

      const res = await request(app)
        .post('/api/bugs')
        .set('Authorization', `Bearer ${token}`)
        .send(bugData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(bugData.title);
      expect(res.body.description).toBe(bugData.description);
      expect(res.body.status).toBe(bugData.status);
      expect(res.body.priority).toBe(bugData.priority);
      expect(res.body.createdBy).toBe(userId.toString());

      const savedBug = await Bug.findOne({ title: bugData.title });
      expect(savedBug).toBeTruthy();
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'T' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Description must be at least 10 characters long');
    });

    it('should return 401 for missing token', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send({ title: 'Test Bug', description: 'Test Description' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/bugs', () => {
    it('should retrieve all bugs for authenticated user with filters', async () => {
      await Bug.create([
        { title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'high', createdBy: userId },
        { title: 'Bug 2', description: 'Desc 2', status: 'resolved', priority: 'low', createdBy: userId },
      ]);

      const res = await request(app)
        .get('/api/bugs?status=open&priority=high')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Bug 1');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update a bug for authorized user', async () => {
      const bug = await Bug.create({
        title: 'Bug to Update',
        description: 'Description',
        status: 'open',
        priority: 'medium',
        createdBy: userId,
      });

      const res = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'resolved', priority: 'high' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('resolved');
      expect(res.body.priority).toBe('high');
    });

    it('should return 403 for unauthorized user', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        password: 'password123',
      });
      const bug = await Bug.create({
        title: 'Bug to Update',
        description: 'Description',
        createdBy: otherUser._id,
      });

      const res = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'resolved' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized to update this bug');
    });
  });
});
