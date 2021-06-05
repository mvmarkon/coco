Feature: Agregar conocido

  Background: Un usuario que agrege a un conocido
            Given Tengo un usuario   

Scenario: Agregando un usuario que no tengo como conocido
    Given Tengo un usuario al que quiero agregar como conocido
    When Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar
    Then El usuario se agrega a mis conocidos

# Scenario: Agregando un usuario que ya tengo como conocido
#     Given Tengo un usuario al que quiero agregar como conocido
#     And El usuario a agregar ya lo tengo como conocido
#     When Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar
#     Then Recibo un error del servidor    