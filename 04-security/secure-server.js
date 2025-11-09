const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse HTML form submissions for CSRF demo
app.use(cookieParser());
app.use(
   cors({
      origin: true,
      credentials: true,
   })
);

// Serve static HTML files from the same directory
app.use(express.static(__dirname));

const JWT_SECRET = "your-secret-key";
const demoTasks = [
   { id: 1, title: "Build authentication", completed: true },
   { id: 2, title: "Record demo", completed: false },
];

// Login with httpOnly cookie
app.post("/login", (req, res) => {
   const { username, password } = req.body;

   if (username === "admin" && password === "secret123") {
      const token = jwt.sign(
         { sub: "1", username: username, role: "user" },
         JWT_SECRET,
         { expiresIn: "1h" }
      );

      // Set httpOnly cookie
      res.cookie("auth_token", token, {
         httpOnly: true, // Cannot be accessed by JavaScript
         secure: false, // IMPORTANT: sameSite='none' requires secure=true (HTTPS)
         // Browsers may reject this cookie with sameSite='none' + secure=false
         sameSite: "strict", // 'none' = vulnerable to CSRF (but requires secure=true)
         // 'lax' = protects against cross-site POST (but allows top-level GET)
         // 'strict' = maximum protection (blocks all cross-site requests)
         maxAge: 3600000, // 1 hour
         path: "/", // Ensure cookie is sent with all requests
      });

      //NOTE - if strict is not working for localhost, try localhost for secure server and 127.0.0.1 for malicious server to simulate cross-site request

      console.log("Token set in httpOnly cookie");

      return res.json({
         message: "Login successful",
         username: username,
      });
   }

   res.status(401).json({ error: "Invalid credentials" });
});

// Middleware to extract token from cookie
function cookieAuth(req, res, next) {
   const token = req.cookies.auth_token;

   if (!token) {
      return res.status(401).json({ error: "Missing token" });
   }

   try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
   }
}

app.get("/tasks", cookieAuth, (req, res) => {
   res.json(demoTasks);
});

// POST endpoint for CSRF attack demo
app.post("/tasks", cookieAuth, (req, res) => {
   const { title, completed } = req.body;

   const newTask = {
      id: demoTasks.length + 1,
      title: title || "New task",
      completed: completed === "true" || completed === true,
   };

   demoTasks.push(newTask);

   console.log("New task created:", newTask);
   res.status(201).json(newTask);
});

app.listen(3004, () => {
   console.log("Secure server with httpOnly cookies on port 3004");
});
