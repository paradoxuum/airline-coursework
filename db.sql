CREATE TABLE passengers (
    passenger_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    CONSTRAINT chk_phone CHECK (phone not like '%[^0-9]%')
);

CREATE TABLE staff (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    salary INT NOT NULL,
    CONSTRAINT chk_phone CHECK (phone not like '%[^0-9]%')
);

CREATE TABLE airplane (
    airplane_id SERIAL PRIMARY KEY,
    serial_number VARCHAR(15) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL
);

CREATE TABLE airports (
    airport_id SERIAL PRIMARY KEY,
    airport_code VARCHAR(3) NOT NULL
);

-- Pilot ratings
CREATE TABLE aircraft_ratings (
    rating_id SERIAL PRIMARY KEY,
    aircraft VARCHAR(50) NOT NULL
);

CREATE TABLE pilot_ratings (
    employee_id INT NOT NULL,
    rating_id INT NOT NULL,
    PRIMARY KEY (employee_id, rating_id),
    FOREIGN KEY (employee_id) REFERENCES staff(employee_id),
    FOREIGN KEY (rating_id) REFERENCES ratings(rating_id)
);

-- Flights
CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    departure_date DATETIME NOT NULL,
    arrival_date DATETIME NOT NULL,
    airplane_id INT NOT NULL,
    CONSTRAINT arrival_after_departure CHECK (arrival_date > departure_date),
    FOREIGN KEY (airplane_id) REFERENCES airplane(airplane_id)
);

CREATE TABLE flight_passengers (
    flight_id INT NOT NULL,
    passenger_id INT NOT NULL,
    PRIMARY KEY (flight_id, passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id)
);

CREATE TABLE flight_staff (
    flight_id INT NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (flight_id, employee_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (employee_id) REFERENCES staff(employee_id)
);

CREATE TABLE flight_stops (
    flight_id INT NOT NULL,
    airport_id INT NOT NULL,
    PRIMARY KEY (flight_id, airport_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (airport_id) REFERENCES airports(airport_id)
);
