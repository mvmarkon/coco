 
Feature: Evento
	Creacion de eventos en CoCo

  Scenario: Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario
    Given Que existe el usuario de nombre: Usuario de nickname: eme de 28 años de edad, email: unmail@cualquiera.era
    And Mariano conoce al usuario de nombre: Juan de nickname: j231, de 30 años de edad, email: otro@mail.mas
    And Juan no tiene ninguna notificacion
    And Existe un protocolo de nombre Fase_3 con minutos del dia permitidos desde: 480 hasta: 1200, lugar permitido: Plaza cantidad maxima de participantes: 10 y una descripcion: Protocolo ATDD
    When Hago un POST al endpoint api/events con los datos para el evento
    Then Un evento para el usuario es creado
    And Se genera una notificacion para cada conocido que se agrego en el evento