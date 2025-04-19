-- ***** 1. INITIAL DATA IMPORT *****
CREATE TABLE "hourly_ridership" (
	"transit_timestamp"		TEXT,
	"transit_mode"			TEXT,
	"station_complex_id"	INTEGER,
	"station_complex"		TEXT,
	"borough"				TEXT,
	"payment_method"		TEXT,
	"fare_class_category"	TEXT,
	"ridership"				INTEGER,
	"transfers"				INTEGER,
	"latitude"				REAL,
	"longitude"				REAL,
	"Georeference"			TEXT
);

-- imported csv using DB Browser for SQLite

-- ***** 1.1. DELETE UNNECESSARY COLUMNS *****
ALTER TABLE hourly_ridership
DROP COLUMN Georeference;

ALTER TABLE hourly_ridership
DROP COLUMN station_complex;

ALTER TABLE hourly_ridership
DROP COLUMN borough;

ALTER TABLE hourly_ridership
DROP COLUMN latitude;

ALTER TABLE hourly_ridership
DROP COLUMN longitude;

-- ***** 2. REFORMAT DATE *****

-- create new columns
ALTER TABLE hourly_ridership
ADD COLUMN date TEXT;

ALTER TABLE hourly_ridership
ADD COLUMN hour INTEGER;

UPDATE hourly_ridership 
SET date = SUBSTR(transit_timestamp, 7, 4) || '-' || SUBSTR(transit_timestamp, 1, 2) || '-' || SUBSTR(transit_timestamp, 4, 2);

UPDATE hourly_ridership
SET hour = 	CASE 
              	WHEN SUBSTR(transit_timestamp, 12, 2) = '12' AND SUBSTR(transit_timestamp, -2) = 'AM' THEN 0
              	WHEN SUBSTR(transit_timestamp, 12, 2) = '12' AND SUBSTR(transit_timestamp, -2) = 'PM' THEN 12
              	WHEN SUBSTR(transit_timestamp, -2) = 'AM' THEN CAST(SUBSTR(transit_timestamp, 12, 2) AS INTEGER)
              	ELSE CAST(SUBSTR(transit_timestamp, 12, 2) AS INTEGER) + 12
          	END;

-- delete old column
ALTER TABLE hourly_ridership
DROP COLUMN transit_timestamp;

-- ***** 3. DATA NORMALIZATION *****

-- ***** 3.1. TRANSIT MODE TABLE *****

CREATE TABLE "transit_mode" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique transit modes
INSERT INTO transit_mode (name)
SELECT DISTINCT transit_mode
FROM hourly_ridership;

-- add new column for transit mode id
ALTER TABLE hourly_ridership
ADD COLUMN transit_mode_id INTEGER;

UPDATE hourly_ridership
SET transit_mode_id = (
    SELECT id
    FROM transit_mode
    WHERE transit_mode.name = hourly_ridership.transit_mode
);

-- remove old transit mode column
ALTER TABLE hourly_ridership
DROP COLUMN transit_mode;

-- ***** 3.2 PAYMENT METHOD TABLE *****

CREATE TABLE "payment_method" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique payment methods to payment method table
INSERT INTO payment_method(name)
SELECT DISTINCT payment_method
FROM hourly_ridership;

-- add new column for payment_method_id
ALTER TABLE hourly_ridership
ADD COLUMN payment_method_id INTEGER;

UPDATE hourly_ridership
SET payment_method_id = (
    SELECT id
    FROM payment_method
    WHERE payment_method.name = hourly_ridership.payment_method
);

-- remove old payment_method column
ALTER TABLE hourly_ridership
DROP COLUMN payment_method;

-- ***** 3.3. FARE CLASS TABLE *****

CREATE TABLE "fare_class" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique fare classes to fare class table
INSERT INTO fare_class (name)
SELECT DISTINCT fare_class_category
FROM hourly_ridership;

-- add new column for fare_class_id
ALTER TABLE hourly_ridership
ADD COLUMN fare_class_id INTEGER;

UPDATE hourly_ridership
SET fare_class_id = (
    SELECT id
    FROM fare_class
    WHERE fare_class.name = hourly_ridership.fare_class_category
);

-- remove old fare_class_category column
ALTER TABLE hourly_ridership
DROP COLUMN fare_class_category;

-- ***** 4. VACUUM TO REDUCE FILE SIZE *****
VACUUM;

