// ADMIN CONTROLLER — admin logic
const db         = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper — send email
const sendEmail = (to, subject, html) => {
  transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html }, (err) => {
    if (err) console.log("Email error:", err.message);
    else console.log("Email sent to:", to);
  });
};

// GET ALL USERS
const getAllUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role, phone, city, status, created_at FROM users",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error." });
      res.json(result);
    }
  );
};

// GET PENDING NGOs — from users table
const getPendingNGOs = (req, res) => {
  const sql = `
    SELECT users.id, users.name, users.email, users.phone, users.city, users.created_at,
           ngos.description, ngos.location
    FROM users
    LEFT JOIN ngos ON users.id = ngos.user_id
    WHERE users.role = 'ngo' AND users.status = 'pending'
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Error." });
    res.json(result);
  });
};

// GET PENDING VOLUNTEERS — from users table
const getPendingVolunteers = (req, res) => {
  const sql = `
    SELECT id, name, email, phone, city, created_at
    FROM users
    WHERE role = 'volunteer' AND status = 'pending'
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Error." });
    res.json(result);
  });
};

// APPROVE NGO
const approveNGO = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id = ? AND role = 'ngo'", [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ message: "Error." });
    const user = result[0];

    // Update users table status to active
    db.query("UPDATE users SET status = 'active' WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Error approving NGO." });

      // Also update ngos table status to approved
      db.query("UPDATE ngos SET status = 'approved' WHERE user_id = ?", [id], (err) => {
        if (err) console.log("NGO table update error:", err);
      });

      // Send approval email
      sendEmail(user.email, "Your NGO has been approved — Sadqa Karu", `
        <div style="font-family:Arial,sans-serif;padding:30px;border:1px solid #eee;border-radius:10px;max-width:600px;margin:auto;">
          <h2 style="color:#4E9D73;">Sadqa Karu</h2>
          <h3>Your NGO has been approved ✅</h3>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your NGO account has been approved. You can now login and start receiving donations.</p>
          <p style="color:#aaa;font-size:12px;">Sadqa Karu — Connecting donors with NGOs</p>
        </div>
      `);
      res.json({ message: "NGO approved!" });
    });
  });
};

// REJECT NGO
const rejectNGO = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id = ? AND role = 'ngo'", [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ message: "Error." });
    const user = result[0];

    // Update status to rejected
    db.query("UPDATE users SET status = 'rejected' WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Error rejecting NGO." });

      // Send rejection email
      sendEmail(user.email, "Your NGO application status — Sadqa Karu", `
        <div style="font-family:Arial,sans-serif;padding:30px;border:1px solid #eee;border-radius:10px;max-width:600px;margin:auto;">
          <h2 style="color:#4E9D73;">Sadqa Karu</h2>
          <h3>NGO Application Update</h3>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your NGO application has been rejected. Contact info@sadqa.com for more info.</p>
          <p style="color:#aaa;font-size:12px;">Sadqa Karu — Connecting donors with NGOs</p>
        </div>
      `);
      res.json({ message: "NGO rejected!" });
    });
  });
};

// APPROVE VOLUNTEER
const approveVolunteer = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id = ? AND role = 'volunteer'", [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ message: "Error." });
    const user = result[0];

    // Update status to active
    db.query("UPDATE users SET status = 'active' WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Error approving volunteer." });

      // Send approval email
      sendEmail(user.email, "Your volunteer account has been approved — Sadqa Karu", `
        <div style="font-family:Arial,sans-serif;padding:30px;border:1px solid #eee;border-radius:10px;max-width:600px;margin:auto;">
          <h2 style="color:#4E9D73;">Sadqa Karu</h2>
          <h3>Volunteer Account Approved ✅</h3>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your volunteer account has been approved. You can now login!</p>
          <p style="color:#aaa;font-size:12px;">Sadqa Karu — Connecting donors with NGOs</p>
        </div>
      `);
      res.json({ message: "Volunteer approved!" });
    });
  });
};

// REJECT VOLUNTEER
const rejectVolunteer = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id = ? AND role = 'volunteer'", [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ message: "Error." });
    const user = result[0];

    // Update status to rejected
    db.query("UPDATE users SET status = 'rejected' WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Error rejecting volunteer." });

      // Send rejection email
      sendEmail(user.email, "Your volunteer application status — Sadqa Karu", `
        <div style="font-family:Arial,sans-serif;padding:30px;border:1px solid #eee;border-radius:10px;max-width:600px;margin:auto;">
          <h2 style="color:#4E9D73;">Sadqa Karu</h2>
          <h3>Volunteer Application Update</h3>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your volunteer application has been rejected. Contact info@sadqa.com for more info.</p>
          <p style="color:#aaa;font-size:12px;">Sadqa Karu — Connecting donors with NGOs</p>
        </div>
      `);
      res.json({ message: "Volunteer rejected!" });
    });
  });
};

module.exports = {
  getAllUsers,
  getPendingNGOs,
  getPendingVolunteers,
  approveNGO,
  rejectNGO,
  approveVolunteer,
  rejectVolunteer
};