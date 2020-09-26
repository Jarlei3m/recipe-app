const meals = document.getElementById('meals');

getRandomMeal();

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    console.log(randomMeal);

    addMeal(randomMeal, true)
};

async function getMealById(id) {
    const meal = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
};

async function getMealsBySearch(term) {
    const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);
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
    
    const favoriteBtn = meal.querySelector('.meal-body .fav-btn .material-icons')
    
    favoriteBtn.addEventListener('click', (e) => {
        if (favoriteBtn.innerHTML === "favorite_border") {
            favoriteBtn.innerText = "favorite";

            addMealLS(mealData);
        } else {
            favoriteBtn.innerText = "favorite_border";
            // meals.removeChild(meal);
        }
    })

    meals.appendChild(meal);
}

function addMealLS(chosenMeal) {
    const favoriteList = document.querySelector('.fav-container ul');
    const favoriteRecipe = document.querySelectorAll('.fav-container ul li');
    console.log(favoriteList)
    let allFavorited = new Array;
    i = 0;

    favoriteRecipe.forEach(element => {
        allFavorited[i] = element.id;
        i++
    });

    const notFavorited = allFavorited.every(id => id != chosenMeal.idMeal)
    
    if(notFavorited) {
        favoriteList.innerHTML += `
            <li id=${chosenMeal.idMeal}>
                <img src="${chosenMeal.strMealThumb}">
                <span>${chosenMeal.strMeal}</span>
            </li>
        `;

        allFavorited = chosenMeal.idMeal;
    } else {
        alert("Removing recipe from favorite list")

        const mealId = allFavorited.indexOf(chosenMeal.idMeal)

        allFavorited.splice(mealId)
    }
        
};

    

function getMealFromLS() {

}