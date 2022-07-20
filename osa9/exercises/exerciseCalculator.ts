interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  values: number[];
  target: number;
}

const parseArgumentsExercise = (args: Array<string>): ExerciseValues=> {
  if (args.length < 4) throw new Error('Not enough arguments');
  let valuesArray = [];
  for (let i = 3; i < args.length; i++) {
    if (!isNaN(Number(args[i]))) {
      valuesArray.push(Number(args[i]));
    } else {
      throw new Error('Provided values were not numbers!')
    }
  }
  if (!isNaN(Number(args[2]))) {
    return {
      values: valuesArray,
      target: Number(args[2])
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

const calculateExercise = (exerciseHours: number[], target:number): ExerciseResults => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(a => a > 0).length;
  const average = exerciseHours.reduce((x, y) => x + y, 0) / periodLength;
  const success = target < average;
  let rating, ratingDescription;
  let averageRounded = Math.round(average * 10) / 10;
  if (target > averageRounded) {
    rating = 1;
    ratingDescription = `Not good, you didn't reach the target this week, step up for next week!`;
  } else if (target === averageRounded) {
    rating = 2;
    ratingDescription = `Good, you reached the target this week, but you can still do better next week!`;
  } else if (target < averageRounded) {
    rating = 3;
    ratingDescription = `Excellent, you did excercise more than the target this week, great job! But remember the importance of rest aswell.`;
  }
  return {
    periodLength, trainingDays, success, rating, ratingDescription, target, average
  };
}

try {
  const { values, target } = parseArgumentsExercise(process.argv);
  console.log(calculateExercise(values, target))
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' ERROR: ' + error.message;
  }
  console.log(errorMessage);
}