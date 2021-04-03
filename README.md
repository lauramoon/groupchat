## Group Chat

Simple group chat app.

The basic funcitonality was provided; I have added all the special commands.

### Getting Started

To set up locally, clone repo and run `npm install`. Start the server with `node server.js`.

Go to http://localhost:3000/room-name, where room-name can be whatever room you want. Open another tab with the same room name, and you can chat between the browser tabs.

It does not currently work with Firefox.

### Special Commands

`/joke`: server tells you a joke. No one else in the room sees it.

`/members`: you see list of names of users in the room.

`/priv user message`: sends message to named user only.

`/name newName`: changes user's name to newName.