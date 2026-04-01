const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchRecipes(ingredients) {
  try {

    const allResults = await Promise.all(
      ingredients.map(async (ingredient) => {
        const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient.trim()}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.meals || [];
      })
    );

    if (allResults.some((list) => list.length === 0)) {
      return [];
    }

    const firstList = allResults[0];
    const intersection = firstList.filter((meal) =>
      allResults.every((list) =>
        list.some((m) => m.idMeal === meal.idMeal)
      )
    );

    if (intersection.length === 0) {
      return [];
    }

    const limitedMeals = intersection.slice(0, 12);

    const detailedMeals = await Promise.all(
      limitedMeals.map(async (meal) => {
        const response = await fetch(`${BASE_URL}/lookup.php?i=${meal.idMeal}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
      })
    );

    const recipes = detailedMeals
      .filter((meal) => meal !== null)
      .filter((meal) => {
        const recipeIngredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.trim()) {
            recipeIngredients.push(ing.toLowerCase());
          }
        }

        return ingredients.every((entered) =>
          recipeIngredients.some((recipeIng) =>
            recipeIng.includes(entered.toLowerCase())
          )
        );
      })
      .map((meal) => {
        const isVeg = meal.strCategory?.toLowerCase() === "vegetarian";

        return {
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          category: meal.strCategory,
          area: meal.strArea,          
          vegetarian: isVeg,
        };
      });

    return recipes;

  } catch (err) {
    console.error("API Error:", err);
    return { error: "Something went wrong. Check your internet connection." };
  }
}

export async function getRecipeDetails(id) {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) return null;

    const meal = data.meals[0];

    
    const extendedIngredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        extendedIngredients.push({
          id: i,
          original: `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim(),
        });
      }
    }

  
    const rawInstructions = meal.strInstructions || "";
    const stepTexts = rawInstructions
      .split(/\r\n|\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const analyzedInstructions = [
      {
        steps: stepTexts.map((text, index) => ({
          number: index + 1,
          step: text,
        })),
      },
    ];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      extendedIngredients,
      analyzedInstructions,
      instructions: rawInstructions,
    };

  } catch (err) {
    console.error("Details fetch error:", err);
    return null;
  }
}