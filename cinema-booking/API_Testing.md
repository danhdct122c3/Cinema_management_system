# 📱 POSTMAN API COLLECTION - CINEMA BOOKING

This file contains the main API endpoints for testing the Cinema Booking system. Use these endpoints in Postman or any API client for testing. Replace `{id}` or other path variables as needed. All endpoints assume base URL: `http://localhost:8080` (adjust if different).

---

## Authentication

### Login
- **POST** `/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```
- **Response:** JWT token

---

## User APIs

### Register User
- **POST** `/api/users/register`
- **Body (JSON):**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

### Update User Status
- **PUT** `/api/users/{id}/status`
- **Body (JSON):**
```json
{
  "status": "ACTIVE" // or "INACTIVE"
}
```

### Assign Role to User
- **PUT** `/api/users/{id}/roles`
- **Body (JSON):**
```json
{
  "roleIds": ["roleId1", "roleId2"]
}
```

### Delete User
- **DELETE** `/api/users/{id}`

---

## Genre APIs

### Get All Genres
- **GET** `/api/genres`

### Create Genre
- **POST** `/api/genres`
- **Body (JSON):**
```json
{
  "name": "Action",
  "description": "Action movies"
}
```

### Update Genre
- **PUT** `/api/genres/{id}`
- **Body (JSON):**
```json
{
  "name": "New Name",
  "description": "New Description"
}
```

### Delete Genre
- **DELETE** `/api/genres/{id}`

---

## Movie APIs

### Get All Movies
- **GET** `/api/movies`

### Create Movie
- **POST** `/api/movies`
- **Body (JSON):**
```json
{
  "title": "Movie Title",
  "description": "Description",
  "duration": "120",
  "releaseDate": "2026-04-05",
  "status": "COMING_SOON",
  "genreId": "genreId"
}
```

### Update Movie
- **PUT** `/api/movies/{id}`
- **Body (JSON):**
```json
{
  "title": "New Title",
  "description": "New Description",
  "duration": "130",
  "releaseDate": "2026-05-01",
  "status": "NOW_SHOWING",
  "genreId": "genreId"
}
```

### Delete Movie
- **DELETE** `/api/movies/{id}`

---

## Booking APIs

### Create Booking
- **POST** `/api/bookings`
- **Body (JSON):**
```json
{
  "userId": "userId",
  "showTimeId": "showTimeId",
  "seatShowTimeIds": ["seatShowTimeId1", "seatShowTimeId2"]
}
```

### Confirm Booking
- **PATCH** `/api/bookings/{id}/confirm`

### Get User Bookings
- **GET** `/api/bookings/user/{userId}`

### Cancel Booking
- **DELETE** `/api/bookings/{id}`

---

## Seat Hold APIs

### Hold Seats
- **POST** `/api/seat-holds/reserve`
- **Body (JSON):**
```json
{
  "userId": "userId",
  "showTimeId": "showTimeId",
  "seatShowTimeIds": ["seatShowTimeId1", "seatShowTimeId2"],
  "holdDuration": 5
}
```

### Release Hold
- **POST** `/api/seat-holds/release`
- **Body (JSON):**
```json
["seatShowTimeId1", "seatShowTimeId2"]
```

### Check Hold Valid
- **GET** `/api/seat-holds/{seatShowTimeId}/valid`

---

## ShowTime APIs

### Get All ShowTimes
- **GET** `/api/showtimes`

### Create ShowTime
- **POST** `/api/showtimes`
- **Body (JSON):**
```json
{
  "movieId": "movieId",
  "roomId": "roomId",
  "startTime": "2026-04-05T19:00:00"
}
```

### Update ShowTime
- **PUT** `/api/showtimes/{id}`
- **Body (JSON):**
```json
{
  "movieId": "movieId",
  "roomId": "roomId",
  "startTime": "2026-04-06T20:00:00"
}
```

### Delete ShowTime
- **DELETE** `/api/showtimes/{id}`

---

## Room APIs

### Get All Rooms
- **GET** `/api/rooms`

### Create Room
- **POST** `/api/rooms`
- **Body (JSON):**
```json
{
  "roomName": "Room 1",
  "totalRows": 10,
  "totalColumns": 15
}
```

### Update Room
- **PUT** `/api/rooms/{id}`
- **Body (JSON):**
```json
{
  "roomName": "Room 2",
  "totalRows": 12,
  "totalColumns": 18
}
```

### Delete Room
- **DELETE** `/api/rooms/{id}`

---

## Permission & Role APIs

### Get All Roles
- **GET** `/api/roles`

### Create Role
- **POST** `/api/roles`
- **Body (JSON):**
```json
{
  "name": "ADMIN",
  "description": "Administrator"
}
```

### Update Role
- **PUT** `/api/roles/{id}`
- **Body (JSON):**
```json
{
  "name": "USER",
  "description": "Regular user"
}
```

### Delete Role
- **DELETE** `/api/roles/{id}`

### Get All Permissions
- **GET** `/api/permissions`

### Create Permission
- **POST** `/api/permissions`
- **Body (JSON):**
```json
{
  "name": "CREATE_GENRE",
  "description": "Can create genre"
}
```

### Update Permission
- **PUT** `/api/permissions/{id}`
- **Body (JSON):**
```json
{
  "name": "UPDATE_GENRE",
  "description": "Can update genre"
}
```

### Delete Permission
- **DELETE** `/api/permissions/{id}`

---

## Notes
- Most endpoints (except login/register) require Bearer token authentication.
- Replace all `{id}` and other variables with actual values.
- Adjust request bodies as needed for your schema.
- For booking, ensure showtime and seat availability before testing.

---

*Last updated: 2026-04-05*
