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
	var savedUser;
	var savedEventOrgannizedByUser;
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

	const givenUserExists = (given, user) => {
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

	const andEventWithCreatedWithUserExists = (and) => {
		and('existe un evento que organiza', async () => {
			savedEventOrgannizedByUser = await Event.create({
				eventName: "evento como organizador",
				date: '2030-10-10',
				hourFrom: 800,
				hourTo: 1000,
				place: 'Plaza',
				organizer: savedUser._id
			})
		});
	}

	test('[1.0] Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario', ({ given, when, then }) => {

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

	test('[2.0] Como cliente(app) quiero enviar una peticion GET y obtener eventos para un usuario', ({ given, and, when, then }) => {
	  var getEventsattended;
		givenUserExists(given);
		and('existe un evento en el que participa', async () => {
			var ev1 = await Event.create({
				eventName: "evento como participante",
				date: '2030-10-10',
				hourFrom: 800,
				hourTo: 1000,
				place: 'Plaza',
				organizer: mongoose.Types.ObjectId()
			});
			ev1.addParticipant(savedUser._id)
		});

		andEventWithCreatedWithUserExists(and);

		when(/^se pidan sus eventos \(GET "(.*)"\)$/, async (url) => {
			getEventsattended = await request(app).get(url + savedUser._id);
		});

		then('se devuelve lista de eventos', async () => {
			expect(getEventsattended.status).toBe(200);
			expect(getEventsattended.body.length).toBe(2);
		});
	});

	test('[7.0] Cancelar evento sin participantes', ({given, and, when, then}) => {
		givenUserExists(given);

		andEventWithCreatedWithUserExists(and);

		when(/^se cancela el evento \(DELETE "(.*)"\)$/, async (url) => {
			const deleted = await request(app).delete(url + savedEventOrgannizedByUser._id);
			expect(deleted.status).toBe(200);
		});

		then('el evento se elimina de la BD', async () => {
			const event = await Event.findById(savedEventOrgannizedByUser._id);
			expect(event).toBeNull();
		});
	});

	test('[7.1] Cancelar evento con participantes', ({given, and, when, then}) => {
		var part1, part2, evt;
		givenUserExists(given);

		and(/^existe un evento que organiza con "(.*)" y "(.*)" como participantes$/, async (usr1, usr2) => {
			part1 = await User.create({
				name: usr1,
				nickName: usr1,
				age: 28,
				email: usr1+'@mail.com',
			})
			part2 = await User.create({
				name: usr2,
				nickName: usr2,
				age: 28,
				email: usr2+'@mail.com',
			})
			evt = await Event.create({
				eventName: "evento con participantes",
				date: '2030-10-10',
				hourFrom: 800,
				hourTo: 1000,
				place: 'Plaza',
				organizer: savedUser._id,
			})
			await evt.addParticipant(part1._id);
			await evt.addParticipant(part2._id);
		});

		when(/^se cancela el evento \(DELETE "(.*)"\)$/, async (url) => {
			const deleted = await request(app).delete(url + evt._id);
			expect(deleted.status).toBe(200);
		});

		then('el evento se elimina de la BD', async () => {
			const event = await Event.findById(evt._id);
			expect(event).toBeNull();
		});

		and('se notifica a todos los participantes del evento cancelado', async () => {
			const notif1 = await request(app).get('/api/notifications/' + part1._id);
			const notif2 = await request(app).get('/api/notifications/' + part2._id);
			expect(notif1.status).toBe(200);
			expect(notif2.status).toBe(200);
			expect(notif1.body[0].notifier).toBe(evt.organizer.toString());
			expect(notif2.body[0].notifier).toBe(evt.organizer.toString());
			expect(notif1.body[0].type).toBe('Evento Cancelado');
			expect(notif2.body[0].type).toBe('Evento Cancelado');
			expect(notif1.body[0].event).toBe(evt._id.toString());
			expect(notif2.body[0].event).toBe(evt._id.toString());
		})
	});
});