Feature: Test checklists

Scenario: Create checklist with valid data
    When User send request to create checklist from file 'create_checklist.json'
    Then Status code is equal 200
    And Values 'checklist', 'task_id' in body are equal '86bzk96mf'
    And Value 'checklist', 'name' in body is equal to alias '@generatedName'

Scenario: Create list with existing name
    When User send request to create checklist with existing name from file 'create_checklist.json'
    Then Status code is equal 200

Scenario: User unable to post checklist with invalid API key
    When User send checklist request 'POST' with invalid token
    Then Status code is equal 401
    And Value 'err' in body is equal 'Oauth token not found'

Scenario: User unable to create list with invalid task id
    When User send request 'POST' with invalid task id
    Then Status code is equal 401
    And Value 'err' in body is equal 'Team not authorized'
    
Scenario: User is unable create checklist with invalid data
    When User send request to create checklist from file 'create_checklist_invalid.json'
    Then Status code is equal 200
    And Values 'checklist', 'name' in body are equal to 'null'


Scenario: Update checklist with valid data
    When User send request to create checklist from file 'create_checklist.json'
    And User get 'checklist.id' from body and save as 'checklistId'
    And User send request to update checklist from file 'create_checklist.json'
    Then Status code is equal 200
    And Values 'checklist', 'task_id' in body are equal '86bzk96mf'
    And Value 'checklist', 'name' in body is equal to alias '@updatedName'

Scenario: Update checklist with invalid data (no changes)
    When User send request to update checklist from file 'create_checklist_invalid.json'
    Then Status code is equal 400
    And Value 'err' in body is equal 'No changes made to checklist'

Scenario: Delete checklist
    When User send request to delete checklist with valid data
    Then Status code is equal 200
    And Response Body should be Empty

Scenario: Delete checklist that is already deleted
    When User send request to delete checklist with valid data
    Then Status code is equal 200
    And Response Body should be Empty

    Scenario: User unable to delete checklist with invalid data
    When User send request to delete checklist with invalid data
    Then Status code is equal 500
    And Value 'err' in body is equal 'invalid input syntax for type uuid: "^"'