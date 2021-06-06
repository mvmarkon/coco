import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import User from '../users/user.model';

import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./server/pruebasCucumber/conocidos_de_Usuarios.feature');


defineFeature(feature, (test) => {
   let actual = 0;
   let expected = 0;
   let userId = mongoose.Types.ObjectId()

  beforeEach(() => {
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


  });

  test('Un usuario sin concocidos, al consultar todos sus conocidos, la cantidad de conocidos es 0', ({ given, when, then }) => {
    given(/^Un usuario de name "(.*)" sin conocidos$/, async (userName) => {

      /** Aca debe ir el usuario obtenido por nickname**/
      const user1 = new User({
                name: userName,
                age: 28,
                email: 'mail1@mail.com',
                acquaintances: [],
                healthy: true
              })
               userId = await user1.save().id;
    });

    when('El usuario consulta sus conocidos', async () => {
       const getResponse = await request(app).get('/api/users/acquaintances/' + userId);
       actual =  getResponse.body.length;
    });

    then(/^La cantidad de conocidos deberia ser "(.*)"$/, async (cero) => {
      expected =   cero.parseInt
      expect(actual).toBe(expected);
    });
  });
});