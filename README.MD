# Simple nodejs express server with jest test cases

1. Requires node.js to be installed on your local machine.
2. A terminal to run run the npm scripts. (Like the terminal in vscode).
3. Postman if want to test the endpoints manually.
There is a employee project.postman_collection.json file which<br>
you can import as a collection into postman. 
4. Sign up for a free mongodb account on https://www.mongodb.com/<br>
After siging up:<br>
&emsp;>Create a collection, create a database user and allow your ip address on the network access<br>
&emsp;>rename .env copy to .env. in it, replace MONGODB_URL with the url which you can get from:<br>
&emsp;&emsp;click on Database -> connect -> connect your application -> copy the url there.

## To run employee project

npm install

npm run server // To start the web server locally on port 8080

npm run test:unit // To perform unit tests

npm run test:integration //To perform integration tests

npm run test:coverage //To run unit tests with code coverage

npm run test:mutation //To run mutation tests
