from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recipe_builder import get_recipe, extract_macros
import anthropic
import base64

app = FastAPI()
client = anthropic.Anthropic()

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
    dietary_prefs: list = []
    servings: str = "1"

@app.post("/recipe")
def create_recipe(request: RecipeRequest):
    dietary = f" ({', '.join(request.dietary_prefs)})" if request.dietary_prefs else ""
    servings = f" for {request.servings} serving(s)" if request.servings != "1" else ""

    if request.mode == "1":
        prompt = f"Create a healthy{dietary} recipe{servings} using these ingredients: {request.ingredients}"
    elif request.mode == "2":
        if request.dish_name:
            prompt = f"Create a healthy{dietary} {request.dish_name} recipe{servings} with {request.calories} calories"
        else:
            prompt = f"Create a healthy{dietary} recipe{servings} with {request.calories} calories"
    elif request.mode == "3":
        prompt = f"Create a healthy{dietary} recipe{servings} with {request.calories} calories, {request.protein}g protein, {request.carbs}g carbohydrates, {request.fat}g fat"
    elif request.mode == "4":
        prompt = f"Create a healthy{dietary} {request.dish_name} recipe{servings}"

    recipe = get_recipe(prompt)
    macros = extract_macros(recipe)

    return {
        "recipe": recipe,
        "macros": macros
    }

@app.post("/analyze-fridge")
async def analyze_fridge(file: UploadFile = File(...)):
    contents = await file.read()
    image_data = base64.standard_b64encode(contents).decode("utf-8")

    validation = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=10,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": file.content_type,
                        "data": image_data,
                    }
                },
                {
                    "type": "text",
                    "text": "Does this image show food, ingredients, or a fridge/pantry with food items? Reply only YES or NO."
                }
            ]
        }]
    )

    if "NO" in validation.content[0].text.upper():
        return {"error": "The image you uploaded doesn't appear to show a fridge or food ingredients. Please take a photo of your fridge, pantry, or the ingredients you have available."}

    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": file.content_type,
                        "data": image_data,
                    }
                },
                {
                    "type": "text",
                    "text": "List all the food ingredients you can see in this image. Return only a comma-separated list of ingredients, nothing else."
                }
            ]
        }]
    )

    return {"ingredients": response.content[0].text}
