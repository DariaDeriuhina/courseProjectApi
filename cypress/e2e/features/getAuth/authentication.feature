@api
Feature: Authentication

  Scenario: Get user info
    When GET USER info
    Then Status code is equal 200
    And Values 'user', 'username' in body are equal 'Daria Deriuhina'

  Scenario: Create folder
    When Sent POST request to Create Folder from file 'folders/create_folder.json'
    Then Status code is equal 201

  Scenario Outline:  Create folders
    When Sent POST request to Create Folder from file <file>
    Then Status code is equal <status_code>
    Example: 
    |file                      |  status_code|
    |folders/create_folder.json|   200 | 
    |folders/create_invalid_folder.json|   400 | 
    |folders/create_fodijocdiolder.json|   401 | 