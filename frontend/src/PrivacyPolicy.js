function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "Georgia, serif", maxWidth: "720px", margin: "0 auto", padding: "48px 24px", color: "#1a1a1a" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ color: "#888", fontFamily: "sans-serif", fontSize: "13px", marginBottom: "40px" }}>Last updated: July 2026</p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Overview</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        Nouri ("we", "us", or "our") is an AI-powered recipe generation tool. This Privacy Policy explains how we handle information you provide when using our service at trynouri.app.
      </p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>AI Disclosure</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        Nouri uses artificial intelligence to generate recipes. Specifically, your inputs — including ingredients, calorie targets, macro goals, dietary preferences, and dish names — are sent to Anthropic's Claude AI model to generate personalized recipe responses. By using Nouri, you acknowledge that your inputs are processed by a third-party AI provider (Anthropic). We encourage you not to include any sensitive personal information in your recipe requests.
      </p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Information We Collect</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        We do not collect or store personal information such as your name, email address, or payment details. The only data processed is the recipe-related input you provide (ingredients, dietary preferences, etc.), which is used solely to generate your recipe response.
      </p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Third-Party Services</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        Nouri uses the following third-party services to operate:
      </p>
      <ul style={{ color: "#444", lineHeight: "2", marginBottom: "32px" }}>
        <li><strong>Anthropic (Claude AI)</strong> — processes your recipe inputs to generate responses</li>
        <li><strong>Vercel</strong> — hosts our frontend application</li>
        <li><strong>Railway</strong> — hosts our backend server</li>
      </ul>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        Each of these services has their own privacy policies which govern their handling of data.
      </p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Cookies</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        Nouri does not use tracking cookies or analytics.
      </p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Changes to This Policy</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
      </p>

      <h2 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Contact</h2>
      <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
        If you have any questions about this Privacy Policy, you can reach us at support@trynouri.app.
      </p>

      <a href="/" style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888", textDecoration: "none" }}>← Back to Nouri</a>
    </div>
  );
}

export default PrivacyPolicy;
