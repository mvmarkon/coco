 
Feature: Eventos
	Creacion de eventos en CoCo

  Scenario: Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario
    Given Que existe el usuario "Santiago"
    When Hago un POST al endpoint api/events con horario desde:"400" hasta:"480", fecha:"2021-10-10" y lugar:"Plaza"
    Then Un evento para el usuario es creado
