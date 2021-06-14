Feature: Eliminar conocido

Scenario: Eliminando un usuario que tengo como conocido
     Given Dado un usuario que tiene a otro usuario como conocido  
     When Envio una peticion PUT al endpoint api/users/delete_known_to con el id del usuario que quiero eliminar
     Then El usuario elimina al conocido 

Scenario: Eliminando un usuario que no tengo como conocido
     Given Tengo un usuario sin conocidos   
     When Envio una peticion PUT al endpoint api/users/delete_known_to con el id del usuario que quiero eliminar
     Then El usuario recibe un error del servidor 
