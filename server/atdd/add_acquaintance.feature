Feature: Agregar conocido

Scenario: Agregando un usuario que no tengo como conocido
    Given Tengo un usuario   
    And Tengo un usuario al que quiero agregar como conocido
    When Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar
    Then El usuario se agrega a mis conocidos

Scenario: Agregando un usuario que ya tengo como conocido
    Given Tengo un usuario al que quiero agregar como conocido
    And Tengo un usuario que ya conoce al usuario que quiero agregar como conocido  
    When Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar
    Then Recibo un error del servidor    