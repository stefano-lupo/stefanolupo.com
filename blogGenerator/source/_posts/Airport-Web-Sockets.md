---
title: WebSocket Chat Room
layout: page
categories: Web Programming
date: 2017-09-19 14:37:15
tags: WebSockets Node Javascript SSH Raspberry Pi
photos:
---
![Websocket Chat Room](https://s3-eu-west-1.amazonaws.com/stefano-lupo-blog-photos/websocket-chat-server/chatroom.png)
So I was just about to board my flight to Amsterdam when we were informed that the flight was to be delayed by three hours (guess what airline I was flying with..). I started thinking of things to do to kill the time, but had decided not to bring my laptop with me. Fortunately however I have my router port forwarded so I have ssh access to my Raspberry Pi (which I leave on 24/7 since it uses a whole 1.2 Watts) from anywhere I have an internet connection. So I pulled out my phone and fired up JuiceSSH and started thinking what I could do..

## What Are WebSockets?
I had done some socket programming before (mainly writing a simple HTTP/HTTPS Proxy Server in Java  - [GitHub Repo](https://github.com/stefano-lupo/Java-Proxy-Server)) but I had heard the buzz word *WebSockets* being thrown around a lot lately so I decided to check it out. I had a rough idea of what to expect but a quick google gave me a nice succint description: 

> "WebSockets represent a long awaited evolution in client/server web technology. They allow a long-held single TCP socket connection to be established between the client and server which allows for bi-directional, full duplex, messages to be instantly distributed with little overhead resulting in a very low latency connection." - *from [pusher.com](https://pusher.com/websockets)*

The first things that come to mind when reading that description are real-time applications such as video games and chat. Since I only had two hours (and was developing over SSH on my phone), I decided on the latter. Another quick google search provided a [great blog post](http://codular.com/node-web-sockets) on setting up a simple chat server with WebSockets.

## Getting the Required Tools 
The first thing to do was to obtain a WebSocket library for node. There are a bunch of WebSocket implementations and im sure most are great, but the I went for was *websocket-node*. The first thing to do was to make a directory to hold my project. As I knew there would be server side and client side code, I made two seperate directories - *public* for client side code and *server* for server side code.

A quick note here - as we need to serve up the client side code (through a browser in my case), we need some extra functionality to do this for us. As I am a web developer I already had the LAMP stack set up on my machines at home ([this is a great article](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-16-04) on how to set this up if you haven't already). The LAMP stack is an extremely common and easy way to serve up static websites and is most likely what was used if you have ever paid for web hosting. Another great option if you would like to stick with Node is Express. I probably would have went with this had I not already had a way to serve web pages set up. 

I set up a new virtual host for my WebSocket chat server ([see here](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts)) and proceeded to create the directories to hold my chat server.

```bash
# Note you may need sudo here depending on how you have set up your permissions
$ mkdir /var/www/websockets/public /var/www/websockets/server -p
```

The *-p* flag for mkdir is a handy one which will create any directories that do not exist along the way, saving you from typing multiple mkdir commands. 

Next I created a package.json file in my server directory (as this will be written in node, but the client side code will not).

```bash
$ cd /var/www/websockets/server
$ npm init
```
Follow along in the initialization process to create your *package.json* file (although what you actually type has little importance). Finally install *websocket-node* using the following: 

```bash
# Again, either use sudo, or chown the websockets directory
$ npm install websocket --save
```

# Creating the WebSocket Chat Server
## Server Side Code
Finally it was time to write some code. I decided to work on the server side code first. The first step is to set up a standard Node HTTP server.
```js
var http = require('http');
var server = http.createServer(function (request, response) {});
```

Next we need to specify a free port on which the server can listen. I picked 3000 as I had already portforwarded that port to my Raspberry Pi on my router. Portforwarding allows your router to forward incoming packets at the specified port, to a specified machine on your local network. It looks something like this:

***http://<Router's IP>:3000    --->    Router    --->    Server on Raspberry Pi Listening on port 3000***

Since I had port forwarded port 3000 to point to my Raspberry Pi, the router then forwards those packets onto my Raspberry Pi allowing my server to be connected to from outside of my local network.

So telling our HTTP server to listen on port 3000:
```js
server.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
```

Next we can create a WebSocket Server and connect it up to our HTTP server by passing the HTTP server to the constructor. This `WebSocket` is what gives us our long held client-server connection, as opposed to standard HTTP which requires a fresh HTTP request everytime we wish to update.

```js
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({ httpServer: server });
```

Next we need some way of keeping track of our clients and the messages that have been sent. As I was just doing this for fun I didn't implement anything fancy for storing the messages (no not even file IO - but I was doing this from my phone after all...). I ended up just storing the messages in an array which obviously isn't a good idea, but it works in the short term.

So we need three variables, one to use as clients IDs, a Map to hold our clients which can be indexed by the ID and an array of sent messages.

```js
var id = 0;
var clients = new Map();
var messages = [];
```

Next we define the callback to executed when a client attempts to connect to the server. Upon receiving a request, we have the option to accept or reject the client. All are welcome on my chat server so I just accepted any incoming connections. I assign the new client the next ID and increment the ID so it's ready for the next client, add the client to our clients Map and log out a small message to the terminal so we can see when clients have joined. Finally we will send all the old messages to the newly connected client. Note that the sendUTF method obviously only works with strings, but since were using JSON, a simple `JSON.stringify()` takes care of that and the data can be recovered using `JSON.parse()` on the other side.

```js
wsServer.on('request', function (request) {
    // Envoked when client connects, send them all previous messages
    var connection = request.accept('echo-protocol', request.origin);
    connection.id = id++;
    clients.set(id, connection);
    console.log((new Date()) + ' Connection accepted [' + connection.id + ']');

    // Send old messages to client
    connection.sendUTF(JSON.stringify(messages));

    // More code to go here soon..
});
```

Finally we need to define a couple more callbacks for when a client sends a message (or rather, when the server receives a message) and when the client disconnects. WebSockets make this really simple with the `on('message', callback)` and `on('close', callback)` respectively. Upon (the server) receiving a message, we want to save the message and broadcast that message to all connected clients. Ideally, we wouldn't send this back to client who sent it and just update the sender's client side messages, but as this was just a quick implementation, I went with the simpler route of just having the message broadcast to and picked up by all clients (including the sender). 

Finally when a client disconnects, we free up the resources they were using and remove them from our clients Map so that we don't try to send any more messages to that connection. This is why we used a Map, so that the client with the appropriate ID can be deleted.

```js
wsServer.on('request', function (request) {
    // ....Previous code

    // Envoked when a message is sent
    connection.on('message', function (message) {
        var msgString = message.utf8Data;
        messages.push(msgString);
        sendToAllClients(msgString);
    });

    // Envoked when client disconnects
    connection.on('close', function (reasonCode, description) {
        clients.delete(connection.id);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
```

The last thing to do on the server side code is to define our `sendToAllClients(message)` function. Since we have a Map containing all of our clients and a function `sendUTF(message)` to send a message to a client, this is really simple.

```js
// Note this is outside of the on request received function body
function sendToAllClients(message) {
    clients.forEach(function(client) {
        client.sendUTF(message);
    });
}
```

## Client Side Code
Now that the server is all set up its time to create the web page for the chat room. I wrote this using basic HTML, CSS, Bootstrap and jQuery. First head back to the root of our project, cd into our public folder and make two files - *index.html* and *script.js*.

```bash
cd /var/www/websockets/public
touch index.html script.js
```

I started out with the markup to create the interface. It consists of two `<form>`s (one for signing up for the chat room and one for sending messages) and a `<ul>` to which we will programatically add `<li>`s as we receive messages.

```html
<div class="container-fluid">
    <h1 class="text-center">The Worlds Worst Chat Room </h1>
    <hr>

    <h2>Join The Chat Room</h2>
    <form id="join">
        <input required placeholder="Enter your name" id="name" name="name" />
        <input required placeholder="Avatar URL" id="avatar" name="avatar" />
        <button class="btn btn-primary" type="submit" name="join_button" id="join_button">Join</button>
    </form>

    <h1>Chat</h1>
    <div id="chat-div">
        <ul id="chatlog"></ul>
    </div>
  
    <form id="send">
        <textarea rows="4" cols="50" required disabled name="message" id="message" placeholder="Send a message"></textarea>
        <button class="btn btn-danger disabled" type="submit" id="send-button">Send!</button>
    </form>
</div>
```

Finally I added some styling, grabbed CDNs for Bootstrap and jQuery and included our script.js file.
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"/>
<script src="script.js"></script>

<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<style>
    #chat-div {
        border: solid black 1px;
        height:350px; 
        overflow:auto;
        -webkit-box-shadow: 5px 5px 34px -10px rgba(0,0,0,0.75);
        -moz-box-shadow: 5px 5px 34px -10px rgba(0,0,0,0.75);
        box-shadow: 5px 5px 34px -10px rgba(0,0,0,0.75);
    }
    #chatlog {
        list-style-type:none; 
    
    }
    hr {
        margin-top: 5px;
        margin-bottom: 5px;
    }
    h4 {
        display: inline
    }
    #avatar-pic {
        width: 50px;
        border-radius: 50%;
        border: solid rgba(0,0,0,0.6) 1px;
        margin: 5px;
    }
    #date-string {
        text-align: right;
        float:right;
    }
    #message-li {
        padding:5px 0px 5px 0px
    }
</style>
```

The last thing we have to do is to connect up our client side code to our server and set up some logic in jQuery to handle the client joining the chat room and sending messages. Once the client submits the join form, we will save their inputted credentials and connect to the server. This is really easy with WebSockets, simply create a `new WebSocket` instance that points to our server. 

```js
// Ensure document is defined (page is fully loaded)
$(document).ready(function () {
    var ws;
    var name, avatar;

    // Allow the client to join the server 
    $("#join").submit(function( event ) {
        event.preventDefault();

        // Save credentials
        name = $("#name").val();
        avatar = $("#avatar").val();
      
        // Connnect to Server
        ws =  new WebSocket('ws://<server>:<port>', 'echo-protocol');

        // More code to go here..
    });
});
```

We need to define a couple of callbacks in order to get the functionality we want. `onopen` allows us to define a callback function that will be executed when we successfully connect to the server. I wanted to announce when a new client joined the chatroom, so in the body of the `onopen` callback I created a new message object and sent that off to the server. I also enabled the `<textarea>` field which is used for inputing the user's message and the submit `<button>` which is used for sending the message. Until this point they were both disabled as I didn't want users attempting to send messages prior to connecting to the server.

We also need an event listener to handle receiving messages from the server. Once messages are received from the server, we want to create `<li>`s to hold the new messages. For clarity we will define this function later, so the callback just needs to call this function for each new message that is received (or array of messages in the case of the server sending the array of past messages when the client connects).  
```js
$("#join").submit(function( event ) {

    // ...Previous code

    // Send "client" joined chatroom messgae  
    ws.onopen = function() {
        var message = {
            name: name,
            avatar: avatar,
            message: "joined the chatroom.",
            date: new Date()
        }
        ws.send(JSON.stringify(message));

        // Allow client to send messages
        $("#message").prop('disabled', false);
        $("#send-button").removeClass("disabled btn-danger").addClass("btn-success");
    };

    // Add Listener for receiving messages
    ws.addEventListener("message", function (e) {
        var msg = JSON.parse(e.data);

        // Server sends an array of passed messages to client upon joining
        if(Array.isArray(msg)) {
            msg.forEach(function (message) {
                addMessage(JSON.parse(message));   
            });
        } else {
            addMessage(msg);
        }

        // Scroll to bottom of chat div to keep up with current messages
        $('#chat-div').scrollTop($('#chat-div')[0].scrollHeight);
    });
});

```

Next we need a listener for sending messages to the server. This callback simply creates a message obejct, sends it on to the server and and clears the message `<textarea>` in preperation for the next message.

Finally we define the `addMessage(message)` function. We make use of jQuery's `append(markup)` method in order to append a list item to the unordered list which holds our messages. Theres some extra bits and pieces in the markup to display the sender's name, avatar and the timestamp.

```js
// Add listener for sending messages
$("#send").submit(function( event ) {
    event.preventDefault();

    // Package up the message object
    var message = {
        name: name,
        avatar: avatar,
        message: $("#message").val(),
        date: new Date()
    }

    // Clear the message input field once the message has been sent 
    $("#message").val('');

    // Send the message object (serialized as a string)
    ws.send(JSON.stringify(message));
});  

// Some markup for the messages
function addMessage(message) {
    $("#chatlog").append('<li id="message-li">'
        + '<div><img id="avatar-pic" src="'
        + "  " + message.avatar + '">' 
        + "<h4>" + message.name + "</h4>"
        + '<p id="date-string">' + new Date(message.date).toLocaleTimeString() + "</p></div>" 
        + message.message 
        + "<hr>"   
        + "</li>"
    );
}
``` 

# Conclusion
And with that we're all set. Run the server code with `node server/index.js` from the root of our project directory and browse to your IP address (or localhost if you're developing locally) and give it a go!

The full source code is available [here on GitHub](https://github.com/stefano-lupo/websocket-chat-server). Thanks for reading.
 