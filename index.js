var searchFoodList = [];
var favFoodlist = JSON.parse(localStorage.getItem("favItem")) || [];
var inputBox = document.getElementsByClassName("input-box")[0];
var foodParentbox = document.getElementsByClassName("food-container")[0];
var favFoodParent=document.getElementsByClassName('fav-box-container')[0];
var showFoodDetail = document.getElementsByClassName("show-more-details")[0];
var favFoodBox = document.getElementsByClassName("fav-food-box")[0];

// used to show food item based on user search-

function showSearchFoodItem(food) {
  const showBox = document.createElement("div");
  showBox.classList.add("food-box");
  showBox.innerHTML = `	
	    <img class="image1" id="${food.idMeal}" src="${food.strMealThumb}" alt="">
	    <div id="${food.idMeal}" class="food-title">${food.strMeal}</div>
	    <button class="fav-btn" data-id="${food.idMeal}" >Add Favorite</button>	
	`;
  foodParentbox.append(showBox);
}

// on click more Detail btn show all details of food

var foodBoxParent = document.getElementById("food-details-parent");
function showFoodDetailPage(food) {
  const foodBox = document.createElement("div");
  foodBox.innerHTML = `
	    <p class>${food.strMeal}</p>
	    <div class='image-box'><img class="food-image" src="${food.strMealThumb}" alt=""></div>

	`;
  showFoodDetail.append(foodBox);
}

// add food item to its FavoriteList

function addToFavoriteList(foodId) {
  let isFoodAlreadyPresent = favFoodlist.filter((food) => {
    return food.idMeal === foodId;
  });
  if (isFoodAlreadyPresent && isFoodAlreadyPresent.length > 0) {
    alert("food is already present");
    return;
  }
  let favfood = searchFoodList.filter(function (food) {
    return food.idMeal === foodId;
  });
  if (favfood && favfood.length > 0) {
    alert("food is successfully added");
    favFoodlist.push(favfood[0]);
  }
  localStorage.setItem("favItem", JSON.stringify(favFoodlist));
}

//rendered the food list

function rerenderedThefavfoodList(){
  
}

// to detele a fod item

function deleteFoodItem(Mealid) {
  console.log('i am in delete function');
  console.log('Mealid###---',Mealid);
     var newArray=favFoodlist.filter(function(food){
       return food.idMeal!==Mealid;
     });
     console.log('newArray###--',newArray);
     localStorage.setItem('favItem' , JSON.stringify(newArray));
     favFoodBox.innerHTML='';
     for (let i = 0; i < newArray.length; i++) {
      console.log("hello");
      showFavFoodList(favFoodlist[i]);
    }
     //localStorage.clear();
    // newArray.forEach(showFavFoodList);

}

//to show favorite Food list

function showFavFoodList(food) {
  var showFav = document.createElement("div");
  showFav.classList.add("favBox");
  showFav.innerHTML = `  
       <img class="image1"  src="${food.strMealThumb}" alt="">
       <div  class="fav-food-title">${food.strMeal}</div>
       <button class="detail-btn "  data-id="${food.idMeal}">More Details</button>	
       <button class="remove-btn"  data-id="${food.idMeal}">Remove</button>	  
   `;   
  favFoodBox.append(showFav);
}

//fetch the meal data from API
async function fetchMeal(name) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`
  );
  let data = await response.json();
  let meal = data.meals.filter((ele) => {
    return ele.strMeal.includes(name);
  });
  searchFoodList = meal;
  if (meal && meal.length > 0) {
    for (let i = 0; i < meal.length; i++) {
      showSearchFoodItem(meal[i]);
    }
  } else {
    alert("This item is currently not Available");
  }
}


//fetch meal details from the api

async function fetchMealDetail(foodId){
  console.log('i am in fetch meal Detail function');
  let response=await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`
  );
  let data=await response.json();
  console.log(data.meals[0]);
  showFoodDetailPage(data.meals[0])
}


function handleClickEvent(e) {
  let element = e.target;
  console.log(element);
  if (element.className === "search-btn") {
    foodParentbox.innerHTML = "";
    favFoodBox.style.display = "none";
    var value = inputBox.value;
    inputBox.value = "";
    console.log('')
    fetchMeal(value);
  } else if (element.className === "fav-btn") {
    let foodId = element.dataset.id;
    addToFavoriteList(foodId);
  } else if (element.id === "fav-list") {
    favFoodParent.style.display = "block";
    if (favFoodlist && favFoodlist.length > 0) {
      foodParentbox.innerHTML = "";
      favFoodBox.innerHTML = "";
      console.log("favFoodlist##", favFoodlist);
      for (let i = 0; i < favFoodlist.length; i++) {
        console.log("hello");
        showFavFoodList(favFoodlist[i]);
      }
    }
  } else if (element.className === "remove-btn") {
    let mealId=element.dataset.id;
    console.log('mealId###---',mealId);
   deleteFoodItem(mealId);
  }
  else if(element.id === "detail-btn"){
    console.log('detail-btn is clicked');
    showFoodDetail.style.display= 'block';
    favFoodParent.style.display = "none";
    let mealId=element.dataset.id;
    fetchMealDetail(mealId);
  }
}

document.addEventListener("click", handleClickEvent);
