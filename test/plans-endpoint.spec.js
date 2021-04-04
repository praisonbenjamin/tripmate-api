const knex = require('knex');
const app = require('../src/app');
const service = require('./test-helpers.js');

describe('Plans Endpoints', function() {
  let db;

  const { testTrips, testUsers } = service.createTripsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => service.cleanTables(db));

  afterEach('cleanup', () => service.cleanTables(db));

  describe('POST /api/plans', () => {
    beforeEach('insert trips', () =>
      service.seedTripsTables(db, testUsers, testTrips)
    );

    it('creates a plan, responding with 201 and the new item', function() {
      this.retries(3);
      const testTrip = testTrips[0];
      const testUser = testUsers[0];
      const newItem = {
        location: 'test location',
        from_date: '2020-01-04T06:00:00.000Z',
        to_date: '2020-01-05T06:00:00.000Z',
        notes: 'test notes',
        trip_id: testTrip.id
      };
      return supertest(app)
        .post('/api/plans')
        // .set('Authorization', service.createAuthHeader(testUsers[0]))
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.location).to.eql(newItem.location);
          expect(res.body.from_date).to.eql(newItem.from_date);
          expect(res.body.to_date).to.eql(newItem.to_date);
          expect(res.body.notes).to.eql(newItem.notes);
          expect(res.body.trip_id).to.eql(newItem.trip_id);
        })
        .expect(res =>
          db
            .from('plans')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.from_date).to.eql(newItem.from_date);
              expect(row.to_date).to.eql(newItem.to_date);
              expect(row.notes).to.eql(newItem.notes);
              expect(row.trip_id).to.eql(newItem.trip_id);
            })
        );
    });
  });
});