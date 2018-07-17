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
    expect(results.code, 'Get employee by name').to.equals(200);
    expect(store.employee.getAll().data.length, 'Get employee by name').to.equals(2);
    
    done();
});
