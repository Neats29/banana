Feature: profile

As a user
I want to enter my firstname
I want to enter my lastname
I want to enter my email
I want to enter my phonenumber
I want to enter my skills
I want to upload my photo
  
Scenario: Visit the profile page
  When I navigate to '/profile'
  Then I should arrive at the profile page
  
Background:
  Given I am on the profile page
  
Scenario:
  Then I should see inputs to enter my details
  When I enter my details
  And I click the save button
  Then my details should be saved to the server
  And I should be taken to '/profile/view'  