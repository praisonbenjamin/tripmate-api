const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xss = require('xss');

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'Test-user-1',
            password: 'password1',
        },
        {
            id: 2,
            user_name: 'Test-user-2',
            password: 'password2',
        },
        {
            id: 3,
            user_name: 'Test-user-3',
            password: 'password3',
        },
    ];
}

function makeTestTrips(users) {
    return [
      {
        id: 1,
        trip_title: 'testTitle1',
        user_id: users[0].id
      },
      {
        id: 2,
        trip_title: 'testTitle2',
        user_id: users[1].id
      },
      {
        id: 3,
        trip_title: 'testTitle3',
        user_id: users[2].id
      }
    ]
  };
  
  function makeTestPlans(trips) {
    return [
      {
        id: 1,
        location: 'testLocale1',
        from_date: '2020-01-01',
        to_date: '2020-01-02',
        notes: 'testNotes1',
        trip_id: trips[0].id
      },
      {
        id: 2,
        location: 'testLocale2',
        from_date: '2020-03-01',
        to_date: '2020-03-02',
        notes: 'testNotes2',
        trip_id: trips[1].id
      },
      {
        id: 3,
        location: 'testLocale3',
        from_date: '2020-05-01',
        to_date: '2020-05-02',
        notes: 'testNotes3',
        trip_id: trips[2].id
      }    
    ]
  };
  
  function expectedTrips(users, trip, plans=[]) {
    const user = users.find(user => user.id === trip.user_id)
    const plansForTrips = plans.filter(plan => plan.trip_id === trip.id)
    
    return {
      id: trip.id,
      trip_title: trip.trip_title,
      user_id: trip.user_id
    }
  };
  
  function createTripsFixtures() {
    const testUsers = makeUsersArray()
    const testTrips = makeTestTrips(testUsers)
    const testPlans = makeTestPlans(testTrips)
    return {
      testUsers,
      testTrips,
      testPlans
    }
  };
  
  function cleanTables(db) {
    return db.transaction(trx => 
      trx
        .raw(
          `TRUNCATE
            users,
            trips,
            plans`
        )
        .then(() => 
          Promise.all([
            trx.raw(
              `ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(
              `ALTER SEQUENCE trips_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(
              `ALTER SEQUENCE plans_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(`SELECT setval('users_id_seq', 0)`),
            trx.raw(`SELECT setval('trips_id_seq', 0)`),
            trx.raw(`SELECT setval('plans_id_seq', 0)`)
          ])
        )
      )
  };
  
  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db
      .into('users')
      .insert(preppedUsers)
      .then(() => 
      db.raw(`SELECT setval('users_id_seq', ?)`, [
        users[users.length-1].id
      ])
    )
  };
  
  function seedTripsTables(db, users, trips, plans=[]) {
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into("trips").insert(trips)
      await trx.raw(`SELECT setval('trips_id_seq', ?)`, [
        trips[trips.length-1].id
      ])
      if(plans.length) {
        await trx.into("plans").insert(plans)
        await trx.raw(`SELECT setval('plans_id_seq', ?)`, [
          plans[plans.length-1].id
        ])
      }
    })
  };
  
  function createAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256'
    })

    return `Bearer ${token}`;
}
  
  function makeKnexInstance() {
    return knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  }

module.exports = {
    makeUsersArray,
    makeTestTrips,
    makeTestPlans,
    expectedTrips,
    createTripsFixtures,
    cleanTables,
    seedUsers,
    seedTripsTables,
    createAuthHeader,
    makeKnexInstance
}