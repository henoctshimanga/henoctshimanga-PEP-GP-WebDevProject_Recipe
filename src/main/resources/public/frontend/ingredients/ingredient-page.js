/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */


const addIngredientInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

const addButton = document.getElementById("add-ingredient-submit-button");
const deleteButton = document.getElementById("delete-ingredient-submit-button");

addButton.onclick = addIngredient;
deleteButton.onclick = deleteIngredient;

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */

window.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("auth-token");
    const isAdmin = sessionStorage.getItem("is-admin");

    if (!token || isAdmin !== "true") {
        alert("Access denied. Admins only.");
        window.location.href = "../login/login-page.html";
    }

    getIngredients();
});


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */

async function addIngredient() {
    const name = addIngredientInput.value.trim();
    if (!name) return alert("Please enter an ingredient name.");

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify({ name })
        });

        if (response.status === 201) {
            addIngredientInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to add ingredient.");
        }
    } catch (err) {
        console.error(err);
        alert("Error adding ingredient.");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (!response.ok) throw new Error("Failed to fetch ingredients.");

        ingredients = await response.json();
        refreshIngredientList();
    } catch (err) {
        console.error(err);
        alert("Error loading ingredients.");
    }
}
    


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const nameToDelete = deleteIngredientInput.value.trim();
    if (!nameToDelete) return alert("Enter an ingredient name to delete.");

    const ingredientToDelete = ingredients.find(
        (ingredient) => ingredient.name.toLowerCase() === nameToDelete.toLowerCase()
    );

    if (!ingredientToDelete) return alert("Ingredient not found.");

    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredientToDelete.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.ok) {
            deleteIngredientInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient.");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting ingredient.");
    }
    
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient.name;
        ingredientListContainer.appendChild(li);
    });
    
}
