# NoteReminder
A NodeJS application that is used to create and manage simple reminder notes.  The user can create/edit/delete a note and set a reminder date.  NoteReminder will send out an email on the date the user chooses.

## Installation
1) Clone the repository
2) Create a config.js file in the root of the application and add the following code
    ```
    var config = {
    host: 'smtp.youremailserver.com',
    port: 26,
    user: 'youremailname@youremailserver.com',
    pw: 'Your_Password123!@'
    };

    module.exports = config;
    ```
3) Run, Forrest, Run!

## Usage
### Entering a new reminder:
1) Enter a subject for the reminder
2) Type a detailed description for the reminder in the body
3) [Optional] Select a date to be reminded
4) Click "Submit" to save the reminder
5) Click "Cancel" to clear the form

### Updating an existing reminder:
1) Click on a note in the left-hand column
2) Modify the title, body, or reminder date
3) Click "Submit" to save the changes
4) Click "Cancel" to clear the form and return to the main view

### Deleting an existing reminder
1) Click on the trash can icon next to the reminder subject in the left-hand column


## Packages Used
* body-parser
* eslint
* express
* mongojs
* morgan
* node-schedule
* nodemailer

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History
Created 9/3/2017

## Credits
Sherman Gore