-- Create tables with proper UUID columns
CREATE TABLE `user` (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE TABLE movie (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(50),
    description TEXT,
    duration INT,
    price BIGINT,
    version BIGINT DEFAULT 0
);

CREATE TABLE room (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    version BIGINT DEFAULT 0
);

CREATE TABLE showtime (
    id VARCHAR(36) PRIMARY KEY,
    movie_id VARCHAR(36) NOT NULL,
    room_id VARCHAR(36) NOT NULL,
    screening_time DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    version BIGINT DEFAULT 0,
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE
);

CREATE TABLE seat (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL,
    seat_row VARCHAR(5) NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    version BIGINT DEFAULT 0,
    FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat (room_id, seat_row, seat_number)
);

CREATE TABLE booking (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    showtime_id VARCHAR(36) NOT NULL,
    total_price BIGINT,
    booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    version BIGINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtime(id) ON DELETE CASCADE
);

CREATE TABLE booking_seat (
    id VARCHAR(36) PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    seat_id VARCHAR(36) NOT NULL,
    version BIGINT DEFAULT 0,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE
);

CREATE TABLE payment (
    id VARCHAR(36) PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    amount BIGINT NOT NULL,
    payment_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    version BIGINT DEFAULT 0,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

-- Create sample movies
INSERT INTO movie (id, title, genre, description, duration, price) VALUES
(UUID(), 'Avengers: Endgame', 'Action', 'The epic conclusion to the Infinity Saga', 180, 150000),
(UUID(), 'The Dark Knight', 'Action', 'Batman faces his greatest challenge', 152, 120000),
(UUID(), 'Inception', 'Sci-Fi', 'A thief who steals corporate secrets through dream-sharing technology', 148, 130000);

-- Create sample rooms
INSERT INTO room (id, name, total_seats) VALUES
(UUID(), 'Phòng 1 - VIP', 100),
(UUID(), 'Phòng 2 - Standard', 150);

-- Create sample showtimes (will be inserted by app if needed)

-- Create sample user (admin/test user)
INSERT INTO `user` (id, username, email, password, full_name, phone_number, role) VALUES
(UUID(), 'admin', 'admin@cinema.com', '$2a$10$abc123', 'Admin User', '0123456789', 'ADMIN'),
(UUID(), 'testuser', 'test@cinema.com', '$2a$10$def456', 'Test User', '0987654321', 'USER');
