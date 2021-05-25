import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../users/user.model';
import Notification from './notification.model';
import Event from '../events/event.model';
import app from '../app';
import request from 'supertest';
import Protocol from '../protocols/protocol.model';

const notificationData = {
	notificationName: 'Notificacion',
	date: new Date(),
	notifier: mongoose.Types.ObjectId(),
	notify_to: [],
	type: 'Evento',
	description: 'Descripcion'
}

const userData = new User({
	name: 'Nombre1',
	nickName: 'Nickname1',
	age: 28,
	email: 'mail1@mail.com',
	acquaintances: [],
	healthy: true
})

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
		await Notification.remove({});
		await User.remove({});
	});

	it('should persist a notification', async () => {
		const newUser = new User(userData);
		const user_saved = await newUser.save();
		const fullNotifData = JSON.parse(JSON.stringify(notificationData));
		fullNotifData.notify_to.push(user_saved._id);
		const newNotification = new Notification(fullNotifData);
		const notificationSaved = await newNotification.save();

		expect(notificationSaved.id).toBeDefined();
		expect(notificationSaved.notified).toBe(false);
	});

	it('should NOT persist a notification', async () => {
		const newNotification = new Notification({});
		let failed;
		try {
			error = await newNotification.save();
		} catch (error) {
			failed = error;
		}
		expect(failed).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(failed.errors.notificationName).toBeDefined();
		expect(failed.errors.date).toBeDefined();
		expect(failed.errors.notifier).toBeDefined();
	});
});

describe('api/notifications tests', () => {
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
		await Notification.remove({});
		await User.remove({});
	});
	
	it('should persist a notification when received a POST request with correct data', async () => {
		const newUser = new User(userData);
		const user_saved = await newUser.save();
		const fullNotifData = JSON.parse(JSON.stringify(notificationData));
		fullNotifData.notify_to.push(user_saved._id);
		const postResponse = await request(app).post('/api/notifications').send(fullNotifData);
		expect(postResponse.status).toBe(201);
		expect(postResponse.body).toBe('OK');
	});

	it('should return all notifications for a user on a GET request received with user id', async () => {
		const newUser = new User(userData);
		const user_saved = await newUser.save();
		const fullNotifData = JSON.parse(JSON.stringify(notificationData));
		fullNotifData.notify_to.push(user_saved._id);
		const newNotification = new Notification(fullNotifData);
		const notificationSaved = await newNotification.save();

		const getResponse = await request(app).get('/api/notifications/' + user_saved.id);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body[0].notificationName).toBe(notificationData.notificationName);
		expect(JSON.stringify(getResponse.body[0].notifier)).toContain(notificationData.notifier);
		expect(getResponse.body[0].notify_to[0]).toBe(user_saved.id);
		expect(getResponse.body[0].description).toBe(notificationData.description);
		expect(JSON.stringify(getResponse.body[0]._id)).toContain(notificationSaved._id);
	});
});

describe('api/notifications/possible_covid tests', () => {
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
		await Notification.remove({});
		await User.remove({});
	});
	
	it('should persist notifications when received a POST request in possible_covid endpoint', async () => {
  	var newUser = new User(userData);
		var user_saved = await newUser.save();

		var part1 = mongoose.Types.ObjectId();
		var part2 = mongoose.Types.ObjectId();

		var prot = new Protocol({
			name: 'Protocolo test',
			allowedHourFrom: 480, //Serian las 8 hs
			allowedHourTo: 1200, // Serian las 20 hs
			allowedPlaces: [{"Plaza": 10}],
			possibleCovidDays: 2,
			description: 'Descripción testposible covid'
		});

		const active_prot = await prot.save();
		let evtData = new Event({
			eventName: 'test evento posible covid',
			date: "2021-05-24",
			hourFrom: 1000,
			hourTo: 1060,
			place: { name: "Plaza", numberParticipants: 10 },
			participants: [part1, part2],
			organizer: user_saved._id,
			description: 'test posible covid'
		});
		const createEvent = new Event(evtData);
		const evt = await createEvent.save();
	
		const fullNotifData = JSON.parse(JSON.stringify(notificationData));
		var notifications = await Notification.find({});
		expect(notifications.length).toBe(0);
		fullNotifData.notify_to.push(user_saved._id);
		const postResponse = await request(app).post('/api/notifications/possible_covid/').send(fullNotifData);
		console.log(postResponse.body);
		expect(postResponse.status).toBe(201);
		expect(postResponse.body).toBe('OK');
		notifications = await Notification.find();
		expect(notifications.length).toBe(1);

	});
});