const knex = require('knex');
const app = require('../src/app');
const service = require('./test-helpers');

describe('Trips Endpoints', function() {
  let db

  const {
    testUsers,
    testTrips,
    testPlans,
  } = service.createTripsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => service.cleanTables(db))

  afterEach('cleanup', () => service.cleanTables(db))

  describe(`GET /api/trips`, () => {
    context(`Given no trips`, () => {
      beforeEach('insert trips', () =>
        service.seedUsers(
          db,
          testUsers
        )
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/trips')
          .set('Authorization', service.createAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are trips in the database', () => {
      beforeEach('insert trips', () =>
        service.seedTripsTables(
          db,
          testUsers,
          testTrips,
          testPlans
        )
      )

      it('responds with 200 and all of the trips associated with the user', () => {
        const expectTrips = testTrips.map(trip =>
          service.expectedTrips(
            testUsers,
            trip,
            testPlans
          )
        )
        return supertest(app)
          .get('/api/trips')
          .set('Authorization', service.createAuthHeader(testUsers[0]))
          .expect(200, [expectTrips[0]] )
      
        
    })
  })

  describe(`GET /api/trips/:tripId`, () => {

    context('Given there are trips in the database', () => {
      beforeEach('insert trips', () =>
        service.seedTripsTables(
          db,
          testUsers,
          testTrips,
          testPlans,
        )
      )

      it('responds with 200 and the specified trip', () => {
        const tripId = 2
        const expectTrip = service.expectedTrips(
          testUsers,
          testTrips[tripId - 1],
          testPlans,
        )

        return supertest(app)
          .get(`/api/trips/${tripId}`)
          .set('Authorization', service.createAuthHeader(testUsers[0]))
          .expect(200, expectTrip)
      })
    })
  })
})
})