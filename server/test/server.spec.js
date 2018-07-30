const moment = require('moment');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const app = require('../app');
const request = require('supertest');

chai.use(chaiAsPromised);

let server, _app,
    globals = {
        employee: [],
        message: []
    };

before(() => {
    _app = app({
        database: './test/db-test.json',
        scheduleCleanUp: false,
        port: 9099
    });

    server = request(_app);

    server.delete('/api/employees/reset').end(() => {});

    console.log('  Running test ...');
});

after(() => {
    _app.close();
});

// Helper functions

const days = d => moment().add(d, 'days').format('YYYY-MM-DD');

const test = {
    isId: type => res => {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    
        if (!uuidPattern.test(res.body)) throw new Error('Should return ID');

        globals[type].push(res.body);
    },

    countIs: (count) => res => {
        if (res.body.length !== count) throw new Error(`Result count mismatch: expected ${count}, received ${res.body.length}`);
    },

    matchingProps: type => res => {
        let props = {
            employee: ['id', 'firstName', 'lastName'],
            message: ['id', 'employee', 'message', 'expiresAt']
        };

        for (let key in res.body) {
            if (props[type].indexOf(key) < 0) throw new Error(`Properties mismatch for type "${type}"`);
        }
    },
};

//
//  Employee
//

describe('Create empolyees', () => {
    it('Should create employee 1', () => server.post('/api/employee').send({ firstName: 'Barry', lastName: 'Allen' }).expect(200).expect(test.isId('employee')));
    it('Should create employee 2', () => server.post('/api/employee').send({ firstName: 'Oliver', lastName: 'Queen' }).expect(200).expect(test.isId('employee')));
    it('Should create employee 3', () => server.post('/api/employee').send({ firstName: 'Kara', lastName: 'Danvers' }).expect(200).expect(test.isId('employee')));
    it('Should fail to create employee 1 again', () => server.post('/api/employee').send({ firstName: 'Barry', lastName: 'Allen' }).expect(400));
    it('Should create employee 4', () => server.post('/api/employee').send({ firstName: 'O\'Barry', lastName: 'von Allen' }).expect(200).expect(test.isId('employee')));
    it('Should create employee 5', () => server.post('/api/employee').send({ firstName: 'Bärrü', lastName: 'Ällëñ' }).expect(200).expect(test.isId('employee')));
});

describe('Get empolyee', () => {
    it('Should get employee 1 by name', () => server.get('/api/employee/Barry+Allen').expect(200).expect(test.matchingProps('employee')));
    it('Should get employee 3 by name', () => server.get('/api/employee/Bärrü+Ällëñ').expect(200).expect(test.matchingProps('employee')));
    it('Should get employee 4 by name', () => server.get('/api/employee/O\'Barry+von+Allen').expect(200).expect(test.matchingProps('employee')));
    it('Should get employee 1 by id', () => server.get(`/api/employee/${globals.employee[0]}`).expect(200).expect(test.matchingProps('employee')));
    it('Should not find an employee', () => server.get('/api/employee/thisisnotanid').expect(404));
    it('Should get all employees', () => server.get('/api/employees').expect(200).expect(test.countIs(5)));
});

describe('Update employee', () => {
    it('Should update employee 1 by name', () => server.put('/api/employee/Barry+Allen').send({ firstName: 'Johnny' }).expect(200));
    it('Should get employee 1 by new name', () => server.put('/api/employee/Johnny+Allen').expect(200));
    it('Should update employee 1 by id', () => server.put(`/api/employee/${globals.employee[0]}`).send({ firstName: 'Barry' }).expect(200));
    it('Should fail to find an employee to update', () => server.put('/api/employee/thisisnotanid').send({ firstName: 'Johnny' }).expect(404));
});

describe('Delete employee by id', () => {
    it('Should get employee 3 by id', () => server.get(`/api/employee/${globals.employee[2]}`).expect(200));
    it('Should delete employee 3 by id', () => server.delete(`/api/employee/${globals.employee[2]}`).expect(200));
    it('Should not find employee', () => server.get(`/api/employee/${globals.employee[2]}`).expect(404));
    it('Should fail to find employee to delete', () => server.delete(`/api/employee/${globals.employee[2]}`).expect(404));
});

//
//  Messages
//

describe('Create messages', () => {
    it('Should create message 1 by Barry', () => server.post('/api/message').send({ employee: globals.employee[0], message: 'message 1', expiresAt: days(1) }).expect(200).expect(test.isId('message')));
    it('Should create message 2 by Barry', () => server.post('/api/message').send({ employee: globals.employee[0], message: 'message 2', expiresAt: days(2) }).expect(200).expect(test.isId('message')));
    it('Should fail to create message 3 by Barry', () => server.post('/api/message').send({ employee: globals.employee[0], message: 'message 3', expiresAt: days(0) }).expect(400));
    it('Should create message 3 by Oliver', () => server.post('/api/message').send({ employee: globals.employee[1], message: 'message 3', expiresAt: days(1) }).expect(200).expect(test.isId('message')));
    it('Should create message 4 by Oliver', () => server.post('/api/message').send({ employee: globals.employee[1], message: 'message 4', expiresAt: days(2) }).expect(200).expect(test.isId('message')));
});

describe('Get message', () => {
    it('Should get message 1 by Barry', () => server.get(`/api/message/${globals.message[0]}`).expect(200).expect(test.matchingProps('message')));
    it('Should not find a message', () => server.get('/api/message/thisisnotanid').expect(404));
    it('Should get all messages', () => server.get('/api/messages').expect(200).expect(test.countIs(4)));
    it('Should get batched messages', () => server.get('/api/messages/batched').expect(200).expect(res => {
        if (res.body[0].messages.length !== 2) throw new Error('Employee 1 message count mismatch');
        if (res.body[1].messages.length !== 2) throw new Error('Employee 2 message count mismatch');
    }));
});

describe('Update message', () => {
    it('Should update message 1', () => server.put(`/api/message/${globals.message[0]}`).send({ message: 'updated', expiresAt: days(1) }).expect(200));
    it('Should fail to update message 1', () => server.put(`/api/message/${globals.message[0]}`).send({ expiresAt: days(0) }).expect(400));
});

describe('Delete message', () => {
    it('Should get message 3', () => server.get(`/api/message/${globals.message[2]}`).expect(200));
    it('Should delete message 3', () => server.delete(`/api/message/${globals.message[2]}`).expect(200));
    it('Should not find message', () => server.get(`/api/message/${globals.message[2]}`).expect(404));
    it('Should fail to find message to delete', () => server.delete(`/api/message/${globals.message[2]}`).expect(404));
});
