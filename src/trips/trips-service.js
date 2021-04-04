const TripsService = {
  getAllTrips(db, user_id) {
    return db
      .select('*')
      .from('trips')
      .where({user_id});
  },
    
  getTripById(db, id) {
    return db
      .select('*')
      .from('trips')
      .where({id})
      .first();
  },
    
  insertTrip(db, newTrip) {
    return db
      .insert(newTrip)
      .into('trips')
      .returning('*')
      .then(rows => rows[0]);
  },
    
  deleteTrip(db, id) {
    return db
      .from('trips')
      .where({id})
      .delete();
  },
  deletePlans(db, trip_id) {
    return db
      .from('plans')
      .where({trip_id})
      .delete();
  }
      
};
    
module.exports = TripsService;