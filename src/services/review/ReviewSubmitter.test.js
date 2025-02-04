import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/movie/reviews', (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Invalid review data' });
  }
  return res.status(201).json(req.body);
});

describe('ReviewSubmitter', () => {
  test('should submit review successfully', async () => {
    const reviewData = {
      data: {
        comment: 'Great movie!',
        rating: 5,
      },
    };

    const response = await request(app)
      .post('/movie/reviews')
      .send(reviewData)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toEqual(reviewData);
  });

  test('should handle invalid review data', async () => {
    await request(app)
      .post('/movie/reviews')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe('Invalid review data');
      });
  });
});
