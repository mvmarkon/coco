 
Feature: Notificacion de contacto cercano
	Creacion de notificaciones en CoCo

  Scenario: Como cliente(app) quiero enviar una peticion POST 
            y notificar a usuarios con los que estuve en contacto estrecho  
    Given Que existe el usuario con el que quiero notificar el posible covid
    And El usuario tiene conocidos
    When Hago un POST al endpoint api/notifications/close_contact con los datos requeridos
    Then Se genera una notificacion para cada conocido con el cual estuve en contacto