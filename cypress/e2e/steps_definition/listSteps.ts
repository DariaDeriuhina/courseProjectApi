import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import {config} from '@config/config';

const BASE_URL = Cypress.env('base_url') as string;
const LIST_URL = config.url.list.list_url

Given('User is logged in', () => {
  cy.log('User exists')  
})

When('User send request to get all lists', () => {
  cy.sentRequest('GET', `${BASE_URL}/${LIST_URL}`);
})

When('User send request {string} with invalid folder id', (value: string) => {
  cy.sentRequest(value, `${BASE_URL}/folder/7^/list`);
})

When('User send request {string} with invalid token', (type: string) => {
  cy.sendRequestWithInvalidToken(type, `${BASE_URL}/${LIST_URL}`);
})

When('User send request to create list from file {string}', (filename: string) => {
  cy.fixture(filename).then((body) => {
    const randomString = Math.random().toString(36).substring(2, 15);
        
    if (body.name) {
      const generatedName = `my name ${randomString}`;
      body.name = generatedName;
      cy.wrap(generatedName).as('generatedName');
    }

    cy.sentRequest('POST', `${BASE_URL}/${LIST_URL}`, body).then((response) => {
      // Сохраняем `id` в глобальную переменную
      Cypress.env('listId', response.id);
      Cypress.env('listName', response.name);
    });
  });
});


When('User send request to get list', () => {
  cy.get('@listId').then((id) => {
    cy.log(`List ID: ${id}`);

  cy.sentRequest('get', `${BASE_URL}/list/${id}`)
  })
})

When('Value {string} in body is equal to alias {string}', (value: string, alias: string)=>{
cy.get('@obtainedResponse').then((resp) => {
  cy.get(alias).then((generatedName) => {
    expect(resp[value]).to.eq(generatedName);
  })
})
})

When('User send request to update list from file {string}', (filename:string) => {
  cy.fixture(filename).then((body) =>{

    if(body.name){
    const randomString = Math.random().toString(36).substring(2, 15);
        
    const generatedName = `my updated name ${randomString}`;

    body.name = generatedName;

    cy.wrap(generatedName).as('updatedName');
    } else {
      const randomString = new Array(10000).join('a');
      const generatedName = `my updated name ${randomString}`;

    body.name = generatedName;
    }

    const listId = Cypress.env('listId')
  
    cy.sentRequest('PUT', `${BASE_URL}/list/${listId}`, body)
  })
});

When('User send request to delete list with valid data', () => {
  const listId = Cypress.env('listId')
  cy.sentRequest('DELETE', `${BASE_URL}/list/${listId}`);
})

Then('Response Body should be Empty', () => {
  cy.get('@obtainedResponse').then((resp)=> {
    expect(resp).to.be.empty;
  })
})

When('User send request to delete list with invalid data', () => {
  cy.sentRequest('DELETE', `${BASE_URL}/list/^`);
})

When('User send request to create list with existing name from file {string}', (filename:string) => {
  cy.fixture(filename).then((body) => {
    body.name=Cypress.env('listName')
  cy.sentRequest('POST', `${BASE_URL}/${LIST_URL}`, body);
})
})
