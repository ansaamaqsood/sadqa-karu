// AUTH CONTROLLER — signup and login logic
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const db        = require("../config/db");
const userModel = require("../models/userModel");

// SIGNUP
const signup = async (req, res) => {
  const { name, email, password, role, phone, city,
          profession, service,
          ngoName, ngoDesc, ngoCategory } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please fill all fields." });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  userModel.createUser(name, email, hashedPassword, role, phone, city, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already registered." });
      }
      console.log(err);
      return res.status(500).json({ message: "Signup failed." });
    }

    const userId = result.insertId;
    console.log("User created with ID:", userId, "Role:", role);

    // If NGO — insert into ngos table as pending
    // Admin will see this in pending NGOs list
    if (role === "ngo") {
      db.query(
        "INSERT INTO ngos (user_id, name, description, location, status) VALUES (?, ?, ?, ?, 'pending')",
        [userId, ngoName || name, ngoDesc || "", city || ""],
        (err) => { if (err) console.log("NGO insert error:", err); }
      );
    }

    // If volunteer — insert into volunteers table as pending
    if (role === "volunteer") {
      db.query(
        "INSERT INTO volunteers (user_id, profession, service, status) VALUES (?, ?, ?, 'pending')",
        [userId, profession || "", service || ""],
        (err) => { if (err) console.log("Volunteer insert error:", err); }
      );
    }

    // Set status to pending for volunteer and NGO
    // Set status to active for donor and admin
    const status = (role === "volunteer" || role === "ngo") ? "pending" : "active";

    db.query("UPDATE users SET status = ? WHERE id = ?", [status, userId], (err) => {
      if (err) console.log("Status update error:", err);
      // Send response only after status is set
      res.json({ message: "User registered successfully" });
    });

  });
};


// LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields." });
  }

  userModel.findUserByEmail(email, async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error." });

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = result[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password." });
    }

    // Check account status — works for both volunteer and NGO
    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your account has been rejected. Contact info@sadqa.com" });
    }

    // Active account — generate token
    generateToken(res, user);
  });
};


// Helper — create token and send response
function generateToken(res, user) {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    "secretkey",
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful!",
    token:   token,
    role:    user.role,
    userId:  user.id,
    name:    user.name
  });
}

module.exports = { signup, login };