-- ***** 5. IMPORTING STATION DATA *****
CREATE TABLE "station" (
	"GTFS Stop ID"	TEXT,
	"Station ID"	INTEGER,
	"Complex ID"	INTEGER,
	"Division"	TEXT,
	"Line"	TEXT,
	"Stop Name"	TEXT,
	"Borough"	TEXT,
	"CBD"	TEXT,
	"Daytime Routes"	TEXT,
	"Structure"	TEXT,
	"GTFS Latitude"	REAL,
	"GTFS Longitude"	REAL,
	"North Direction Label"	TEXT,
	"South Direction Label"	TEXT,
	"ADA"	INTEGER,
	"ADA Northbound"	INTEGER,
	"ADA Southbound"	INTEGER,
	"ADA Notes"	TEXT,
	"Georeference"	TEXT
);

-- ***** 5.1. DELETE UNNECESSARY COLUMNS *****
ALTER TABLE station
DROP COLUMN Georeference;

-- ***** 5.2. UPDATE DATA TYPES *****
ALTER TABLE station
ADD COLUMN in_cbd INTEGER;

UPDATE station
SET CBD = CASE
    WHEN CBD = 'TRUE' THEN 1
    WHEN CBD = 'FALSE' THEN 0
    ELSE NULL -- Handle any unexpected values
END;

UPDATE station
SET in_cbd = CAST(CBD AS INTEGER);

ALTER TABLE station DROP COLUMN CBD;

ALTER TABLE station RENAME COLUMN in_cbd TO CBD;

-- ***** 5.3. RENAME COLS *****

ALTER TABLE station RENAME COLUMN "GTFS Stop ID" TO GTFS_stop_id;
ALTER TABLE station RENAME COLUMN "Station ID" TO station_id;
ALTER TABLE station RENAME COLUMN "Complex ID" TO complex_id;
ALTER TABLE station RENAME COLUMN "Division" TO division;
ALTER TABLE station RENAME COLUMN "Line" TO line;
ALTER TABLE station RENAME COLUMN "Stop Name" TO stop_name;
ALTER TABLE station RENAME COLUMN "Borough" TO borough;
ALTER TABLE station RENAME COLUMN "Daytime Routes" TO daytime_routes;
ALTER TABLE station RENAME COLUMN "Structure" TO structure;
ALTER TABLE station RENAME COLUMN "GTFS Latitude" TO latitude;
ALTER TABLE station RENAME COLUMN "GTFS Longitude" TO longitude;
ALTER TABLE station RENAME COLUMN "North Direction Label" TO north_direction_label;
ALTER TABLE station RENAME COLUMN "South Direction Label" TO south_direction_label;
ALTER TABLE station RENAME COLUMN "ADA Northbound" TO ADA_northbound;
ALTER TABLE station RENAME COLUMN "ADA Southbound" TO ADA_southbound;
ALTER TABLE station RENAME COLUMN "ADA Notes" TO ADA_notes;


-- ***** 6. STATIONS DATA NORMALIZATION *****

-- ***** 6.1. BOROUGH *****

CREATE TABLE "borough" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO borough (name) VALUES('M');
INSERT INTO borough (name) VALUES('Bk');
INSERT INTO borough (name) VALUES('Q');
INSERT INTO borough (name) VALUES('Bx');
INSERT INTO borough (name) VALUES('SI');

-- add new column for borough_id
ALTER TABLE station
ADD COLUMN borough_id INTEGER;

UPDATE station
SET borough_id = (
    SELECT id
    FROM borough
    WHERE borough.name = station.borough
);

-- change to full name
UPDATE borough
SET name = CASE
    WHEN name = 'M' THEN 'Manhattan'
    WHEN name = 'Bk' THEN 'Brooklyn'
	WHEN name = 'Q' THEN 'Queens'
	WHEN name = 'Bx' THEN 'Bronx'
	WHEN name = 'SI' THEN 'Staten Island'
END;

-- remove old column
ALTER TABLE station
DROP COLUMN borough;


-- ***** 6.2. STRUCTURE *****

CREATE TABLE "structure_type" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique structure types to structure_types table
INSERT INTO structure_type (name)
SELECT DISTINCT structure
FROM station;

-- add new column for borough_id
ALTER TABLE station
ADD COLUMN structure_type_id INTEGER;

