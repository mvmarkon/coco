import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Protocol from './protocol.model';

const protocolData = {
	allowedHourFrom: 480, //Serian las 8 hs
	allowedHourTo: 1200, // Serian las 20 hs
  allowedPlaces: ['Lugares abiertos'],
	maxPeopleAllowed: 10
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
		expect(saved.allowedHourFrom).toBe(protocolData.allowedHourFrom);
		expect(saved.allowedHourTo).toBe(protocolData.allowedHourTo);
		expect(saved.allowedPlaces[0]).toBe(protocolData.allowedPlaces[0]);
		expect(saved.maxPeopleAllowed).toBe(protocolData.maxPeopleAllowed)
	});
});