Feature: El usuario con mail ale@gmail.com esta registrado

Scenario: El usuario con mail ale@gmail.com esta registrado
    Given Una base de datos con el usuario con mail ale@gmail.com registrado
    When El usuario se loguea con mail "ale@gmail.com"
    Then Deberia informar con OK 200

