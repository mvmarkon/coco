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
			userData = {
				name: name,
				nickName: nick,
				age: age,
				email: email,
			}
		});
		and(/^conoce al usuario de nombre: (\w+) de nickname: (\w+), de (\d+) años de edad, email: ([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, async (name, nick, age, email) => {
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

		and(/^El usuario de nickname (\w+) tiene (\d+) notificacion\/es$/, async(usr,notifs) =>{
			const conocido = await request(app).get('/api/users/'+usr);
			const notifications = await request(app).get('/api/notifications/' + conocido.body._id)
			expect(notifications.body.length).toEqual(parseInt(notifs));
		});

		and(/^Existe un protocolo de nombre (\w+ \w+) con hora del dia permitida expresada en minutos desde: (\d+) y hasta: (\d+), lugar permitido: (\w+) cantidad maxima de participantes: (\d+) y una descripcion: (\w+( \w+)*)$/, async (pname, minFrom, minTo, place, maxParticipants, description) => {
			var protocolData = {
				name: pname,
				allowedHourFrom: minFrom,
				allowedHourTo: minTo,
				allowedPlaces: [{[place]: maxParticipants}],
				description: description
			}
			const newProtocol = new Protocol(protocolData);
			const activeProtocol = await newProtocol.save();
			const getActiceProtocol = await request(app).get('/api/protocols/active');
			expect(getActiceProtocol.status).toBe(200);
			expect(getActiceProtocol.body.active).toBeTruthy();
		});

		when(/^Hago un POST al endpoint api\/events con los siguientes datos para el evento: nombre: (\w+( \w+)*), fecha: (\d{4}-\d{2}-\d{2}), hora del dia expresada en minutos desde: (\d+), hasta: (\d+), lugar: (\w+), descripcion: (\w+( \w+)*) y participante al usuario conocido$/, async (evname, other, evdate, min_f, min_t, place, evdesc) => {
			var validEventData = {
				eventName: evname,
				date: evdate,
				hourFrom: min_f,
				hourTo: min_t,
				place: place,
				description: evdesc,
				participants: savedUser.acquaintances,
				organizer: savedUser._id
			};
			const cerateEvent = await request(app).post('/api/events').send(validEventData);
			expect(cerateEvent.status).toBe(200);
			expect(cerateEvent.body._id).toBeDefined();
		});

		then(/^Un evento para el usuario con nickname (\w+) es creado$/, async(nick) => {
			const getusr = await request(app).get('/api/users/' + nick);
			const getUserEvents = await request(app).get('/api/events/organizer/' + getusr.body._id);
			expect(getUserEvents.status).toBe(200);
			expect(getUserEvents.body.length).toBe(1);
		});

		and(/^Se genera una notificacion del evento para el usuario con nickname (\w+)$/, async (nick) => {
			const getusr = await request(app).get('/api/users/' + nick);
			const notif0 = await request(app).get('/api/notifications/'+getusr.body._id);
			expect(notif0.status).toBe(200);
			expect(JSON.stringify(notif0.body[0].notifier)).toContain(savedUser._id);
		});
  });
});