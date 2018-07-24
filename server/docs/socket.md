## Socket
By socket connection the client can receive real time changes to the server state. All REST API calls that modifies the data (`POST`, `PUT`, `DELETE`) will trigger the back end store to emit the new state to the socket `state` channel. See examples below.

```js
var socket = io.connect('http://localhost:9000');

socket.on('state', function(data) {
    console.log(data); // Batched messages
});
```
(`data` will be the same as from [Get batched messages](/docs/api#get-batched-messages) from the REST API)
