 
Feature: Eventos
	Creacion de eventos en CoCo

  Scenario: Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario
    Given que existe el usuario "Santiago"
    When hago un POST al endpoint "/api/events/" con horario desde:"400" hasta:"480", fecha:"2021-10-10" y lugar:"Plaza"
    Then un evento para el usuario es creado


  Scenario: Como cliente(app) quiero enviar una peticion GET y obtener eventos para un usuario
    Given que existe el usuario "Santiago"
    And tiene 2 eventos uno que participa y otro que organiza
    When se pidan sus eventos (GET "/api/events/attended/")
    Then se devuelve lista de eventos
