Feature: Obtener los conocidos de un usuario

Scenario: Un usuario sin concocidos, al consultar todos sus conocidos, la cantidad de conocidos es 0
    Given Un usuario de name "Elon Musk" sin conocidos
    When El usuario consulta sus conocidos
    Then La cantidad de conocidos deberia ser "0"