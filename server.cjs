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
    "id": 1, 
    "title": "Meet Me in St. Louis", 
    "desc": "A disarmingly sweet musical led by outstanding performances from Judy Garland and Margaret O'Brien, Meet Me in St. Louis offers a holiday treat for all ages.",
    "date": "2024-12-28", 
    "price": 150, 
    "seatsAvailable": 20,
    "image": "https://lh3.googleusercontent.com/d/17UW1YyDs7qq2ERyIWUIW2Z4xBD0ik-pv=s220?authuser=0",
    "year": 1944,
    "rating": 87
  },
  { 
    "id": 2, 
    "title": "The Shop Around the Corner", 
    "desc": "Deftly directed by Ernst Lubitsch from a smart, funny script by Samson Raphaelson, The Shop Around the Corner is a romantic comedy in the finest sense of the term.",
    "date": "2024-12-29", 
    "price": 150, 
    "seatsAvailable": 15,
    "image": "https://lh3.googleusercontent.com/d/1sKnahWsC0cI_jSp3Gy7Cy0OMWozaLwKI=s220?authuser=0",
    "year": 1940,
    "rating": 91
  },
  { 
    "id": 3, 
    "title": "The Holdovers", 
    "desc": "Beautifully bittersweet, The Holdovers marks a satisfying return to form for director Alexander Payne.",
    "date": "2024-12-30", 
    "price": 200, 
    "seatsAvailable": 18,
    "image": "https://lh3.googleusercontent.com/d/1pO3g72ClZBVL0gPS4hkgGFgugstaRQcw=s220?authuser=0",
    "year": 2023,
    "rating": 92
  },
  { 
    "id": 4, 
    "title": "Tangerine", 
    "desc": "Tangerine shatters casting conventions and its filmmaking techniques are up-to-the-minute, but it's an old-fashioned comedy at heart -- and a pretty wonderful one at that.",
    "date": "2024-12-31", 
    "price": 200, 
    "seatsAvailable": 25,
    "image": "https://lh3.googleusercontent.com/d/1Ja_Wydrt9kGf5Xp_iCTAn_TXtu9sJQQ2=s220?authuser=0",
    "year": 2015,
    "rating": 75
  },
  { 
  "id": 5, 
  "title": "Miracle on 34th Street", 
  "desc": "Irrefutable proof that gentle sentimentalism can be the chief ingredient in a wonderful film, Miracle on 34th Street delivers a warm holiday message without resorting to treacle.",
  "date": "2024-12-28", 
  "price": 150, 
  "seatsAvailable": 12,
  "image": "https://lh3.googleusercontent.com/d/1akI_efs51HB21yFoqNtP_LcSUL8N4Q2l=s220?authuser=0",
  "year": 1947,
  "rating": 87
},
{ 
  "id": 6, 
  "title": "Little Women (2019)", 
  "desc": "With a stellar cast and a smart, sensitive retelling of its classic source material, Greta Gerwig's Little Women proves some stories truly are timeless.",
  "date": "2024-12-29", 
  "price": 150, 
  "seatsAvailable": 15,
  "image": "https://lh3.googleusercontent.com/d/1WVq91eqW-KSXnOeFNbDTeo25Ry7sU8kQ=s220?authuser=0",
  "year": 2019,
  "rating": 92
},
{ 
  "id": 7, 
  "title": "Tim Burton's The Nightmare Before Christmas", 
  "desc": "The Nightmare Before Christmas is a stunningly original and visually delightful work of stop-motion animation.",
  "date": "2024-12-30", 
  "price": 200, 
  "seatsAvailable": 10,
  "image": "https://lh3.googleusercontent.com/d/19OSO_uwfcml15CZnF39WwESqYjoYygVs=s220?authuser=0",
  "year": 1993,
  "rating": 92
},
{ 
  "id": 8, 
  "title": "Klaus", 
  "desc": "Beautiful hand-drawn animation and a humorous, heartwarming narrative make Klaus an instant candidate for holiday classic status.",
  "date": "2024-12-31", 
  "price": 200, 
  "seatsAvailable": 8,
  "image": "https://lh3.googleusercontent.com/d/1kyJEg2MnU5sY1jSY70Bbjycnm8TFGt-q=s220?authuser=0",
  "year": 2019,
  "rating": 96
},
{ 
  "id": 9, 
  "title": "Carol", 
  "desc": "Shaped by Todd Haynes' deft direction and powered by a strong cast led by Cate Blanchett and Rooney Mara, Carol lives up to its groundbreaking source material.",
  "date": "2024-12-28", 
  "price": 150, 
  "seatsAvailable": 20,
  "image": "https://lh3.googleusercontent.com/d/1Baf1Mu9J8bl5zs2Cyj3jDS1vtEjjzb-a=s220?authuser=0",
  "year": 2015,
  "rating": 75
},
{ 
  "id": 10, 
  "title": "It's a Wonderful Life", 
  "desc": "The holiday classic to define all holiday classics, It's a Wonderful Life is one of a handful of films worth an annual viewing.",
  "date": "2024-12-29", 
  "price": 150, 
  "seatsAvailable": 25,
  "image": "https://lh3.googleusercontent.com/d/19ogjuimlagWUPWe584hf0FXkTnOYG59M=s220?authuser=0",
  "year": 1946,
  "rating": 95
},
{ 
  "id": 11, 
  "title": "Die Hard", 
  "desc": "Its many imitators (and sequels) have never come close to matching the taut thrills of the definitive holiday action classic.",
  "date": "2024-12-30", 
  "price": 200, 
  "seatsAvailable": 18,
  "image": "https://lh3.googleusercontent.com/d/1XNumjiOcPUxUBkxDAU3BXvzB9uT62VBn=s220?authuser=0",
  "year": 1988,
  "rating": 94
},
{ 
  "id": 12, 
  "title": "The Guardians of the Galaxy Holiday Special", 
  "desc": "More of a stocking stuffer than a fully-rounded parcel, this yuletide excursion is a delightful showcase for Drax, Mantis, and a very game Kevin Bacon.",
  "date": "2024-12-31", 
  "price": 200, 
  "seatsAvailable": 10,
  "image": "https://lh3.googleusercontent.com/d/15IgqX4CXmfR2DPNYsvMARsR0j8gHiuZw=s220?authuser=0",
  "year": 2022,
  "rating": 81
},
{ 
  "id": 13, 
  "title": "The Apartment", 
  "desc": "Director Billy Wilder's customary cynicism is leavened here by tender humor, romance, and genuine pathos.",
  "date": "2024-12-28", 
  "price": 150, 
  "seatsAvailable": 20,
  "image": "https://lh3.googleusercontent.com/d/15HF47ttnrF_QEgut084za2H0GAaYo7dG=s220?authuser=0",
  "year": 1960,
  "rating": 94
},
{ 
  "id": 14, 
  "title": "Little Women (1994)", 
  "desc": "Thanks to a powerhouse lineup of talented actresses, Gillian Armstrong's take on Louisa May Alcott's Little Women proves that a timeless story can succeed no matter how many times it's told.",
  "date": "2024-12-29", 
  "price": 150, 
  "seatsAvailable": 15,
  "image": "https://lh3.googleusercontent.com/d/13wiJhTMtvJT3cvLtqZJDu0-TCdzdRYzK=s220?authuser=0",
  "year": 1994,
  "rating": 84
},
{ 
  "id": 15, 
  "title": "Arthur Christmas", 
  "desc": "Aardman Animations broadens their humor a bit for Arthur Christmas, a clever and earnest holiday film with surprising emotional strength.",
  "date": "2024-12-30", 
  "price": 200, 
  "seatsAvailable": 12,
  "image": "https://lh3.googleusercontent.com/d/1URuylV4nNP6sAb1sUr8MJRlrwrjImGkn=s220?authuser=0",
  "year": 2011,
  "rating": 77
},
{ 
  "id": 16, 
  "title": "Tokyo Godfathers", 
  "desc": "Beautiful and substantive, Tokyo Godfathers adds a moving -- and somewhat unconventional -- entry to the animated Christmas canon.",
  "date": "2024-12-31", 
  "price": 200, 
  "seatsAvailable": 8,
  "image": "https://lh3.googleusercontent.com/d/1W21y_Gm3hjlsD2VCB2jz-0uQkB3e7LwC=s220?authuser=0",
  "year": 2003,
  "rating": 91
},
{ 
  "id": 17, 
  "title": "Jingle Jangle: A Christmas Journey", 
  "desc": "Jingle Jangle: A Christmas Journey celebrates the yuletide season with a holiday adventure whose exuberant spirit is matched by its uplifting message.",
  "date": "2024-12-28", 
  "price": 150, 
  "seatsAvailable": 22,
  "image": "https://lh3.googleusercontent.com/d/1iaobaD-4xB-oGKrm70ZonM4TO91DW_Le=s220?authuser=0",
  "year": 2020,
  "rating": 69
},
{ 
  "id": 18, 
  "title": "Edward Scissorhands", 
  "desc": "The first collaboration between Johnny Depp and Tim Burton, Edward Scissorhands is a magical modern fairy tale with gothic overtones and a sweet center.",
  "date": "2024-12-29", 
  "price": 150, 
  "seatsAvailable": 18,
  "image": "https://lh3.googleusercontent.com/d/1iD7sWvxCh27YhjqZuB25Wy3qM3r5arGo=s220?authuser=0",
  "year": 1990,
  "rating": 91
},
{ 
  "id": 19, 
  "title": "Rare Exports: A Christmas Tale", 
  "desc": "Rare Exports is an unexpectedly delightful crossbreed of deadpan comedy and Christmas horror.",
  "date": "2024-12-30", 
  "price": 200, 
  "seatsAvailable": 16,
  "image": "https://lh3.googleusercontent.com/d/1aYPX6uux3-39bwUdpQr5HgRKt9C6pstE=s220?authuser=0",
  "year": 2010,
  "rating": 70
},
{ 
  "id": 20, 
  "title": "A Christmas Story", 
  "desc": "Both warmly nostalgic and darkly humorous, A Christmas Story deserves its status as a holiday perennial.",
  "date": "2024-12-31", 
  "price": 200, 
  "seatsAvailable": 25,
  "image": "https://lh3.googleusercontent.com/d/1go7-2L3zM6nH-iy6wz33FHRr-hJBfWU4=s220?authuser=0",
  "year": 1983,
  "rating": 89
},
{ 
  "id": 21, 
  "title": "Better Watch Out", 
  "desc": "Carried by its charismatic young cast, Better Watch Out is an adorably sinister holiday horror film.",
  "date": "2024-12-28", 
  "price": 150, 
  "seatsAvailable": 10,
  "image": "https://lh3.googleusercontent.com/d/1kRd__Y7C5DSbodEpQIAw3lzklez7mf5B=s220?authuser=0",
  "year": 2016,
  "rating": 64
}
];

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});