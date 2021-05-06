import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Event from './event.model';

const validEventData = {
	eventName: 'primer evento',
	protocols: 'protocolos',
	date: new Date()
}

describe('event model tests', () => {
	const mongod = new MongodbMemoryServer();
	beforeAll(async () => {
		const uri = await mongod.getConnectionString();
		await mongoose.connect(uri, { useNewUrlParser: true });
	});
	afterAll(async (done) => {
		await mongoose.disconnect(done);
		await mongod.stop();
	});
	afterEach(async () => {
		await Event.remove({});
	});

	it('should persist an event', async () => {
		const newEvent = new Event(validEventData);
		const saved = await newEvent.save();
		expect(saved.id).toBeDefined();
		expect(saved.eventName).toBe(validEventData.eventName);
		expect(saved.protocols).toBe(validEventData.protocols);
		expect(saved.date).toBe(validEventData.date);
	});

	it('create event without required fields should fail', async () => {
		const failEvent = new Event({});
		let failed;

		try {
			error = await failEvent.save();
		} catch(error) {
			failed = error;
		}
		expect(failed).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(failed.errors.eventName).toBeDefined();
		expect(failed.errors.date).toBeDefined();
		expect(failed.errors.protocols).toBeDefined();
	});
})