CREATE TABLE passengers (
    passenger_id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    CONSTRAINT chk_phone CHECK (phone not like '%[^0-9]%')
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    CONSTRAINT chk_phone CHECK (phone not like '%[^0-9]%')
);

CREATE TABLE airplane (
    airplane_id SERIAL PRIMARY KEY,
    serial_number VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL
);

CREATE TABLE city (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- Pilot ratings
CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    aircraft VARCHAR(50) NOT NULL
);

CREATE TABLE pilot_ratings (
    rating_id INT NOT NULL,
    staff_id INT NOT NULL,
    PRIMARY KEY (rating_id, staff_id),
    FOREIGN KEY (rating_id) REFERENCES ratings(rating_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- Flights
CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    CONSTRAINT arrival_after_departure CHECK (arrival_date > departure_date)
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
    staff_id INT NOT NULL,
    PRIMARY KEY (flight_id, staff_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

CREATE TABLE flight_city (
    flight_id INT NOT NULL,
    city_id INT NOT NULL,
    stop_number INT NOT NULL,
    PRIMARY KEY (flight_id, city_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (city_id) REFERENCES city(city_id)
);
