import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Event from '../../events/event.model';
import User from '../../users/user.model';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./server/atdd/events/event.feature');

defineFeature(feature, (test) => {
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
		await User.remove({});
	});
	var savedUser;

	const givenUserExists = (given) => {
		given(/^que existe el usuario "(.*)"$/, async (user) => {
			var userData = {
				name: user,
				nickName: user,
				age: 28,
				email: 'mail1@mail.com',
			}
			savedUser = await User.create(userData);
			const getResponse = await request(app).get('/api/users/' + savedUser._id);
			expect(getResponse.status).toBe(200);
			expect(JSON.stringify(getResponse.body._id)).toContain(savedUser._id);
		});
	};

	test('Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario', ({ given, when, then }) => {

		givenUserExists(given);

		when(/^hago un POST al endpoint "(.*)" con horario desde:"(.*)" hasta:"(.*)", fecha:"(.*)" y lugar:"(.*)"$/, async (url, desde, hasta, fecha, lugar) => {
			var eventData = {
				eventName: 'evento atdd',
				date: fecha,
				hourFrom: desde,
				hourTo: hasta,
				place: lugar,
				organizer: savedUser._id,
				description: 'Evento ATDD',
			}
			console.log(url)
			const cerateEvent = await request(app).post(url).send(eventData);
			expect(cerateEvent.status).toBe(200);
			expect(cerateEvent.body._id).toBeDefined();
		});

		then('un evento para el usuario es creado', async () => {
			const getUserEvents = await request(app).get('/api/events/organizer/' + savedUser._id);
			expect(getUserEvents.status).toBe(200);
			expect(getUserEvents.body.length).toBe(1);
		});
	});

	test('Como cliente(app) quiero enviar una peticion GET y obtener eventos para un usuario', ({ given, and, when, then }) => {
	  var getEventsattended;
		givenUserExists(given);
		and('tiene 2 eventos uno que participa y otro que organiza', async () => {
			var ev1 = await Event.create({
				eventName: "evento como participante",
				date: '2030-10-10',
				hourFrom: 800,
				hourTo: 1000,
				place: 'Plaza',
				organizer: mongoose.Types.ObjectId()
			});
			ev1.addParticipant(savedUser._id)
			var ev2 = await Event.create({
				eventName: "evento como organizador",
				date: '2030-10-10',
				hourFrom: 800,
				hourTo: 1000,
				place: 'Plaza',
				organizer: savedUser._id
			})
		});
		when(/^se pidan sus eventos \(GET "(.*)"\)$/, async (url) => {
			getEventsattended = await request(app).get(url + savedUser._id);
		});

		then('se devuelve lista de eventos', async () => {
			expect(getEventsattended.status).toBe(200);
			expect(getEventsattended.body.length).toBe(2);
		});
	});
});