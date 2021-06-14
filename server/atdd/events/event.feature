 
Feature: Eventos
	Creacion de eventos en CoCo

  Scenario: [1.0] Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario
    Given que existe el usuario "Santiago"
    When hago un POST al endpoint "/api/events/" con horario desde:"400" hasta:"480", fecha:"2021-10-10" y lugar:"Plaza"
    Then un evento para el usuario es creado


  Scenario: [2.0] Como cliente(app) quiero enviar una peticion GET y obtener eventos para un usuario
    Given que existe el usuario "Santiago"
    And existe un evento en el que participa
    And existe un evento que organiza
    When se pidan sus eventos (GET "/api/events/attended/")
    Then se devuelve lista de eventos

  Scenario: [7.0] Cancelar evento sin participantes (salvo el creador)
    Given que existe el usuario "Juan"
    And existe un evento que organiza
    When se cancela el evento (DELETE "/api/events/cancel_event/")
    Then el evento se elimina de la BD

  Scenario: [7.1] Cancelar evento con participantes
    Given que existe el usuario "Pablo"
    And existe un evento que organiza con "Alvaro" y "Esteban" como participantes
    When se cancela el evento (DELETE "/api/events/cancel_event/")
    Then el evento se elimina de la BD
    And se notifica a todos los participantes del evento cancelado