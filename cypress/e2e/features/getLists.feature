Feature: Test lists

Scenario: Create list with valid data
    When User send request to create list from file 'create_list.json'
    Then Status code is equal 200
    And Values 'folder', 'id' in body are equal '90153556774'
    And Value 'name' in body is equal to alias '@generatedName'

Scenario: Create list with existing name
    When User send request to create list with existing name from file 'create_list.json'
    Then Status code is equal 400
    And Value 'err' in body is equal 'List name taken'

Scenario: User unable to post list with invalid API key
    When User send request 'POST' with invalid token
    Then Status code is equal 401
    And Value 'err' in body is equal 'Oauth token not found'

Scenario: User unable to create list with invalid Folder Id
    When User send request 'POST' with invalid folder id
    Then Status code is equal 400
    And Value 'err' in body is equal 'Folder ID invalid'
    
Scenario: User is unable create list with invalid data
    When User send request to create list from file 'create_list_invalid.json'
    Then Status code is equal 400
    And Value 'err' in body is equal 'List Name Invalid'


Scenario: Get lists with valid data
    Given User is logged in
    When User send request to get all lists
    Then Status code is equal 200

Scenario: User unable to get lists with invalid API key
    When User send request 'GET' with invalid token
    Then Status code is equal 401
    And Value 'err' in body is equal 'Oauth token not found'

Scenario: User unable to get lists with invalid Folder Id
    When User send request 'GET' with invalid folder id
    Then Status code is equal 400
    And Value 'err' in body is equal 'Folder ID invalid'

Scenario: Get list with valid data
    When User send request to create list from file 'create_list.json'
    And User get 'id' from body and save as 'listId'
    And User send request to get list
    Then Status code is equal 200


Scenario: Update list with valid data
    When User send request to create list from file 'create_list.json'
    And User get 'id' from body and save as 'listId'
    And User send request to update list from file 'create_list.json'
    Then Status code is equal 200
    And Values 'folder', 'id' in body are equal '90153556774'
    And Value 'name' in body is equal to alias '@updatedName'

Scenario: Update list with invalid data
    When User send request to update list from file 'create_list_invalid.json'
    Then Status code is equal 400
    And Value 'err' in body is equal 'List name invalid'

Scenario: Delete list
    When User send request to delete list with valid data
    Then Status code is equal 200
    And Response Body should be Empty

Scenario: Delete list that is already deleted
    When User send request to delete list with valid data
    Then Status code is equal 200
    And Response Body should be Empty

    Scenario: User unable to delete list with invalid data
    When User send request to delete list with invalid data
    Then Status code is equal 400
    And Value 'err' in body is equal 'validateListIDEx List ID invalid'
   
