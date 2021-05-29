import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Event from './event.model';


const validEventData = {
	eventName: 'primer evento',
	date: "2021-05-17",
	hourFrom: 1000,
	hourTo: 1060,
	place: { name: "Plaza", numberParticipants: 10 },
	organizer: mongoose.Types.ObjectId()
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
		await Event.remove({});
	});

	it('should persist an event', async () => {
		const newEvent = new Event(validEventData);
		const saved = await newEvent.save();
		expect(saved.id).toBeDefined();
		expect(saved.organizer).toBe(validEventData.organizer);
		expect(saved.hourFrom).toBe(validEventData.hourFrom);
		expect(saved.hourTo).toBe(validEventData.hourTo);
		expect(saved.eventName).toBe(validEventData.eventName);
		expect(saved.place).toBe(validEventData.place);
		expect(JSON.stringify(saved.date).split('T')[0]).toContain(validEventData.date);
	});

	it('create event without required fields should fail', async () => {
		const failEvent = new Event({});
		let failed;

		try {
			let error = await failEvent.save();
		} catch (error) {
			failed = error;
		}
		expect(failed).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(failed.errors.eventName).toBeDefined();
		expect(failed.errors.date).toBeDefined();
	});
})

describe('api/events tests', () => {
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
		await Event.remove({});
	});

	it('should post and get an event', async () => {
		const evData = validEventData;
		evData['participants'] = [mongoose.Types.ObjectId()];
		const postResponse = await request(app).post('/api/events').send(evData);
		expect(postResponse.status).toBe(200);
		expect(postResponse.body._id).toBeDefined();
		expect(postResponse.body.eventName).toEqual(validEventData.eventName);
		expect(postResponse.body.place).toBeDefined();
		expect(Date(postResponse.body.date)).toEqual(Date(validEventData.date));

		const participantNotification = await request(app).get('/api/notifications/' + evData['participants'][0])
		expect(participantNotification.body.length).toBe(1);
		expect(JSON.stringify(participantNotification.body[0].notifier)).toContain(validEventData.organizer);
		const getResponse = await request(app).get('/api/events');
		expect(getResponse.status).toBe(200);
		expect(getResponse.body[0]._id).toBe(postResponse.body._id);
	});

	it('should get user events', async () => {
		const user_id = validEventData.organizer;
		const getResponse_one = await request(app).get('/api/events/organizer/' + user_id);

		expect(getResponse_one.status).toBe(200);
		expect(getResponse_one.body.length).toBe(0);

		const createEvent = new Event(validEventData);
		const saved = await createEvent.save();

		const getResponse_two = await request(app).get('/api/events/organizer/' + user_id);
		expect(getResponse_two.status).toBe(200);
		expect(getResponse_two.body.length).toBe(1);
	});
})

describe('api/events/attended tests', () => {
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
		await Event.remove({});
	});

	it('should get zero events that user attended to', async () => {
		const user_id = validEventData.organizer;
		const getResponse_one = await request(app).get('/api/events/attended/' + user_id);

		expect(getResponse_one.status).toBe(200);
		expect(getResponse_one.body.length).toBe(0);
	});

	it('should get one event that user attended to as organizer', async () => {
		const user_id = validEventData.organizer;
		const createEvent = new Event(validEventData);
		const saved = await createEvent.save();

		const getResponse_two = await request(app).get('/api/events/attended/' + user_id);
		expect(getResponse_two.status).toBe(200);
		expect(getResponse_two.body.length).toBe(1);
	});

	it('should get events that user attended to as participant', async () => {
		let otherEvent = validEventData;
		const otherId = mongoose.Types.ObjectId();
		otherEvent.organizer = validEventData.organizer;
		otherEvent['participants'] = [otherId];
		const createEvent2 = new Event(validEventData);
		const savedEv2 = await createEvent2.save();

		const getResponse_three = await request(app).get('/api/events/attended/' + otherId);
		expect(getResponse_three.status).toBe(200);
		expect(getResponse_three.body.length).toBe(1);
		expect(getResponse_three.body[0]._id.toString()).toContain(savedEv2._id)
	});
})