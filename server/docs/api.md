## API Endpoints
Here follows a simple documentation for the REST API.

- [Get employee](#get-employee)
- [Get all employees](#get-all-employees)
- [Create employee](#create-employee)
- [Update employee](#update-employee)
- [Remove employee](#remove-employee)
- [Get message](#get-message)
- [Get all messages](#get-all-messages)
- [Get batched messages](#get-batched-messages)
- [Create message](#create-message)
- [Update message](#update-message)
- [Remove message](#remove-message)

---

### Get employee
`GET /api/employee/:eid`

<sub>**PARAMETERS:**</sub>
```yml
eid: Employee ID
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200,
data: {
    "id": String,
    "firstName": String,
    "lastName": String
}

// Error
code: 404
data: "Employee not found"
```


### Get all employees
`GET /api/employees`

<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: [{
    "id": String,
    "firstName": String,
    "lastName": String
}]
```


### Create employee
`POST /api/employee`

<sub>**BODY:**</sub>
```js
{
    "firstName": String,  // Required
    "lastName": String    // Required
}
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: "<employeeId>"

// Error
code: 400
data: "errorMessage"
```


### Update employee
`PUT /api/employee/:eid`

<sub>**PARAMETERS:**</sub>
```yml
eid: Employee ID
```
<sub>**BODY:**</sub>
```js
{
    "firstName": String,  // Required
    "lastName": String    // Required
}
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: "OK"

// Error
code: 404
data: "Employee not found"
```

### Remove employee
`DELETE /api/employee/:eid`

<sub>**PARAMETERS:**</sub>
```yml
eid: Employee ID
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: "OK"

// Error
code: 404
data: "Employee not found"
```

### Get message
`GET /api/message/:mid`

<sub>**PARAMETERS:**</sub>
```yml
mid: Message ID
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: {
    "id": String,
    "employee": String,  // Employee ID
    "message": String,
    "expiresAt": String
}

// Error
code: 404
data: "Message not found"
```


### Get all messages
`GET /api/messages`

<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: [{
    "id": String,
    "employee": String,  // Employee ID
    "message": String,
    "expiresAt": String
}]
```


### Get batched messages 
`GET /api/messages/batched`

<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: [{
    "id": String,
    "firstName": String,
    "lastName": String,
    "messages": [{
        "id": String,
        "employee": String,  // Employee ID
        "message": String,
        "expiresAt": String
    }]
}]
```


### Create message
`POST /api/message`

<sub>**BODY:**</sub>
```js
{
    "employee": String,  // Required (Employee ID)
    "message": String,   // Required
    "expiresAt": String, // Required (format: YYYY-MM-DD)
}
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: "<messageId>"

// Error
code: 400
data: "errorMessage"
```


### Update message
`PUT /api/message/:mid`

<sub>**PARAMETERS:**</sub>
```yml
mid: Message ID
```
<sub>**BODY:**</sub>
```js
{
    "employee": String,  // Required (Employee ID)
    "message": String,   // Required
    "expiresAt": String, // Required (format: YYYY-MM-DD)
}
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: "OK"

// Error
code: 404
data: "Message not found"

code: 400
data: "errorMessage"
```

### Remove message
`DELETE /api/message/:mid`

<sub>**PARAMETERS:**</sub>
```yml
mid: Message ID
```
<sub>**RESPONSE:**</sub>
```js
// Success
code: 200
data: "OK"

// Error
code: 404
data: "Message not found"
```