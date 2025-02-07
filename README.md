# API Documentation

---

## Screenings API

### Get all screenings

- **URL**: `/api/screenings`
- **Method**: `GET`
- **Description**: Retrieves a list of all screenings
- **Response**: JSON-objekt with all screenings
- **Example Response**:
  ```{
  "data": [
    {
      "id": 295,
      "attributes": {
        "start_time": "2025-02-13T17:00:00.000Z",
        "room": "Stora salongen",
        "createdAt": "2025-01-29T14:19:16.064Z",
        "updatedAt": "2025-01-29T14:19:16.064Z"
      }
    },
    {
      "id": 296,
      "attributes": {
        "start_time": "2025-02-06T19:00:00.000Z",
        "room": "Stora salongen",
        "createdAt": "2025-02-05T07:36:08.488Z",
        "updatedAt": "2025-02-05T07:36:08.488Z"
      }
    },
  ]
  }
  ```

### Get screenings for single movie

- **URL**: `/api/screenings/:id/movie`
- **Method**: `GET`
- **Parameters**:
  `id`: Unique ID for the movie.
- **Description**: Retrieves information about the upcoming screenings for the specified movie.
- **Response**: A JSON array containing objects with screening times and rooms. If an error occurs, an error message is returned with a status code of 500.
- **Example Response**:
  ```[
  {
  "start_time": "2025-02-13T17:00:00.000Z",
  "room": "Stora salongen"
  },
  {
  "start_time": "2025-02-08T12:00:00.000Z",
  "room": "Stora salongen"
  },
  {
  "start_time": "2025-02-08T21:00:00.000Z",
  "room": "Stora salongen"
  },
  {
  "start_time": "2025-02-10T19:00:00.000Z",
  "room": "Stora salongen"
  },
  {
  "start_time": "2025-02-22T21:00:00.000Z",
  "room": "Stora salongen"
  }
  ]
  ```

## Reviews API

### Hämta recensioner för en film

- **URL**: `/movie/:movieId/reviews`
- **Method**: `GET`
- **Description**: Hämtar en lista med recensioner för en specifik film.
- **Response**: JSON-objekt with all reviews
- **Example Response**:

```
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Fantastisk film!",
      "author": "Alfred"
    },
    {
      "id": 2,
      "rating": 4,
      "comment": "Super film!",
      "author": "Henrik"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5
  }
}
```

### Hämta recensioner för en film

- **URL**: `/movie/:movieId/ratings/average`
- **Method**: `GET`
- **Description**: Hämtar genomsnittsbetyget från användarrecensioner om minst 5 betyg finns.
  Om färre än 5 betyg finns, hämtas betyget från IMDB istället.
- **Response**: JSON-objekt with all reviews
- **Example Response**:

```
{
  "averageRating": 4.2
}
```

### Hämta recensioner för en film

- **URL**: `/movie/reviews`
- **Method**: `POST`
- **Headers**:
  - Content-Type: application/json
- **Description**: Submit movie review for authenticated users
- **Example Response**:

```
{
  "data": {
    "id": "456",
    "attributes": {
      "comment": "Great movie!",
      "rating": 5,
      "author": "user",
      "movie": "123",
      "createdAt": "2024-03-19T12:00:00.000Z"
    }
  }
}
```

- **Request Body**:

```
{
  "data": {
    "comment": "Great movie!",
    "rating": 5,
    "movie": "123",
    "author": "user"
  }
}
```

## Authentication API

### Login

- **URL**: `/login`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: Basic base64(username:password)
- **Description**: Authenticates user with username and password
- **Response**: JWT token and user data
- **Example Response**:

```
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "username": "user",
    "verified": true,
    "isLoggedIn": true
  }
}
```

### Get User Data

- **URL**: `/user`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: Authorization: Bearer {token}
- **Description**: Retrieves authenticated user data
- **Response**: Username, Verified, IsLoggedIn
- **Example Response**:

```
{
  "user": {
    "username": "user",
    "isVerified": true,
    "isLoggedIn": true
  }
}
```

### Notes

- The `/api/screenings/:id/movie` endpoint returns only screenings that have not yet started.
- If no upcoming screenings are found for a movie, an empty array is returned.

## Top Movies API

### Get top movies

- **URL:** `/api/top-movies`
- **Method:** **`GET`**
- **Description:** Retrieves a list of the top-rated movies based on reviews from the last 30 days.
- **Response:** JSON object containing the top movies.

#### **Example Response:**

```
  {
    "id": 3,
    "attributes": {
      "title": "The Shawshank Redemption",
      "imdbId": "tt0111161",
      "intro": "Over the course of several years, **two convicts form a friendship**, seeking consolation and, eventually, redemption through basic compassion.",
      "image": {
        "url": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
      },
      "createdAt": "2023-01-23T07:17:34.923Z",
      "updatedAt": "2023-01-27T07:12:24.582Z",
      "publishedAt": "2023-01-23T07:17:39.384Z",
      "avgRating": 4.7
    }
  },
  {
    "id": 1,
    "attributes": {
      "title": "Isle of dogs",
      "imdbId": "tt5104604",
      "intro": "An outbreak of dog flu has spread through the city of **Megasaki, Japan**, and Mayor Kobayashi has demanded all dogs to be sent to Trash Island.",
      "image": {
        "url": "https://m.media-amazon.com/images/M/MV5BZDQwOWQ2NmUtZThjZi00MGM0LTkzNDctMzcyMjcyOGI1OGRkXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg"
      },
      "createdAt": "2023-01-23T05:58:58.110Z",
      "updatedAt": "2023-01-27T07:11:53.523Z",
      "publishedAt": "2023-01-23T06:01:31.679Z",
      "avgRating": 3.5
    }
  },  // Continues with 3 more movie objects...
```

### Error Handling

- `200 OK` – **Request was successful.**
- `500 Internal Server Error` – **Something went wrong on the server.**

#### **Example Error Response:**

```
{
  "error": "Could not get top rated movies"
}
```

---

## 🚀 Vite Installation

-Installing **Vite**:

`npm i -D vite`

---

## 🧪 Jest Installation

-Installing **Jest**:

`npm i -D jest`

---

## 🌐 Cross-Environment for Jest\*\*

-Installing **Cross-Environment**:

`npm i -D cross-env`

---

## 📜 Scripts for Running Jest with Cross-Env

-Add to **package.json**

`"scripts": {`

`"test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",`

`"watch": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --watch"`

`}`

---

# Kino-sida: Recensioner och Genomsnittsbetyg

### Hämta recensioner för en film

`GET /movie/:movieId/reviews`  
Hämtar en lista med recensioner för en specifik film.

### Svarsexempel

{
"reviews": [
{
"id": 1,
"rating": 5,
"comment": "Fantastisk film!",
"author": "Alfred"
},
{
"id": 2,
"rating": 4,
"comment": "Väldigt underhållande.",
"author": "Henrik"
}
],
"meta": {
"currentPage": 1,
"totalPages": 5
}
}

### Hämta genomsnitt betyg för en film

`GET /movie/:movieId/ratings/average`
Hämtar genomsnittsbetyget från användarrecensioner om minst 5 betyg finns.
Om färre än 5 betyg finns, hämtas betyget från IMDB istället.

### Svarsexempel (användarrecensioner)

{
"averageRating": 4.2
}

### Svarsexempel (IMDB)

{
"averageRating": 4.2
}
