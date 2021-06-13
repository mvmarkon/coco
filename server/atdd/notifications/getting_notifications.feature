Feature: Obtener notificaciones

Scenario: Obtener notificaciones de un usuario
Given Existe un usuario y tiene una notificación
When se envia una peticion GET api/notifications/:id 
Then se obtiene la notificacion