UPDATE station
SET structure_type_id = (
    SELECT id
    FROM structure_type
    WHERE structure_type.name = station.structure
);

-- remove old column
ALTER TABLE station
DROP COLUMN structure;

-- ***** 6.2. DIVISION *****

CREATE TABLE "division" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique divisions to fare division table
INSERT INTO division (name)
SELECT DISTINCT division
FROM station;

-- add new column for division_id
ALTER TABLE station
ADD COLUMN division_id INTEGER;

UPDATE station
SET division_id = (
    SELECT id
    FROM division
    WHERE division.name = station.division
);

-- remove old column
ALTER TABLE station
DROP COLUMN division;

-- ***** 6.3. LABEL *****

CREATE TABLE "label" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique labels to label table
INSERT INTO label (name)
SELECT DISTINCT label
FROM (
	SELECT north_direction_label AS label from station
	UNION
	SELECT south_direction_label AS label from station
);

-- add new column
ALTER TABLE station
ADD COLUMN north_label_id INTEGER;

ALTER TABLE station
ADD COLUMN south_label_id INTEGER;

UPDATE station
SET north_label_id = (
    SELECT id
    FROM label
    WHERE label.name = station.north_direction_label
);

UPDATE station
SET south_label_id = (
    SELECT id
    FROM label
    WHERE label.name = station.south_direction_label
);

-- remove old columns
ALTER TABLE station
DROP COLUMN north_direction_label;

ALTER TABLE station
DROP COLUMN south_direction_label;

-- ***** 3.3. LINE *****

CREATE TABLE "line" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- add unique lines to line table
INSERT INTO line (name)
SELECT DISTINCT line
FROM station;

-- add new column
ALTER TABLE station
ADD COLUMN line_id INTEGER;

UPDATE station
SET line_id = (
    SELECT id
    FROM line
    WHERE line.name = station.line
);

-- remove old column
ALTER TABLE station
DROP COLUMN line;

-- Vacuum again
VACUUM;

-- Note: After re-ordering the table columns, renaming columns, dropping columns, etc.
-- the schemas changed to the following:

CREATE TABLE "hourly_ridership" (
	"date"	TEXT,
	"hour"	INTEGER,
	"station_complex_id"	INTEGER,
	"ridership"	INTEGER,
	"transfers"	INTEGER,
	"transit_mode_id"	INTEGER,
	"payment_method_id"	INTEGER,
	"fare_class_id"	INTEGER,
	FOREIGN KEY("fare_class_id") REFERENCES "fare_class"("id"),
	FOREIGN KEY("payment_method_id") REFERENCES "payment_method"("id"),
	FOREIGN KEY("station_complex_id") REFERENCES "station"("complex_id"),
	FOREIGN KEY("transit_mode_id") REFERENCES "transit_mode"("id")
)

CREATE TABLE "station" (
	"GTFS_stop_id"	TEXT NOT NULL UNIQUE,
	"station_id"	INTEGER,
	"complex_id"	INTEGER,
	"division_id"	INTEGER,
	"stop_name"	TEXT,
	"borough_id"	INTEGER,
	"structure_type_id"	INTEGER,
	"daytime_routes"	TEXT,
	"latitude"	REAL,
	"longitude"	REAL,
	"CBD"	INTEGER,
	"north_label_id"	INTEGER,
	"south_label_id"	INTEGER,
	"line_id"	INTEGER,
	"ADA"	INTEGER,
	"ADA_northbound"	INTEGER,
	"ADA_southbound"	INTEGER,
	"ADA_notes"	TEXT,
	PRIMARY KEY("GTFS_stop_id"),
	FOREIGN KEY("borough_id") REFERENCES "borough"("id"),
	FOREIGN KEY("line_id") REFERENCES "line"("id"),
	FOREIGN KEY("north_label_id") REFERENCES "label"("id"),
	FOREIGN KEY("south_label_id") REFERENCES "label"("id"),
	FOREIGN KEY("structure_type_id") REFERENCES "structure_type"("id")
)

CREATE TABLE "borough" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "division" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "fare_class" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "label" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "line" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "payment_method" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "structure_type" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "transit_mode" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
)

-- Getting final csv
SELECT date, hour, SUM(ridership) AS ridership
FROM hourly_ridership
WHERE transit_mode_id = 1
GROUP BY DATE(date), hour
ORDER BY DATE(date), hour;