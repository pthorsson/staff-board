const moment = require('moment');
const chai = require('chai');
const expect = chai.expect;
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const store = require('../store');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

store.init('./test/db-test.json');
store.reset();

const globals = {};

//
//  Employee
//

it('Create employees', done => {
    let results;

    results = store.employee.add({ firstName: 'Barry', lastName: 'Allen' });
    expect(results, 'Create new employee 1').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    results = store.employee.add({ firstName: 'O\'Barry', lastName: 'von Allen' });
    expect(results, 'Create new employee 2').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    results = store.employee.add({ firstName: 'Bärrü', lastName: 'Ällëñ' });
    expect(results, 'Create new employee 2').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    results = store.employee.add({ firstName: 'Barry', lastName: 'Allen' });
    expect(results, 'Employee should already exist').to.containSubset({
        code: 400,
        data: 'Employee already exists'
    });

    done();
});

it('Get employees', done => {
    let results;

    expect(store.employee.get('Barry+Allen').code, 'Get employee by name 1').to.equals(200);
    expect(store.employee.get('O\'Barry+von+Allen').code, 'Get employee by name 2').to.equals(200);
    expect(store.employee.get('Bärrü+Ällëñ').code, 'Get employee by name 3').to.equals(200);
    expect(store.employee.get('thisisnotanid').code, 'No employee found by id').to.equals(404);

    done();
});

it('Get and update an employee', done => {
    let results;

    results = store.employee.get('Barry+Allen');
    expect(results, 'Get employee by name').to.containSubset({
        code: 200,
        data: {
            firstName: 'Barry',
            lastName: 'Allen'
        }
    });

    globals.eid1 = results.data.id;

    results = store.employee.get(globals.eid1);
    expect(results, 'Get employee by id').to.containSubset({
        code: 200,
        data: {
            id: globals.eid1,
            firstName: 'Barry',
            lastName: 'Allen'
        }
    });

    results = store.employee.update(globals.eid1, { firstName: 'Johnny' });
    expect(results, 'Update employee by id').to.containSubset({
        code: 200,
        data: 'OK'
    });

    results = store.employee.update('thisisnotanid', { firstName: 'Johnny' });
    expect(results, 'No employee should be found for update').to.containSubset({
        code: 404,
        data: 'Employee not found'
    });

    done();
});

it('Get all employees', done => {
    let results;

    results = store.employee.getAll();
    expect(results, 'Should be 3 employees').to.containSubset({
        code: 200,
        data: [
            { firstName: 'Johnny' },
            { firstName: 'O\'Barry' },
            { firstName: 'Bärrü' },
        ]
    });
    
    done();
});

it('Remove employee', done => {
    let results;

    results = store.employee.remove('Bärrü+Ällëñ');
    expect(results, 'Remove employee by name').to.containSubset({
        code: 200,
        data: 'OK'
    });
    expect(store.employee.getAll().data.length, 'Get employee by name').to.equals(2);
    
    done();
});

//
//  Message
//

it('Add messages', done => {
    let results;

    globals.eid1 = store.employee.add({ firstName: 'Oliver', lastName: 'Queen' }).data;
    globals.eid2 = store.employee.add({ firstName: 'Kara', lastName: 'Danvers' }).data;

    // -- Create new messages

    results = store.message.add({
        employee: globals.eid1,
        message: 'Message 1 by Oliver',
        expiresAt: moment().add(10, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 1').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    results = store.message.add({
        employee: globals.eid1,
        message: 'Message 2 by Oliver',
        expiresAt: moment().add(1, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 2').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    results = store.message.add({
        employee: globals.eid2,
        message: 'Message 1 by Kara',
        expiresAt: moment().add(1, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 1 by kara').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    results = store.message.add({
        employee: globals.eid2,
        message: 'Message 2 by Kara',
        expiresAt: moment().add(12, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 2 by kara').to.containSubset({
        code: 200,
        data: id => uuidPattern.test(id)
    });

    // -- Fails to create new messages

    results = store.message.add({
        employee: globals.eid1,
        message: 'Message 3 by Oliver',
        expiresAt: moment().add(0, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 3 with invalid date').to.containSubset({
        code: 400,
        data: 'Invalid expiration date'
    });

    results = store.message.add({
        employee: globals.eid1,
        message: 'Message 4 by Oliver',
        expiresAt: moment().add(-10, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 4 with invalid date').to.containSubset({
        code: 400,
        data: 'Invalid expiration date'
    });

    results = store.message.add({
        employee: 'thisisnotanid',
        message: 'Message 5 by Oliver',
        expiresAt: moment().add(1, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Add message 5 with invalid employee').to.containSubset({
        code: 400,
        data: 'No employee with the given id'
    });
    
    done();
});

it('Get messages', done => {
    let results;

    globals.mid1 = store.message.add({
        employee: globals.eid1,
        message: 'Test message',
        expiresAt: moment().add(10, 'days').format('YYYY-MM-DD')
    }).data;
    expect(store.message.get(globals.mid1).code, 'Get message by id').to.equals(200);
    expect(store.message.get('thisisnotanid').code, 'No message found by id').to.equals(404);

    done();
});

it('Get batched messages', done => {
    let results;

    results = store.message.getBatched();
    expect(results.code, 'Get batched messages response code').to.equals(200);
    expect(results.data.length, 'Employee count').to.equals(2);
    expect(results.data[0].messages.length, 'Employee 1 message count').to.equals(3);
    expect(results.data[1].messages.length, 'Employee 2 message count').to.equals(2);

    done();
});

it('Get and update a message', done => {
    let results;

    results = store.message.update(globals.mid1, {
        employee: globals.eid1,
        message: 'Test message',
        expiresAt: moment().add(15, 'days').format('YYYY-MM-DD')
    });
    expect(results, 'Updates message by id').to.containSubset({
        code: 200,
        data: 'OK'
    });

    results = store.message.get(globals.mid1);
    expect(results, 'Confirms new message data').to.containSubset({
        code: 200,
        data: {
            message: 'Test message',
            expiresAt: date => date === moment().add(15, 'days').format('YYYY-MM-DD')
        }
    });

    done();
});

it('Remove one and get all message', done => {
    let results;

    expect(store.message.getAll().data.length, 'Get all messages before remove').to.equals(5);

    results = store.message.remove(globals.mid1);
    expect(results, 'Remove message by id').to.containSubset({
        code: 200,
        data: 'OK'
    });

    expect(store.message.getAll().data.length, 'Get all messages after remove').to.equals(4);

    done();
});