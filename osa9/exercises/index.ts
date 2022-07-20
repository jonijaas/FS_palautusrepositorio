import express from 'express';
const app = express();
app.use(express.json());

import { calculateBmi } from './bmiCalculator';
import { calculateExercise } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = req.query.weight;
  const height = req.query.height;
  if (isNaN(Number(weight)) || isNaN(Number(height))) {
    res.status(400).send({
      error: 'malformatted parameters'
    });
  }

  const bmi = calculateBmi(Number(height), Number(weight));
  res.send({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({
      error: 'parameters missing'
    });
  }

  if (Array.isArray(daily_exercises)) {
    for (let i = 0; i < daily_exercises.length; i++) {
      if (isNaN(Number(daily_exercises[i]))) {
        return res.status(400).send({
          error: 'malformatted parameters'
        });
      }
    }
  } else {
    return res.status(400).send({
      error: 'malformatted parameters'
    });
  }

  if (isNaN(Number(target))) {
    return res.status(400).send({
      error: 'malformatted parameters'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercise(daily_exercises, Number(target));
  return res.send(result);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});