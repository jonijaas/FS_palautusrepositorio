interface BmiValues {
  height: number;
  weight: number;
}

const parseArgumentsBmi = (args: Array<string>): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

const calculateBmi = (h: number, w: number): string => {
  let bmi = w / ((h / 100) * (h / 100));

  if (bmi < 16) {
    return 'Underweight (Severe thinness)';
  } else if (bmi < 17) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi < 18.5) {
    return 'Underweight (Mild thinness';
  } else if (bmi < 25) {
    return 'Normal (Healthy weight)';
  } else if (bmi < 30) {
    return 'Overweight (Pre-obese)';
  } else if (bmi < 35) {
    return 'Obese (Class 1)';
  } else if (bmi < 40) {
    return 'Obese (Class 2)';
  } else if (bmi >= 40){
    return 'Obese (Class 3)';
  }
  return 'Something went wrong, unable to calculate bmi!';
}

try {
  const { height, weight } = parseArgumentsBmi(process.argv);
  console.log(calculateBmi(height, weight))
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' ERROR: ' + error.message;
  }

  console.log(errorMessage);
}