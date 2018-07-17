const chai = require('chai');
const expect = chai.expect;
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const store = require('../store');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

store.init('./test/db-test.json');
store.reset();

it('Create employee', done => {
    let results;

    results = store.employee.add({ firstName: 'Barry', lastName: 'Allen' });
    expect(results, 'Create new employee').to.containSubset({
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

it('Get and update employee', done => {
    let results;

    results = store.employee.get('Barry+Allen');
    expect(results, 'Get employee by name').to.containSubset({
        code: 200,
        data: {
            firstName: 'Barry',
            lastName: 'Allen'
        }
    });

    let eid = results.data.id;

    results = store.employee.get(eid);
    expect(results, 'Get employee by id').to.containSubset({
        code: 200,
        data: {
            id: eid,
            firstName: 'Barry',
            lastName: 'Allen'
        }
    });

    results = store.employee.update(eid, { firstName: 'Johnny' });
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

