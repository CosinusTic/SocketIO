#Project Name: CHAT GPT

## Authors
- Antoine Duchesne: antoine.duchesne@epitech.eu
- Nathan Delmarche: nathan1.delmarche@epitech.eu
- Armel de Marsac: armel.tandeaudemarsac@epitech.eu

## Description
Internet chat relay based on the design pattern of Chat GPT. This project uses socket.io to handle broadcast requests for an interactive live chat. 
Technologically, the frontend runs with the ReactJS library, and the backend uses ExpressJS alongisde the mongoose ORM. 

### Launching the project
After cloning the project repository, navigate to the root directory of the backend server (/backend) and execute `npm i`. Make sure that the repository **node_modules** has correctly popped 
and that a **package-lock.json** file was created too.

Once done, run `nodemon <(optional> server.js>` in the root directory of the folder.

Once the backend server is up, navigate to the frontend root folder (/frontend) and execute `nmp i` and `npm start` after making sure **node_modules** and **package-lock.json** are created. 

PORTS: The backend server runs on port 3000 and the frontend server runs on 3001. 
