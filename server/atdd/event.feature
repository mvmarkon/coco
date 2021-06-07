 
Feature: Evento
	Creacion de eventos en CoCo

  Scenario: Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario
    Given Que existe el usuario con el que quiero crear el evento
    And El usuario tiene conocidos
    And Existe un protocolo activo
    When Hago un POST al endpoint api/events con los datos para el evento
    Then Un evento para el usuario es creado
    And Se genera una notificacion para cada conocido que se agrego en el evento