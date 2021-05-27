import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {healthCardTypes} from '../config';
import request from 'supertest';
import app from '../app';
import HealtCard from './healthCard.model';

const srcUser = mongoose.Types.ObjectId();
const affUsr1 = mongoose.Types.ObjectId();
const affUsr2 = mongoose.Types.ObjectId();

const healthCardData = {
	type: healthCardTypes[0],
	sourceUser: srcUser,
	startDate: "2021-05-26",
	affectedUsers: [affUsr1, affUsr2]
}

describe('event model tests', () => {
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
		await HealtCard.deleteMany();
	});

	it('should persist a health card', async () => {
		const newHealthCard = new HealtCard(healthCardData);
		const saved = await newHealthCard.save();
		expect(saved.id).toBeDefined();
		expect(saved.type).toBe(healthCardData.type);
		expect(saved.sourceUser).toBe(healthCardData.sourceUser);
		expect(JSON.stringify(saved.startDate).split('T')[0]).toContain(healthCardData.startDate);
		expect(saved.affectedUsers).toContain(affUsr1);
		expect(saved.affectedUsers).toContain(affUsr2);
		expect(saved.daysPassed).toBeDefined();
		expect(typeof(saved.daysPassed)).toBe('number');
	});

});