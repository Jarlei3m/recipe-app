const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

const mealPopup = document.getElementById('meal-popup');
const closePopupBtn = document.getElementById('close-popup');

const mealInfoEl = document.getElementById('meal-info');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true)
};

async function getMealById(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    
    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;

};

async function getMealsBySearch(term) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
};

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
        ${random ? `
            <span class="random">
                Random Recipe
            </span>
            ` : ''}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="material-icons">favorite_border</i>
            </button>
        </div>
    `;
    
    const favoriteBtn = meal.querySelectorAll('.meal-body .fav-btn .material-icons')
    
    favoriteBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.innerHTML === "favorite_border") {
                btn.innerHTML = "favorite";
    
                addMealLS(mealData.idMeal);
            } else {
                btn.innerHTML = "favorite_border";
    
                removeMealLS(mealData.idMeal);
            }
            fetchFavMeals();
        });
    });
    
    const mealImage = meal.querySelectorAll('.meal-header')
    mealImage.forEach(recipe => {
        recipe.addEventListener('click', () => {
            showMealInfo(mealData);
        });
    });

    const randomRecipe = meal.querySelectorAll('.meal-header .random')
    randomRecipe.forEach(recipe => {
        recipe.addEventListener('click', () => {
            location.reload();
        });
    });

    mealsEl.appendChild(meal);
};

function addMealLS(mealId) {
    const mealIds = getMealsLS();
    
    localStorage.setItem("mealIds", JSON.stringify
    ([...mealIds, mealId])
    );
};

function removeMealLS(mealId) {
    //removing favorited element from DOOM tree
    // document.getElementById(mealId).remove();

    const mealIds = getMealsLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => 
    id !== mealId)));
};
    

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
};

async function fetchFavMeals() {
    favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();

    const meals = [];

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        meals.push(meal);

        addMealFav(meal);
    };
};

function addMealFav(mealData) {
    const newFavorite = document.createElement("li");
    const favoriteBtn = document.querySelector('.meal-body .fav-btn .material-icons')
    
    newFavorite.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
        <button class="remove" id="${mealData.idMeal}"><i class="material-icons">close</i></button>
    `;
    
    const removeBtn = newFavorite.querySelectorAll('.remove');

    removeBtn.forEach(recipe => {
        recipe.addEventListener('click', () => {
            favoriteBtn.innerHTML = "favorite_border";
    
            removeMealLS(mealData.idMeal);
    
            fetchFavMeals();
        });
    });

    const mealImage = newFavorite.querySelector('img')
    mealImage.addEventListener('click', () => {
        showMealInfo(mealData);
    });

    favoriteContainer.appendChild(newFavorite);
};

function showMealInfo(mealData) {
    mealInfoEl.innerHTML = "";

    
    // update meal info
    const mealEl = document.createElement('div');

    const ingredients = [];
    // get ingredients and measures
    for(let i=1; i<=20; i++) {
        if(mealData[`strIngredient`+i]) {
            ingredients.push(`${mealData['strIngredient'+i]} - 
            ${mealData['strMeasure'+i]}`
            );
        }else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <p>
            ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(ing => `
                <li>${ing};</li>
            `).join('')}
        </ul>
    `;

    mealInfoEl.appendChild(mealEl);

    mealPopup.classList.remove('hidden')
};

searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML = "";
    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if(meals) {
        meals.forEach(meal => {
            addMeal(meal);
        });
    }
});

closePopupBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden');
})