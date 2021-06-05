import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./server/pruebasCucumber/usuario_esta_registrado.feature');


function  estaRegistrado (usermail) {
   return  (usermail === "ale@gmail.com")
   }


defineFeature(feature, (test) => {
  let password = "ale@gmail.com"
  let actual = false;

  beforeEach(() => {
    password = "ale@gmail.com"
  });

  test('El usuario con mail ale@gmail.com esta registrado', ({ given, when, then }) => {
    given('Una base de datos con el usuario con mail ale@gmail.com registrado', () => {
      password = "ale@gmail.com";
    });

    when(/^El usuario se loguea con mail "(.*)"$/, (entermail) => {
      actual = estaRegistrado (entermail)
    });

    then('Deberia informar con OK 200', () => {
      expect(actual).toBe(true);
    });
  });
});