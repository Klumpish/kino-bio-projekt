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

### Notes

- The `/api/screenings/:id/movie` endpoint returns only screenings that have not yet started.
- If no upcoming screenings are found for a movie, an empty array is returned.

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
