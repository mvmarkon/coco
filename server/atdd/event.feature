 
Feature: Evento
	Creacion de eventos en CoCo

  Scenario: Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario
    Given Que existe el usuario de nombre: Paco de nickname: Paco de 28 años de edad, email: unmail@cualquiera.era
    And conoce al usuario de nombre: Juan de nickname: Juanete, de 30 años de edad, email: otro@mail.mas
    And El usuario de nickname Juanete tiene 0 notificacion/es
    And Existe un protocolo de nombre Fase 3 con hora del dia permitida expresada en minutos desde: 480 y hasta: 1200, lugar permitido: Plaza cantidad maxima de participantes: 10 y una descripcion: Protocolo ATDD
    When Hago un POST al endpoint api/events con los siguientes datos para el evento: nombre: NOMBRE, fecha: 2021-10-10, hora del dia expresada en minutos desde: 400, hasta: 480, lugar: Plaza, descripcion: una descripcion y participante al usuario conocido
    Then Un evento para el usuario con nickname Paco es creado
    And Se genera una notificacion del evento para el usuario con nickname Juanete
