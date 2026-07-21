// =============================================
// SADQA KARU - MAIN SERVER FILE
// Clean MVC version — all logic in controllers
// =============================================
require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── ROUTES ──
app.use("/",          require("./routes/authRoutes"));
app.use("/ngos",      require("./routes/ngosRoutes"));
app.use("/donations", require("./routes/donationRoutes"));
app.use("/volunteers",require("./routes/volunteerRoutes"));
app.use("/admin",     require("./routes/adminRoutes"));

// ── TEST ROUTE ──
app.get("/test", (req, res) => res.send("Sadqa Karu Backend Running!"));

// ── AI CONDITION CHECK ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini Key =", process.env.GEMINI_API_KEY);
app.post("/check-condition", async (req, res) => {
  const { image, mimeType } = req.body;
  if (!image) return res.status(400).json({ message: "No image provided." });

  try {
    const model  = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Look at the object in this image carefully. Judge the physical condition of the object only. Reply with ONLY one word from these options: New, Good, Bad, Worse. Do not write anything else.`;
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: mimeType || "image/jpeg" } }
    ]);
    const text      = result.response.text().trim();
    const valid     = ["New", "Good", "Bad", "Worse"];
    const condition = valid.find(c => text.includes(c)) || "Good";
    console.log("Gemini detected:", condition);
    res.json({ condition });
  } catch (err) {
    console.log("Gemini error:", err.message);
    res.status(500).json({ condition: "Good" });
  }
});

// ── START ──
//app.listen(3000, () => {
  //console.log("Server running on http://localhost:3000");
//});
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}

module.exports = app;