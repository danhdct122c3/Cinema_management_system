-- Insert sample movies
INSERT INTO movies (id, title, genre, description, ticket_price) VALUES
(1, 'Avengers: Endgame', 'Action/Sci-Fi', 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe.', 150000),
(2, 'Spider-Man: No Way Home', 'Action/Adventure', 'With Spider-Man''s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.', 120000),
(3, 'The Batman', 'Action/Crime/Drama', 'When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city''s hidden corruption and question his family''s involvement.', 130000);

-- Insert screenings
INSERT INTO screenings (id, movie_id, start_time, end_time) VALUES
(1, 1, '2024-01-20 10:00:00', '2024-01-20 13:01:00'),
(2, 1, '2024-01-20 14:00:00', '2024-01-20 17:01:00'),
(3, 2, '2024-01-20 11:00:00', '2024-01-20 13:28:00'),
(4, 2, '2024-01-20 15:00:00', '2024-01-20 17:28:00'),
(5, 3, '2024-01-20 12:00:00', '2024-01-20 14:56:00'),
(6, 3, '2024-01-20 16:00:00', '2024-01-20 18:56:00');

-- Insert seats (5 rows, 10 seats per row)
INSERT INTO seats (id, row_number, seat_number, status) VALUES
-- Row A
(1, 'A', 1, 'AVAILABLE'), (2, 'A', 2, 'AVAILABLE'), (3, 'A', 3, 'AVAILABLE'), (4, 'A', 4, 'AVAILABLE'), (5, 'A', 5, 'AVAILABLE'),
(6, 'A', 6, 'AVAILABLE'), (7, 'A', 7, 'AVAILABLE'), (8, 'A', 8, 'AVAILABLE'), (9, 'A', 9, 'AVAILABLE'), (10, 'A', 10, 'AVAILABLE'),
-- Row B
(11, 'B', 1, 'AVAILABLE'), (12, 'B', 2, 'AVAILABLE'), (13, 'B', 3, 'AVAILABLE'), (14, 'B', 4, 'AVAILABLE'), (15, 'B', 5, 'AVAILABLE'),
(16, 'B', 6, 'AVAILABLE'), (17, 'B', 7, 'AVAILABLE'), (18, 'B', 8, 'AVAILABLE'), (19, 'B', 9, 'AVAILABLE'), (20, 'B', 10, 'AVAILABLE'),
-- Row C
(21, 'C', 1, 'AVAILABLE'), (22, 'C', 2, 'AVAILABLE'), (23, 'C', 3, 'AVAILABLE'), (24, 'C', 4, 'AVAILABLE'), (25, 'C', 5, 'AVAILABLE'),
(26, 'C', 6, 'AVAILABLE'), (27, 'C', 7, 'AVAILABLE'), (28, 'C', 8, 'AVAILABLE'), (29, 'C', 9, 'AVAILABLE'), (30, 'C', 10, 'AVAILABLE'),
-- Row D
(31, 'D', 1, 'AVAILABLE'), (32, 'D', 2, 'AVAILABLE'), (33, 'D', 3, 'AVAILABLE'), (34, 'D', 4, 'AVAILABLE'), (35, 'D', 5, 'AVAILABLE'),
(36, 'D', 6, 'AVAILABLE'), (37, 'D', 7, 'AVAILABLE'), (38, 'D', 8, 'AVAILABLE'), (39, 'D', 9, 'AVAILABLE'), (40, 'D', 10, 'AVAILABLE'),
-- Row E
(41, 'E', 1, 'AVAILABLE'), (42, 'E', 2, 'AVAILABLE'), (43, 'E', 3, 'AVAILABLE'), (44, 'E', 4, 'AVAILABLE'), (45, 'E', 5, 'AVAILABLE'),
(46, 'E', 6, 'AVAILABLE'), (47, 'E', 7, 'AVAILABLE'), (48, 'E', 8, 'AVAILABLE'), (49, 'E', 9, 'AVAILABLE'), (50, 'E', 10, 'AVAILABLE'); 