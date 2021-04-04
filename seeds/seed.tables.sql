BEGIN;

TRUNCATE
  users,
  trips,
  plans;

INSERT INTO users (user_name, password)
VALUES
-- test_man, pass
('test_man', '$2a$16$6GFb.JN.2DQo0w/mc8.xuunyjWUrfVnTOjjSc5mReGA6Eb8LqK0iS'),
('other_user', '$2a$16$.AfT/pDKGyGKcPHsv1Ac/uQXk5tuq/Hc8PPDtQKbMvL/cjN5BoGhW');

INSERT INTO trips (trip_title, user_id)
  VALUES
    ('New York', 1),
    ('Miami', 1);

INSERT INTO plans (location, from_date, to_date, notes, trip_id)
  VALUES
    ('time square', '2019-12-31', '2020-01-01', 'kicking off the new year', 5),
    ('beach party', '2020-02-10', '2020-02-10', 'eating and drinking on miami beach', 6);

COMMIT;