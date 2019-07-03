# Blackbaud SKY API Authorization NRP Code

## How to add code

### Understanding the code flow

1. Functions are declared in index.js as http routes
2. When a function is called, the respective authentication and application functions found in the declaration are called and rerouted by /server/routes/index.js
3. Authentication is in /server/routes/auth.js and should not be modified
4. Application code is found in /server/routes/api.js
5. These application functions in /server/routes/api.js are called in the application running code found in /ui/app/main.js which does all the heavy calculations asynchronously
6. All API sudo functions in /server/routes/api.js call meta functions in /server/libs/sky.js that establish communication with the respective server being called
7. Meta functions in /server/libs/sky.js return information to the sudo functions in /server/routes/api.js which returns information to /ui/app/main.js
8. For testing and informational purposes, /ui/app/main.js outputs statistics to /ui/app/main-template.html via global scope object which is also formatted by /ui/app/styles.css

### Adding functions

Start from the end point.

Does the meta function exist? If not, add to /server/libs/sky.js and ensure to add to the function export at the bottom of the file.

Does the sudo function exist? If not, add to /server/routes/api.js and ensure to add to the function export at the bottom of the file. Additionally, add to the main.js route declarations.

Does the operational code exist? If not, simply add to /ui/app/main.js.

Does the correct statistic and test information get outputted? If not, simply add to main-template.html and insure that the information is contained within the scope object.

## Note to Developers

Constituent ID is used in the API and is equivalent to the System ID

Add sky.env to any folder/application you use. sky.env is not included on GitHub for security reasons, but a template is available in the root of the branch.
