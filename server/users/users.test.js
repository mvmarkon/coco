import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import User from './user.model';

const userData = {
  name: 'John Doe',
  age: 34,
  email: 'mail1@mail.com',
  nickName: 'John'
}

describe('/api/users tests', () => {
  const mongod = new MongodbMemoryServer();

  beforeAll(async () => {
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    await User.remove({});
  });

  it('should post and get a user', async () => {
    const postResponse = await request(app).post('/api/users').send(userData);
    expect(postResponse.status).toBe(200);

    const getResponse = await request(app).get('/api/users');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual([expect.objectContaining(userData)]);
  });
});

describe('api/users/known tests', () => {
  const mongod = new MongodbMemoryServer();

  beforeAll(async () => {
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    await User.remove({});
  });

  it('should get user known', async () => {
    const user1 = new User({
      name:'Nombre1',
      nickName: 'Nickname',
      age: 28,
      email: 'mail1@mail.com',
      known: [],
      healthy: true
    })
    const user_saved = await user1.save();

    const getResponse = await request(app).get('/api/users/known/' + user_saved.id);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.length).toBe(0);
  });
});
