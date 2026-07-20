import { useState } from "react";

function App() {
  const [dietaryPrefs, setDietaryPrefs] = useState([]);
  const [mode, setMode] = useState("1");
  const [ingredients, setIngredients] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [dishName, setDishName] = useState("");
  const [recipe, setRecipe] = useState("");
  const [macros, setMacros] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (mode === "1" && !ingredients.trim()) {
      setError("Please enter your ingredients.");
      return;
    }
    if (mode === "2" && !calories.trim()) {
      setError("Please enter a calorie target.");
      return;
    }
    if (mode === "4" && !dishName.trim()) {
      setError("Please enter a dish name.");
      return;
    }

    setError("");
    setLoading(true);
    setRecipe("");
    setMacros(null);

    try {
      const response = await fetch(
        "https://nouri-production-ed93.up.railway.app/recipe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            ingredients,
            calories,
            protein,
            carbs,
            fat,
            dish_name: dishName,
            dietary_prefs: dietaryPrefs,
          }),
        }
      );
      const data = await response.json();
      setRecipe(data.recipe);
      setMacros(data.macros);
    } catch (err) {
      setError(
        "Something went wrong. Make sure the backend server is running."
      );
    }

    setLoading(false);
  };
  const togglePref = (pref) => {
    setDietaryPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };
  const formatRecipe = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# "))
        return (
          <h1
            key={i}
            style={{
              fontSize: "28px",
              fontWeight: "700",
              margin: "0 0 16px 0",
              color: "#1a1a1a",
            }}
          >
            {line.replace("# ", "")}
          </h1>
        );
      if (line.startsWith("## "))
        return (
          <h2
            key={i}
            style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "24px 0 8px 0",
              color: "#1a1a1a",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {line.replace("## ", "")}
          </h2>
        );
      if (line.startsWith("- "))
        return (
          <li
            key={i}
            style={{ margin: "4px 0", color: "#444", lineHeight: "1.6" }}
          >
            {line.replace("- ", "")}
          </li>
        );
      if (line.match(/^\d+\./))
        return (
          <li
            key={i}
            style={{ margin: "8px 0", color: "#444", lineHeight: "1.6" }}
          >
            {line}
          </li>
        );
      if (line.startsWith("MACROS:")) return null;
      if (
        line.startsWith("Calories:") ||
        line.startsWith("Protein:") ||
        line.startsWith("Carbohydrates:") ||
        line.startsWith("Fat:")
      )
        return null;
      if (line.trim() === "") return <br key={i} />;
      return (
        <p
          key={i}
          style={{ margin: "4px 0", color: "#444", lineHeight: "1.6" }}
        >
          {line}
        </p>
      );
    });
  };

  const modes = [
    {
      value: "1",
      label: "Fridge Mode",
      desc: "Generate a recipe from ingredients you have",
    },
    {
      value: "2",
      label: "Calorie Target",
      desc: "Hit a specific calorie goal",
    },
    { value: "3", label: "Custom Macros", desc: "Set your own macro targets" },
    { value: "4", label: "Free Mode", desc: "Enter any dish name" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        minHeight: "100vh",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <img
          src="/logo.png"
          alt="Nouri"
          style={{ height: "150px", objectFit: "contain" }}
        />
        <p
          style={{
            margin: 0,
            color: "#1a1a1a",
            fontSize: "15px",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            letterSpacing: "0.15em",
          }}
        >
          Eat with intention. Fuel with purpose.
        </p>
      </div>

      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}
      >
        {/* Dietary Preferences */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "12px" }}>
            Dietary Preferences
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto", "High Protein"].map((pref) => (
              <div
                key={pref}
                onClick={() => togglePref(pref)}
                style={{
                  padding: "8px 16px",
                  border: dietaryPrefs.includes(pref) ? "2px solid #1a1a1a" : "2px solid #e0e0e0",
                  borderRadius: "100px",
                  cursor: "pointer",
                  backgroundColor: dietaryPrefs.includes(pref) ? "#1a1a1a" : "#fff",
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: dietaryPrefs.includes(pref) ? "#fff" : "#444",
                  transition: "all 0.15s"
                }}
              >
                {pref}
              </div>
            ))}
          </div>
          <input
            placeholder="Add custom diet (e.g. Paleo, Halal, Kosher)... press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                togglePref(e.target.value.trim());
                e.target.value = "";
              }
            }}
            style={{ marginTop: "10px", width: "100%", padding: "10px", fontSize: "13px", border: "1px solid #e0e0e0", borderRadius: "8px", fontFamily: "sans-serif", boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {/* Mode Selector */}
        <div style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#888",
              marginBottom: "12px",
            }}
          >
            Select Mode
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {modes.map((m) => (
              <div
                key={m.value}
                onClick={() => setMode(m.value)}
                style={{
                  padding: "16px",
                  border:
                    mode === m.value
                      ? "2px solid #1a1a1a"
                      : "2px solid #e0e0e0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: mode === m.value ? "#1a1a1a" : "#fff",
                  transition: "all 0.15s",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "sans-serif",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: mode === m.value ? "#fff" : "#1a1a1a",
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    color: mode === m.value ? "#ccc" : "#888",
                  }}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#888",
              marginBottom: "12px",
            }}
          >
            {mode === "1"
              ? "Your Ingredients"
              : mode === "2"
              ? "Calorie Target"
              : mode === "3"
              ? "Macro Targets"
              : "Dish Name"}
          </p>

          {mode === "1" && (
            <input
              placeholder="e.g. chicken, rice, broccoli, garlic"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "15px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontFamily: "sans-serif",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          )}
          {mode === "2" && (
            <div>
              <input
                placeholder="e.g. 500"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontFamily: "sans-serif",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <input
                placeholder="Suggest a dish name (optional)"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontFamily: "sans-serif",
                  boxSizing: "border-box",
                  outline: "none",
                  marginTop: "12px",
                }}
              />
            </div>
          )}
          {mode === "3" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                ["Calories", calories, setCalories],
                ["Protein (g)", protein, setProtein],
                ["Carbs (g)", carbs, setCarbs],
                ["Fat (g)", fat, setFat],
              ].map(([label, val, setter]) => (
                <div key={label}>
                  <p
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      color: "#888",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {label}
                  </p>
                  <input
                    placeholder="NA if indifferent"
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "sans-serif",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {mode === "4" && (
            <input
              placeholder="e.g. Chicken Tikka Masala"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "15px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontFamily: "sans-serif",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          )}
        </div>

        {error && (
          <p
            style={{
              color: "#c0392b",
              fontFamily: "sans-serif",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: loading ? "#888" : "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontFamily: "sans-serif",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
          }}
        >
          {loading ? "Generating your recipe..." : "Generate Recipe"}
        </button>

        {/* Macros Card */}
        {macros && (
          <div
            style={{
              marginTop: "40px",
              padding: "24px",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#888",
                margin: "0 0 16px 0",
              }}
            >
              Nutrition Per Serving
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                ["Calories", macros.calories],
                ["Protein", macros.protein],
                ["Carbs", macros.carbs],
                ["Fat", macros.fat],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    backgroundColor: "#fafafa",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#1a1a1a",
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontFamily: "sans-serif",
                      fontSize: "11px",
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Card */}
        {recipe && (
          <div
            style={{
              marginTop: "24px",
              padding: "40px",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            {formatRecipe(recipe)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e0e0e0", padding: "24px", textAlign: "center", marginTop: "48px" }}>
        <a href="/privacy" style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888", textDecoration: "none" }}>Privacy Policy</a>
        <span style={{ color: "#e0e0e0", margin: "0 12px" }}>|</span>
        <a href="/terms" style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888", textDecoration: "none" }}>Terms of Service</a>
        <span style={{ color: "#e0e0e0", margin: "0 12px" }}>|</span>
        <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888" }}>© 2026 Nouri</span>
      </div>
    </div>
  );
}

export default App;
