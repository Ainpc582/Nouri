import anthropic

client = anthropic.Anthropic()
system_prompt = """
You are a healthy recipe assistant. When given ingredients or a meal request, you will:
1. Generate a healthy recipe with a title
2. List the ingredients with amounts
3. Provide step by step cooking instructions
4. Always end with exact macros in this exact format:

MACROS:
Calories: [number]
Protein: [number]g
Carbohydrates: [number]g
Fat: [number]g
"""
def get_recipe(user_request):
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_request}
        ]
    )
    return response.content[0].text


def extract_macros(recipe_text):
    macros = {}
    lines = recipe_text.split("\n")
    
    for line in lines:
        if "Calories:" in line:
            macros["calories"] = line.split(":")[1].strip()
        if "Protein:" in line:
            macros["protein"] = line.split(":")[1].strip()
        if "Carbohydrates:" in line:
            macros["carbs"] = line.split(":")[1].strip()
        if "Fat:" in line:
            macros["fat"] = line.split(":")[1].strip()
    
    return macros


def fridge_mode():
    user_ingredients = input("\nEnter your ingredients (e.g. chicken, rice, broccoli): ")
    return f"Create a healthy recipe using these ingredients: {user_ingredients}"

def calorie_mode():
    user_calories = input("\nEnter your desired meal calories")
    return f"Create a healthy recipe with {user_calories} calories"

def custom_macro_mode():
    user_calories = input("\nEnter your desired meal calories. (enter 'NA' if indifferent)")
    user_protein = input("\nEnter your desired meal protein. (enter 'NA' if indifferent)")
    user_carbs = input("\nEnter your desired meal Carbohydrates. (enter 'NA' if indifferent)")
    user_fats = input("\nEnter your desired meal fats. (enter 'NA' if indifferent)")
    return f"Create a healthy recipe with {user_calories} calories, {user_protein} g protein, {user_carbs} g carbohydrates, {user_fats} g fats. (If macro reads NA, then user is indifferent towards the macro element.)"

def free_mode():
    user_request = input("\nEnter your desired dish name.")
    return f"Create a healthy {user_request} receipe."
def get_mode_prompt(mode):
    if mode == "1":
        return fridge_mode()
    elif mode == "2":
        return calorie_mode()
    elif mode == "3":
        return custom_macro_mode()
    elif mode == "4":
        return free_mode()

def post_recipe_menu(current_mode, current_prompt):
    choice = input("""
What would you like to do next?
1. Generate another recipe in this mode
2. Suggest a dish name instead
3. Go back to mode selection
4. Quit
""")
    
    if choice == "1":
        return "same_mode", current_prompt
    elif choice == "2":
        dish_name = input("\nEnter a dish name: ")
        combined_prompt = f"{current_prompt} Make it a {dish_name}."
        return "same_mode", combined_prompt
        
    elif choice == "3":
        return "mode_select", None
    elif choice == "4":
        print("Goodbye!")
        exit()
    else:
        print("Invalid choice.")
        return post_recipe_menu(current_mode, current_prompt)
def main():
    print("Healthy Recipe Builder")
    print("----------------------")
    
    while True:
        mode = input("""
Select a mode (enter a number):
1. Fridge Mode      - generate a recipe from ingredients you have
2. Calorie Mode     - hit a specific calorie target
3. Custom Macros    - set your own macro targets
4. Free Mode        - enter any dish name

Enter 'quit' to exit
""")
        
        if mode.lower() == "quit":
            print("Goodbye!")
            break
        elif mode == "1":
            current_prompt = fridge_mode()
        elif mode == "2":
            current_prompt = calorie_mode()
        elif mode == "3":
            current_prompt = custom_macro_mode()
        elif mode == "4":
            current_prompt = free_mode()
        else:
            print("Invalid choice. Please enter 1, 2, 3, or 4.")
            continue
        
        while True:
            recipe = get_recipe(current_prompt)
            print("\n" + recipe)
            extract_macros(recipe)
            
            action, current_prompt = post_recipe_menu(mode, current_prompt)
            
            if action == "mode_select":
                break
            elif action == "same_mode":
                pass

if __name__ == "__main__":
    main()