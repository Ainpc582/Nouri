from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recipe_builder import get_recipe, extract_macros

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Recipe Builder API is running"}

class RecipeRequest(BaseModel):
    mode: str
    ingredients: str = ""
    calories: str = ""
    protein: str = ""
    carbs: str = ""
    fat: str = ""
    dish_name: str = ""

@app.post("/recipe")
def create_recipe(request: RecipeRequest):
    if request.mode == "1":
        prompt = f"Create a healthy recipe using these ingredients: {request.ingredients}"
    elif request.mode == "2":
        if request.dish_name:
            prompt = f"Create a healthy {request.dish_name} recipe with {request.calories} calories"
        else:
            prompt = f"Create a healthy recipe with {request.calories} calories"
    elif request.mode == "3":
        prompt = f"Create a healthy recipe with {request.calories} calories, {request.protein}g protein, {request.carbs}g carbohydrates, {request.fat}g fat"
    elif request.mode == "4":
        prompt = f"Create a healthy {request.dish_name} recipe"

    recipe = get_recipe(prompt)
    macros = extract_macros(recipe)

    return {
        "recipe": recipe,
        "macros": macros
    }
