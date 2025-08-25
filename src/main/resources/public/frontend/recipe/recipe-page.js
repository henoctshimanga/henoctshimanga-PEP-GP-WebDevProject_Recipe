/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addNameInput = document.getElementById("add-recipe-name-input");
    const addInstructionsInput = document.getElementById("add-recipe-instructions-input");

    const updateNameInput = document.getElementById("update-recipe-name-input");
    const updateInstructionsInput = document.getElementById("update-recipe-instructions-input");

    const deleteNameInput = document.getElementById("delete-recipe-name-input");

    const recipeListContainer = document.getElementById("recipe-list");

    const searchInput = document.getElementById("search-input");

    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");

    const addButton = document.getElementById("add-recipe-submit-input");
    const updateButton = document.getElementById("update-recipe-submit-input");
    const deleteButton = document.getElementById("delete-recipe-submit-input");
    const searchButton = document.getElementById("search-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */

    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */

    addButton.addEventListener("click", addRecipe);
    updateButton.addEventListener("click", updateRecipe);
    deleteButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            refreshRecipeList();
            return;
        }

        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm)
        );

        refreshRecipeList(filteredRecipes);
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addNameInput.value.trim();
        const instructions = addInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Please enter both name and instructions.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({ name, instructions })
            });

            if (response.status === 201) {
                addNameInput.value = "";
                addInstructionsInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to add recipe.");
            }
        } catch (err) {
            console.error(err);
            alert("Error while adding recipe.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateNameInput.value.trim();
        const instructions = updateInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Please provide recipe name and new instructions.");
            return;
        }

        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());

        if (!recipe) {
            alert("Recipe not found.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({ instructions })
            });

            if (response.ok) {
                updateNameInput.value = "";
                updateInstructionsInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to update recipe.");
            }
        } catch (err) {
            console.error(err);
            alert("Error while updating recipe.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteNameInput.value.trim();

        if (!name) {
            alert("Please enter recipe name to delete.");
            return;
        }

        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());

        if (!recipe) {
            alert("Recipe not found.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });

            if (response.ok) {
                deleteNameInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to delete recipe.");
            }
        } catch (err) {
            console.error(err);
            alert("Error while deleting recipe.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch recipes.");
            }

            recipes = await response.json();
            refreshRecipeList();
        } catch (err) {
            console.error(err);
            alert("Could not load recipes.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(customList = recipes) {
        // Implement refresh logic here
        recipeListContainer.innerHTML = "";

        customList.forEach(recipe => {
            const li = document.createElement("li");
            const title = document.createElement("h3");
            const instructions = document.createElement("p");

            title.textContent = recipe.name;
            instructions.textContent = recipe.instructions;

            li.appendChild(title);
            li.appendChild(instructions);
            recipeListContainer.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });

            sessionStorage.clear();
            window.location.href = "../login/login-page.html";

        } catch (err) {
            console.error(err);
            alert("Logout failed.");
        }
    }

});
