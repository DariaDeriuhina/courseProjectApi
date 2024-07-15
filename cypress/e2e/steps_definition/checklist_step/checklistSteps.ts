import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import {config} from '@config/config';

const BASE_URL = Cypress.env('base_url') as string;
const CHECKLIST_URL = config.url.checklist.checklist_url

When('User send request {string} with invalid task id', (value: string) => {
  cy.sentRequest(value, `${BASE_URL}/task/7^/checklist`);
})

When('User send checklist request {string} with invalid token', (type: string) => {
  cy.sendRequestWithInvalidToken(type, `${BASE_URL}/${CHECKLIST_URL}`);
})

When('User send request to create checklist from file {string}', (filename: string) => {
  cy.fixture(filename).then((body) => {
    const randomString = Math.random().toString(36).substring(2, 15);
        
    if (body.name) {
      const generatedName = `my name ${randomString}`;
      body.name = generatedName;
      cy.wrap(generatedName).as('generatedName');
    }

    cy.sentRequest('POST', `${BASE_URL}/${CHECKLIST_URL}`, body).then((response) => {
      // Сохраняем `id` в глобальную переменную
      Cypress.env('checklistId', response.checklist.id);
      Cypress.env('checklistName', response.checklist.name);
    });
  });
});


When('User send request to update checklist from file {string}', (filename:string) => {
  cy.fixture(filename).then((body) =>{

    if(body.name){
    const randomString = Math.random().toString(36).substring(2, 15);
        
    const generatedName = `my updated name ${randomString}`;

    body.name = generatedName;

    cy.wrap(generatedName).as('updatedName');
    }

    const checklistId = Cypress.env('checklistId')
  
    cy.sentRequest('PUT', `${BASE_URL}/checklist/${checklistId}`, body)
  })
});

When('User send request to delete checklist with valid data', () => {
  const checklistId = Cypress.env('checklistId')
  cy.sentRequest('DELETE', `${BASE_URL}/checklist/${checklistId}`);
})

When('User send request to delete checklist with invalid data', () => {
  cy.sentRequest('DELETE', `${BASE_URL}/checklist/^`);
})

When('User send request to create checklist with existing name from file {string}', (filename:string) => {
  cy.fixture(filename).then((body) => {
    body.name=Cypress.env('checklistName')
  cy.sentRequest('POST', `${BASE_URL}/${CHECKLIST_URL}`, body);
})
})

When('Value {string}, {string} in body is equal to alias {string}', (value1: string, value2: string, alias: string) => {
  cy.get('@obtainedResponse').then((resp) => {
    cy.get(alias).then((generatedName) => {
      expect(resp[value1][value2]).to.eq(generatedName);
    });
  });
});

Then('Values {string}, {string} in body are equal to {string}', (value1: string, value2: string, expected: string) => {
  cy.get<Cypress.Response<Body>>('@obtainedResponse').then((resp: Cypress.Response<Body>) => {
    let value: object = resp[value1];
    expect(value[value2]).to.eq(expected === 'null' ? null : expected);
  });
});
 
