import { useState, useRef } from "react";
import "./App.css";

const BACKEND = "https://nouri-production-ed93.up.railway.app";

function SkeletonRecipe() {
  return (
    <div style={{ marginTop: "24px", padding: "40px", backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px" }}>
      <div className="skeleton" style={{ height: "28px", width: "60%", marginBottom: "24px" }} />
      <div className="skeleton" style={{ height: "14px", width: "20%", marginBottom: "16px" }} />
      {[90, 75, 85, 65, 80].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: "13px", width: `${w}%`, marginBottom: "10px" }} />
      ))}
      <div className="skeleton" style={{ height: "14px", width: "25%", margin: "24px 0 16px 0" }} />
      {[95, 70, 88, 72, 60].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: "13px", width: `${w}%`, marginBottom: "10px" }} />
      ))}
    </div>
  );
}

function App() {
  const [servings, setServings] = useState("1");
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
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const saveRecipe = () => {
    const content = `${recipe}\n\nNutrition Per Serving:\nCalories: ${macros.calories}\nProtein: ${macros.protein}\nCarbs: ${macros.carbs}\nFat: ${macros.fat}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nouri-recipe.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (mode === "1" && !ingredients.trim()) { setError("Please enter your ingredients."); return; }
    if (mode === "2" && !calories.trim()) { setError("Please enter a calorie target."); return; }
    if (mode === "4" && !dishName.trim()) { setError("Please enter a dish name."); return; }

    setError("");
    setLoading(true);
    setRecipe("");
    setMacros(null);

    try {
      const response = await fetch(`${BACKEND}/recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ingredients, calories, protein, carbs, fat, dish_name: dishName, dietary_prefs: dietaryPrefs, servings }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
      setMacros(data.macros);
    } catch {
      setError("Something went wrong. Make sure the backend server is running.");
    }
    setLoading(false);
  };

  const togglePref = (pref) => {
    setDietaryPrefs((prev) => prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]);
  };

  const analyzeImage = async (file) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setAnalyzing(true);
    setIngredients("Analyzing your fridge...");
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${BACKEND}/analyze-fridge`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) {
        setIngredients("");
        setImagePreview(null);
        setError(data.error);
      } else {
        setIngredients(data.ingredients);
      }
    } catch {
      setIngredients("");
      setImagePreview(null);
      setError("Failed to analyze image. Please try again.");
    }
    setAnalyzing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) analyzeImage(file);
  };

  const formatRecipe = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 16px 0", color: "#1a1a1a", fontFamily: "Georgia, serif" }}>{line.replace("# ", "")}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: "13px", fontWeight: "700", margin: "28px 0 10px 0", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "sans-serif" }}>{line.replace("## ", "")}</h2>;
      if (line.startsWith("**") && line.endsWith("**")) return <h2 key={i} style={{ fontSize: "13px", fontWeight: "700", margin: "28px 0 10px 0", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "sans-serif" }}>{line.replace(/\*\*/g, "")}</h2>;
      if (line.startsWith("- ")) return <li key={i} style={{ margin: "6px 0", color: "#444", lineHeight: "1.7", fontFamily: "Georgia, serif", fontSize: "15px" }}>{line.replace("- ", "")}</li>;
      if (line.match(/^\d+\./)) return <li key={i} style={{ margin: "10px 0", color: "#444", lineHeight: "1.7", fontFamily: "Georgia, serif", fontSize: "15px" }}>{line}</li>;
      if (line.startsWith("MACROS:") || line.startsWith("Calories:") || line.startsWith("Protein:") || line.startsWith("Carbohydrates:") || line.startsWith("Fat:")) return null;
      if (line.trim() === "") return <div key={i} style={{ height: "8px" }} />;
      return <p key={i} style={{ margin: "4px 0", color: "#555", lineHeight: "1.7", fontFamily: "Georgia, serif", fontSize: "15px" }}>{line}</p>;
    });
  };

  const modes = [
    { value: "1", label: "Fridge Mode", desc: "Use what you have" },
    { value: "2", label: "Calorie Target", desc: "Hit a specific goal" },
    { value: "3", label: "Custom Macros", desc: "Set your own targets" },
    { value: "4", label: "Free Mode", desc: "Enter any dish name" },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", backgroundColor: "#fafafa" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #e8e8e8", backgroundColor: "#fff", padding: "20px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <img src="/logo.png" alt="Nouri" style={{ height: "140px", objectFit: "contain" }} />
        <p style={{ margin: 0, color: "#888", fontSize: "14px", fontFamily: "Georgia, serif", fontStyle: "italic", letterSpacing: "0.15em" }}>
          Eat with intention. Fuel with purpose.
        </p>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Dietary Preferences */}
        <div style={{ marginBottom: "36px" }}>
          <p className="section-label">Dietary Preferences</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto", "High Protein"].map((pref) => (
              <div key={pref} className={`pref-chip ${dietaryPrefs.includes(pref) ? "active" : ""}`} onClick={() => togglePref(pref)}>
                {pref}
              </div>
            ))}
          </div>
          <input
            className="text-input"
            placeholder="Add custom diet (e.g. Paleo, Halal)… press Enter"
            style={{ marginTop: "10px", fontSize: "13px", padding: "10px 14px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                togglePref(e.target.value.trim());
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* Mode Selector */}
        <div style={{ marginBottom: "36px" }}>
          <p className="section-label">Select Mode</p>
          <div className="mode-grid">
            {modes.map((m) => (
              <div key={m.value} className={`mode-card ${mode === m.value ? "active" : ""}`} onClick={() => setMode(m.value)}>
                <p style={{ margin: 0, fontFamily: "sans-serif", fontWeight: "600", fontSize: "14px", color: mode === m.value ? "#fff" : "#1a1a1a" }}>
                  {m.label}
                </p>
                <p style={{ margin: "4px 0 0 0", fontFamily: "sans-serif", fontSize: "12px", color: mode === m.value ? "#ccc" : "#888" }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div style={{ marginBottom: "28px" }}>
          <p className="section-label">
            {mode === "1" ? "Your Ingredients" : mode === "2" ? "Calorie Target" : mode === "3" ? "Macro Targets" : "Dish Name"}
          </p>

          {mode === "1" && (
            <div>
              <textarea
                className="text-input"
                placeholder="e.g. chicken, rice, broccoli, garlic"
                value={analyzing ? "Analyzing your fridge..." : ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={3}
                style={{ resize: "vertical", lineHeight: "1.6" }}
              />

              <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", margin: "16px 0 10px 0", textAlign: "center", letterSpacing: "0.05em" }}>
                — or upload a photo —
              </p>

              <div
                className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Fridge preview" style={{ maxHeight: "160px", maxWidth: "100%", borderRadius: "8px", objectFit: "cover", marginBottom: "10px" }} />
                    <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888", margin: 0 }}>
                      {analyzing ? "Analyzing ingredients..." : "Tap to upload a different photo"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
                    <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#555", margin: "0 0 4px 0", fontWeight: "500" }}>
                      Drag & drop or tap to upload
                    </p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", margin: 0 }}>
                      Photo of your fridge or ingredients
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => analyzeImage(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {mode === "2" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input className="text-input" placeholder="Calorie target (e.g. 500)" value={calories} onChange={(e) => setCalories(e.target.value)} />
              <input className="text-input" placeholder="Suggest a dish name (optional)" value={dishName} onChange={(e) => setDishName(e.target.value)} />
            </div>
          )}

          {mode === "3" && (
            <div className="macro-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[["Calories", calories, setCalories], ["Protein (g)", protein, setProtein], ["Carbs (g)", carbs, setCarbs], ["Fat (g)", fat, setFat]].map(([label, val, setter]) => (
                <div key={label}>
                  <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888", margin: "0 0 6px 0", fontWeight: "500" }}>{label}</p>
                  <input className="text-input" placeholder="NA if indifferent" value={val} onChange={(e) => setter(e.target.value)} style={{ padding: "12px 14px", fontSize: "14px" }} />
                </div>
              ))}
            </div>
          )}

          {mode === "4" && (
            <input className="text-input" placeholder="e.g. Chicken Tikka Masala" value={dishName} onChange={(e) => setDishName(e.target.value)} />
          )}
        </div>

        {/* Servings */}
        <div style={{ marginBottom: "28px" }}>
          <p className="section-label">Servings</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {["1", "2", "4", "6"].map((n) => (
              <div
                key={n}
                onClick={() => setServings(n)}
                style={{
                  padding: "10px 22px",
                  border: servings === n ? "2px solid #1a1a1a" : "2px solid #e0e0e0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: servings === n ? "#1a1a1a" : "#fff",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: servings === n ? "#fff" : "#444",
                  transition: "all 0.15s",
                  userSelect: "none",
                }}
              >
                {n}
              </div>
            ))}
            <input
              type="number"
              min="1"
              placeholder="Custom"
              onChange={(e) => setServings(e.target.value)}
              className="text-input"
              style={{ width: "90px", padding: "10px", textAlign: "center", fontSize: "14px" }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: "#fff5f5", border: "1px solid #fcc", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" }}>
            <p style={{ color: "#c0392b", fontFamily: "sans-serif", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              Generating your recipe...
            </>
          ) : "Generate Recipe"}
        </button>

        {recipe && (
          <button className="btn-secondary" onClick={saveRecipe}>
            Save Recipe ↓
          </button>
        )}

        {/* Loading Skeleton */}
        {loading && <SkeletonRecipe />}

        {/* Macros Card */}
        {macros && !loading && (
          <div className="fade-in" style={{ marginTop: "40px", padding: "24px", backgroundColor: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px" }}>
            <p className="section-label" style={{ marginBottom: "16px" }}>Nutrition Per Serving</p>
            <div className="nutrition-grid">
              {[["Calories", macros.calories], ["Protein", macros.protein], ["Carbs", macros.carbs], ["Fat", macros.fat]].map(([label, val]) => (
                <div key={label} className="nutrition-card">
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>{val}</p>
                  <p style={{ margin: "4px 0 0 0", fontFamily: "sans-serif", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Card */}
        {recipe && !loading && (
          <div className="fade-in" style={{ marginTop: "20px", padding: "40px", backgroundColor: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px" }}>
            {formatRecipe(recipe)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e8e8e8", padding: "28px 24px", textAlign: "center", marginTop: "48px" }}>
        <a href="/privacy" style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", textDecoration: "none" }}>Privacy Policy</a>
        <span style={{ color: "#e0e0e0", margin: "0 12px" }}>|</span>
        <a href="/terms" style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", textDecoration: "none" }}>Terms of Service</a>
        <span style={{ color: "#e0e0e0", margin: "0 12px" }}>|</span>
        <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa" }}>© 2026 Nouri</span>
      </div>
    </div>
  );
}

export default App;
