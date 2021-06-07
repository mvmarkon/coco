import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Event from '../events/event.model';
import User from '../users/user.model';
import Protocol from '../protocols/protocol.model';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./server/atdd/event.feature');


defineFeature(feature, (test) => {
	const mongod = new MongodbMemoryServer();
	var userData, user, savedUser, known;	
	var acquaintances = [];
	var users = [
		{
			name: 'conocido1',
			nickName: 'con1',
			age: 28,
			email: 'conocido1@mail.com',
			healthy: true
		},{
			name: 'conocido2',
			nickName: 'con2',
			age: 26,
			email: 'conocido2@mail.com',
			healthy: true
		},{
			name: 'conocido3',
			nickName: 'con3',
			age: 23,
			email: 'conocido3@mail.com',
			healthy: true
		}
	]

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
		await Event.deleteMany({});
		await User.deleteMany({});
		await Protocol.deleteMany({});
	});

  test('Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario', ({ given, and, when, then }) => {
		given(/^Que existe el usuario de nombre: (\w+) de nickname: (\w+) de (\d+) años de edad, email: ([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, async (name, nick, age, email) => {
			// const con1 = new User(users[0]);
			// const s1 = await con1.save();
			// acquaintances.push(s1._id)
			// const con2 = new User(users[1]);
			// const s2 = await con2.save();
			// acquaintances.push(s2._id)
			// const con3 = new User(users[2]);
			// const s3 = await con3.save();
			// acquaintances.push(s3._id)
			userData = {
				name: name,
				nickName: nick,
				age: age,
				email: email,
			}
			// const getResponse = await request(app).get('/api/users/' + savedUser._id);
			// expect(getResponse.status).toBe(200);
			// expect(JSON.stringify(getResponse.body._id)).toContain(savedUser._id);
		});
		and(/^Mariano conoce al usuario de nombre: (\w+) de nickname: (\w+), de (\d+) años de edad, email: ([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, async (name, nick, age, email) => {
			var knownUser = {
				name: name,
				nickName: nick,
				age: age,
				email: email
			}
			known = await new User(knownUser);
			var savedKnown = await known.save();
			userData['acquaintances'] = [savedKnown._id];
			user = await new User(userData);
			savedUser = await user.save();
			
			const getacquaintances = await request(app).get('/api/users/acquaintances/'+savedUser._id);
			expect(getacquaintances.status).toBe(200);
			expect(getacquaintances.body.length).toEqual(1);
			expect(getacquaintances.body[0]).toBe(savedKnown._id.toString())
		});

		and(/^(\w+) $/, )

		and(/^Existe un protocolo de nombre (\w+) con hora del dia permitida expresada en minutos desde: 480 y hasta: (\d+), lugar permitido: (\w+) cantidad maxima de participantes: (\d+) y una descripcion: \w+( \w+)*$/, async (pname, minFrom, minTo, place, maxParticipants, description) => {
			var protocolData = {
				name: pname,
				allowedHourFrom: minFrom,
				allowedHourTo: minTo,
				allowedPlaces: [{place: maxParticipants}],
				description: description
			}
			const newProtocol = new Protocol(protocolData);
			const activeProtocol = await newProtocol.save();
			const getActiceProtocol = await request(app).get('/api/protocols/active');
			expect(getActiceProtocol.status).toBe(200);
			expect(getActiceProtocol.body.active).toBeTruthy();
		});

		when(/^Hago un POST al endpoint api\/events con los siguientes datos para el evento: nombre: (\w+( \w+)*), fecha: (19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]), hora del dia expresada en minutos desde: (\d+), hasta: (\d+), lugar: (\w+), descripcion: \w+( \w+)*$/, async (eName, ) => {
			var validEventData = {
				eventName: 'primer evento',
				date: '2022-05-17',
				hourFrom:500,
				hourTo: 1000,
				place:'Plaza',
				description: 'Evento ATDD',
			};
			validEventData['participants'] = [savedUser.acquaintances[1], savedUser.acquaintances[0]]
			validEventData['organizer'] = savedUser._id
			const cerateEvent = await request(app).post('/api/events').send(validEventData);
			expect(cerateEvent.status).toBe(200);
			expect(cerateEvent.body._id).toBeDefined();
		});

		then('Un evento para el usuario es creado', async() => {
			const getUserEvents = await request(app).get('/api/events/organizer/' + savedUser._id);
			expect(getUserEvents.status).toBe(200);
			expect(getUserEvents.body.length).toBe(1);
		});

		and('Se genera una notificacion para cada conocido que se agrego en el evento', async () => {
			const notif0 = await request(app).get('/api/notifications/'+savedUser.acquaintances[0]);
			expect(notif0.status).toBe(200);
			expect(JSON.stringify(notif0.body[0].notifier)).toContain(savedUser._id);
			const notif1 = await request(app).get('/api/notifications/'+savedUser.acquaintances[1]);
			expect(notif1.status).toBe(200);
			expect(JSON.stringify(notif1.body[0].notifier)).toContain(savedUser._id);

			const notif2 = await request(app).get('/api/notifications/'+savedUser.acquaintances[2]);
			expect(notif2.status).toBe(200);
			expect(notif2.body.length).toBe(0);
		});
  });
});