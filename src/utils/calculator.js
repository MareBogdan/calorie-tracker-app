export function calculateCalories(sex, age, height, weight, activityLevel) {
    let bmr = 0;
  
    if (sex === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (sex === 'female') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  
    const tdee = bmr * activityLevel;
    return tdee;
  }
  