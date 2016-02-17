Feature: profile

As a user
I want to enter my name
I want to upload my photo

Background:
  Given I am a user
  
Scenario: Visit the profile page
  When I navigate to '/profile'
  Then I should see a input box to enter my name
  