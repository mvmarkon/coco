import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Protocol from './protocol.model';

const protocolData = {
	active: true,
	name: 'Primer protocolo',
	allowedHourFrom: 480, //Serian las 8 hs
	allowedHourTo: 1200, // Serian las 20 hs
  allowedPlaces: [{"Plaza": 10}],
	description: 'Descripción muy descriptiva'
}

describe('protocol model tests', () => {
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
	afterAll(async (done) => {
		await mongoose.disconnect(done);
		await mongod.stop();
	});
	afterEach(async () => {
		await Protocol.remove({});
	});

	it('should persist a protocol', async () => {
		const newProtocol = new Protocol(protocolData);
		const saved = await newProtocol.save();

		expect(saved.id).toBeDefined();
		expect(saved.active).toBe(true);
		expect(saved.name).toBe(protocolData.name);
		expect(saved.allowedHourFrom).toBe(protocolData.allowedHourFrom);
		expect(saved.allowedHourTo).toBe(protocolData.allowedHourTo);
		expect(saved.allowedPlaces[0]).toBe(protocolData.allowedPlaces[0]);
		expect(saved.description).toBe(protocolData.description);
	});
});

describe('api/protocols tests', () => {
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
    await Protocol.remove({});
	});

	it('should get the active protocol', async () => {
		const postResponse = await request(app).post('/api/protocols').send(protocolData);
		expect(postResponse.status).toBe(200);

		const getActive = await request(app).get('/api/protocols/active');
		expect(getActive.body._id).toBe(postResponse.body._id);
		expect(getActive.body.active).toBe(true);
	});

	it('should post and get a protocol', async () => {
    const postResponse = await request(app).post('/api/protocols').send(protocolData);
		expect(postResponse.status).toBe(200);
		expect(postResponse.body._id).toBeDefined();
		expect(postResponse.body.active).toBe(true);
		expect(postResponse.body.name).toEqual(protocolData.name);
		expect(postResponse.body.allowedHourFrom).toBe(protocolData.allowedHourFrom);
		expect(postResponse.body.allowedHourTo).toBe(protocolData.allowedHourTo);
		expect(postResponse.body.allowedPlaces).toStrictEqual(protocolData.allowedPlaces);
		expect(postResponse.body.description).toBe(protocolData.description);

		const getResponse = await request(app).get('/api/protocols');
		expect(getResponse.status).toBe(200);
    expect(getResponse.body[0]).toEqual(postResponse.body);
	});
});