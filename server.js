const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

const movies = [
    { 
      id: 1, 
      title: "Movie 1", 
      date: "2024-12-20", 
      price: 150, 
      seatsAvailable: 20,
      image: "https://placehold.co/300x450?text=Film+1"
    },
    { 
      id: 2, 
      title: "Movie 2", 
      date: "2024-12-21", 
      price: 150, 
      seatsAvailable: 15,
      image: "https://placehold.co/300x450?text=Film+2"
    },
    { 
      id: 3, 
      title: "Movie 3", 
      date: "2024-12-22", 
      price: 150, 
      seatsAvailable: 10,
      image: "https://placehold.co/300x450?text=Film+3"
    },
    { 
      id: 4, 
      title: "Movie 4", 
      date: "2024-12-23", 
      price: 150, 
      seatsAvailable: 25,
      image: "https://placehold.co/300x450?text=Film+4"
    },
    { 
      id: 5, 
      title: "Movie 5", 
      date: "2024-12-24", 
      price: 150, 
      seatsAvailable: 18,
      image: "https://placehold.co/300x450?text=Film+5"
    },
    { 
      id: 6, 
      title: "Movie 6", 
      date: "2024-12-25", 
      price: 150, 
      seatsAvailable: 12,
      image: "https://placehold.co/300x450?text=Film+6"
    },
    { 
      id: 7, 
      title: "Movie 7", 
      date: "2024-12-26", 
      price: 200, 
      seatsAvailable: 8,
      image: "https://placehold.co/300x450?text=Film+7"
    },
    { 
      id: 8, 
      title: "Movie 8", 
      date: "2024-12-27", 
      price: 200, 
      seatsAvailable: 5,
      image: "https://placehold.co/300x450?text=Film+8"
    },
    { 
      id: 9, 
      title: "Movie 9", 
      date: "2024-12-28", 
      price: 200, 
      seatsAvailable: 30,
      image: "https://placehold.co/300x450?text=Film+9"
    },
    { 
      id: 10, 
      title: "Movie 10", 
      date: "2024-12-29", 
      price: 200, 
      seatsAvailable: 40,
      image: "https://placehold.co/300x450?text=Film+10"
    }
  ];

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});