const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced static file serving for Render - SERVE FROM PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public'))); // Serve from public folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// MySQL connection
const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12803757",
  password: "vSG7sVDdGR",
  database: "sql12803757",
  port: 3306
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create pets table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS pets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      petName VARCHAR(255) NOT NULL,
      animalType VARCHAR(50) NOT NULL,
      breed VARCHAR(100),
      age VARCHAR(50),
      gender VARCHAR(20),
      description TEXT,
      contact VARCHAR(255) NOT NULL,
      imagePath VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.execute(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating pets table:', err);
    } else {
      console.log('Pets table ready');
    }
  });
});

// ===== AUTHENTICATION ENDPOINTS =====

// Create users table if it doesn't exist
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'shelter') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createUsersTableQuery, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table ready');
  }
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        });
    }

    const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.execute(checkUserQuery, [email, username], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        const insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.execute(insertQuery, [username, email, password, role], (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Registration failed: ' + err.message
                });
            }

            res.status(201).json({
                success: true,
                message: '🎉 Registration successful! You can now login.'
            });
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email, password, and role'
        });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?';
    db.execute(query, [email, password, role], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email, password, or role'
            });
        }

        const user = results[0];
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.json({
            success: true,
            message: '✅ Login successful!',
            redirect: '/'
        });
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.clearCookie('connect.sid');
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// Check auth status
app.get('/auth/status', (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            username: req.session.username,
            role: req.session.role
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// ===== HTML PAGE ROUTES (UPDATED FOR PUBLIC FOLDER) =====

// Serve all HTML pages from public folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/adoption', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adoption.html'));
});

app.get('/rescue', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rescue.html'));
});

app.get('/donation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'donation.html'));
});

app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'community.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Debug route to check file structure
app.get('/debug', (req, res) => {
  try {
    const files = fs.readdirSync(__dirname);
    const publicFiles = fs.readdirSync(path.join(__dirname, 'public'));
    const htmlFiles = publicFiles.filter(file => file.endsWith('.html'));
    
    res.json({
      currentDirectory: __dirname,
      publicDirectory: path.join(__dirname, 'public'),
      rootFiles: files,
      publicFiles: publicFiles,
      htmlFiles: htmlFiles,
      environment: process.env.NODE_ENV,
      port: PORT
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DATABASE TABLE CREATION =====

// Create donations table
const createDonationsTableQuery = `
  CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    cause VARCHAR(100) NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    transaction_id VARCHAR(255),
    receipt_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createDonationsTableQuery, (err) => {
  if (err) {
    console.error('Error creating donations table:', err);
  } else {
    console.log('Donations table ready');
  }
});

// Create rescue_cases table
const createRescueCasesTableQuery = `
  CREATE TABLE IF NOT EXISTS rescue_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_type VARCHAR(50) NOT NULL,
    conditions VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact VARCHAR(255) NOT NULL,
    urgency ENUM('High', 'Medium', 'Low') NOT NULL,
    status ENUM('Reported', 'In Progress', 'Resolved') DEFAULT 'Reported',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createRescueCasesTableQuery, (err) => {
  if (err) {
    console.error('Error creating rescue_cases table:', err);
  } else {
    console.log('Rescue_cases table ready');
  }
});

// Create rescue_responses table
const createRescueResponsesTableQuery = `
  CREATE TABLE IF NOT EXISTS rescue_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    responder_name VARCHAR(255) NOT NULL,
    responder_contact VARCHAR(255) NOT NULL,
    response_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES rescue_cases(id) ON DELETE CASCADE
  )
`;

db.execute(createRescueResponsesTableQuery, (err) => {
  if (err) {
    console.error('Error creating rescue_responses table:', err);
  } else {
    console.log('Rescue_responses table ready');
  }
});

// Create veterinary_hospitals table
const createVetHospitalsTableQuery = `
  CREATE TABLE IF NOT EXISTS veterinary_hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createVetHospitalsTableQuery, (err) => {
  if (err) {
    console.error('Error creating veterinary_hospitals table:', err);
  } else {
    console.log('Veterinary_hospitals table ready');
  }
});

// Create appointments table
const createAppointmentsTableQuery = `
  CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_contact VARCHAR(255) NOT NULL,
    appointment_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES veterinary_hospitals(id) ON DELETE CASCADE
  )
`;

db.execute(createAppointmentsTableQuery, (err) => {
  if (err) {
    console.error('Error creating appointments table:', err);
  } else {
    console.log('Appointments table ready');
  }
});

// Create community_posts table
const createCommunityTableQuery = `
  CREATE TABLE IF NOT EXISTS community_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('stories', 'advice', 'questions') NOT NULL,
    author VARCHAR(255) NOT NULL,
    imagePath VARCHAR(500),
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createCommunityTableQuery, (err) => {
  if (err) {
    console.error('Error creating community_posts table:', err);
  } else {
    console.log('Community_posts table ready');
  }
});

// Create post_comments table
const createCommentsTableQuery = `
  CREATE TABLE IF NOT EXISTS post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
  )
`;

db.execute(createCommentsTableQuery, (err) => {
  if (err) {
    console.error('Error creating post_comments table:', err);
  } else {
    console.log('Post_comments table ready');
  }
});

// Create post_likes table
const createLikesTableQuery = `
  CREATE TABLE IF NOT EXISTS post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (post_id, user_ip),
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
  )
`;

db.execute(createLikesTableQuery, (err) => {
  if (err) {
    console.error('Error creating post_likes table:', err);
  } else {
    console.log('Post_likes table ready');
  }
});

// Create lost_found_reports table
const createLostFoundTableQuery = `
  CREATE TABLE IF NOT EXISTS lost_found_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Lost', 'Found') NOT NULL,
    petName VARCHAR(255),
    animalType VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    color VARCHAR(100),
    description TEXT NOT NULL,
    contact VARCHAR(255) NOT NULL,
    reward VARCHAR(100),
    imagePath VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createLostFoundTableQuery, (err) => {
  if (err) {
    console.error('Error creating lost_found_reports table:', err);
  } else {
    console.log('Lost_found_reports table ready');
  }
});

// Create emergency_alerts table
const createEmergencyAlertsTableQuery = `
  CREATE TABLE IF NOT EXISTS emergency_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    animal_type VARCHAR(50),
    urgency VARCHAR(20) NOT NULL,
    details TEXT NOT NULL,
    contact VARCHAR(255) NOT NULL,
    status ENUM('active', 'resolved') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.execute(createEmergencyAlertsTableQuery, (err) => {
  if (err) {
    console.error('Error creating emergency_alerts table:', err);
  } else {
    console.log('Emergency_alerts table ready');
  }
});

// ===== API ENDPOINTS =====

// Pets adoption endpoints
app.get('/api/pets', (req, res) => {
  const query = `
    SELECT id, petName, animalType, breed, age, gender, description, contact, imagePath, createdAt
    FROM pets 
    ORDER BY createdAt DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const petsWithImageUrls = results.map(pet => {
  if (pet.imagePath) {
    return {
      ...pet,
      imageData: `https://pawconnect-u65b.onrender.com/${pet.imagePath}`
    };
  }  else {
        const defaults = {
          Dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
          Cat: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
          Bird: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?auto=format&fit=crop&w=600&q=80",
          Rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
          Other: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80"
        };
        return {
          ...pet,
          imageData: defaults[pet.animalType] || defaults.Other
        };
      }
    });
    
    res.json(petsWithImageUrls);
  });
});

app.post('/api/pets', upload.single('petImage'), (req, res) => {
  const { petName, animalType, breed, age, gender, description, contact } = req.body;
  
  if (!petName || !animalType || !description || !contact) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  
  let imagePath = null;
  if (req.file) {
    imagePath = req.file.path;
  }
  
  const query = `
    INSERT INTO pets (petName, animalType, breed, age, gender, description, contact, imagePath) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query, [petName, animalType, breed, age, gender, description, contact, imagePath], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Pet added successfully', 
      petId: results.insertId 
    });
  });
});

app.delete('/api/pets/:id', (req, res) => {
  const petId = req.params.id;
  
  const getQuery = 'SELECT imagePath FROM pets WHERE id = ?';
  
  db.execute(getQuery, [petId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    const pet = results[0];
    
    if (pet.imagePath && fs.existsSync(pet.imagePath)) {
      fs.unlink(pet.imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }
    
    const deleteQuery = 'DELETE FROM pets WHERE id = ?';
    
    db.execute(deleteQuery, [petId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ 
        message: 'Pet removed successfully'
      });
    });
  });
});

// Rescue cases endpoints
app.post('/api/rescue-cases', (req, res) => {
  const { animalType, conditions, location, city, description, contact, urgency } = req.body;
  
  if (!animalType || !conditions || !location || !city || !description || !contact || !urgency) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const query = `
    INSERT INTO rescue_cases (animal_type, conditions, location, city, description, contact, urgency) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query, [animalType, conditions, location, city, description, contact, urgency], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Rescue case submitted successfully', 
      caseId: results.insertId 
    });
  });
});

app.get('/api/rescue-cases', (req, res) => {
  const query = `
    SELECT id, animal_type, conditions, location, city, description, contact, urgency, status, created_at
    FROM rescue_cases 
    WHERE status != 'Resolved'
    ORDER BY 
      CASE urgency 
        WHEN 'High' THEN 1 
        WHEN 'Medium' THEN 2 
        WHEN 'Low' THEN 3 
      END,
      created_at DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

app.post('/api/rescue-cases/:id/respond', (req, res) => {
  const caseId = req.params.id;
  const { responder, contact, details } = req.body;
  
  if (!responder || !contact) {
    return res.status(400).json({ error: 'Responder name and contact are required' });
  }
  
  const query = `
    INSERT INTO rescue_responses (case_id, responder_name, responder_contact, response_details) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.execute(query, [caseId, responder, contact, details || ''], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Response recorded successfully', 
      responseId: results.insertId 
    });
  });
});

app.put('/api/rescue-cases/:id/status', (req, res) => {
  const caseId = req.params.id;
  const { status } = req.body;
  
  if (!['Reported', 'In Progress', 'Resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  const query = `
    UPDATE rescue_cases 
    SET status = ? 
    WHERE id = ?
  `;
  
  db.execute(query, [status, caseId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Case status updated successfully'
    });
  });
});

// Veterinary hospitals endpoints
app.get('/api/vets', (req, res) => {
  const location = req.query.location;
  
  if (!location) {
    return res.status(400).json({ error: 'Location parameter is required' });
  }
  
  const query = `
    SELECT id, name, location, phone_number 
    FROM veterinary_hospitals 
    WHERE location LIKE ? 
    ORDER BY name
  `;
  
  db.execute(query, [`%${location}%`], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

app.post('/api/appointments', (req, res) => {
  const { hospitalId, userName, userContact, appointmentDate } = req.body;
  
  if (!hospitalId || !userName || !userContact || !appointmentDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const query = `
    INSERT INTO appointments (hospital_id, user_name, user_contact, appointment_date) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.execute(query, [hospitalId, userName, userContact, appointmentDate], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Appointment booked successfully', 
      appointmentId: results.insertId 
    });
  });
});

// Community endpoints
app.get('/api/community/posts', (req, res) => {
  const query = `
    SELECT cp.*, 
           COUNT(DISTINCT pl.id) AS likes_count,
           GROUP_CONCAT(
             DISTINCT CONCAT_WS('|||', pc.author, pc.comment_text, pc.created_at) 
             ORDER BY pc.created_at SEPARATOR ';;;;'
           ) AS comments_data
    FROM community_posts cp
    LEFT JOIN post_likes pl ON cp.id = pl.post_id
    LEFT JOIN post_comments pc ON cp.id = pc.post_id
    GROUP BY cp.id
    ORDER BY cp.created_at DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
  const postsWithComments = results.map(post => {
  let comments = [];
  
  if (post.comments_data) {
    comments = post.comments_data.split(';;;;').map(commentStr => {
      const [author, comment_text, created_at] = commentStr.split('|||');
      return { author, comment_text, created_at };
    });
  }
  
  // ADD THESE 4 LINES:
  let imagePath = post.imagePath;
  if (imagePath) {
    imagePath = `https://pawconnect-u65b.onrender.com/${post.imagePath}`;
  }
  
  return {
    ...post,
    imagePath: imagePath, // ← ADD THIS
    likes_count: parseInt(post.likes_count) || 0,
    comments
  };
});
    
    res.json(postsWithComments);
  });
});

app.post('/api/community/posts', upload.single('postImage'), (req, res) => {
  const { title, content, category, author } = req.body;
  
  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  
  let imagePath = null;
  if (req.file) {
    imagePath = req.file.path;
  }
  
  const query = `
    INSERT INTO community_posts (title, content, category, author, imagePath) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.execute(query, [title, content, category, author, imagePath], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Post created successfully', 
      postId: results.insertId 
    });
  });
});

app.post('/api/community/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  const userIp = req.ip || req.connection.remoteAddress;
  
  const checkQuery = 'SELECT id FROM post_likes WHERE post_id = ? AND user_ip = ?';
  
  db.execute(checkQuery, [postId, userIp], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'You already liked this post' });
    }
    
    const likeQuery = 'INSERT INTO post_likes (post_id, user_ip) VALUES (?, ?)';
    
    db.execute(likeQuery, [postId, userIp], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const updateQuery = 'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?';
      
      db.execute(updateQuery, [postId], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
          message: 'Post liked successfully'
        });
      });
    });
  });
});

app.post('/api/community/posts/:id/comment', (req, res) => {
  const postId = req.params.id;
  const { author, comment_text } = req.body;
  
  if (!comment_text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }
  
  const commentAuthor = author || 'Anonymous';
  
  const query = `
    INSERT INTO post_comments (post_id, author, comment_text) 
    VALUES (?, ?, ?)
  `;
  
  db.execute(query, [postId, commentAuthor, comment_text], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Comment added successfully', 
      commentId: results.insertId 
    });
  });
});

app.delete('/api/community/posts/:id', (req, res) => {
  const postId = req.params.id;
  
  const getQuery = 'SELECT imagePath FROM community_posts WHERE id = ?';
  
  db.execute(getQuery, [postId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const post = results[0];
    
    if (post.imagePath && fs.existsSync(post.imagePath)) {
      fs.unlink(post.imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }
    
    const deleteQuery = 'DELETE FROM community_posts WHERE id = ?';
    
    db.execute(deleteQuery, [postId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ 
        message: 'Post deleted successfully'
      });
    });
  });
});

// Donation endpoints
app.post('/api/donations', (req, res) => {
  const { amount, cause, donor_name, donor_email, donor_phone, payment_method } = req.body;
  
  if (!amount || !cause || !donor_name || !donor_email || !donor_phone || !payment_method) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const receiptId = 'PC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  
  const query = `
    INSERT INTO donations (amount, cause, donor_name, donor_email, donor_phone, payment_method, receipt_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query, [amount, cause, donor_name, donor_email, donor_phone, payment_method, receiptId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      success: true,
      message: 'Donation recorded successfully',
      donationId: results.insertId,
      receiptId: receiptId,
      timestamp: new Date().toISOString()
    });
  });
});

app.get('/api/donations/stats', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_donations,
      SUM(amount) as total_amount,
      cause,
      DATE(created_at) as donation_date
    FROM donations 
    WHERE payment_status = 'completed'
    GROUP BY cause, DATE(created_at)
    ORDER BY donation_date DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

app.get('/api/donations', (req, res) => {
  const query = `
    SELECT id, amount, cause, donor_name, donor_email, donor_phone, payment_method, receipt_id, created_at
    FROM donations 
    ORDER BY created_at DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

// Lost & Found endpoints
app.post('/api/lostfound', upload.single('petImage'), (req, res) => {
  const { status, petName, animalType, breed, location, date, color, description, contact, reward } = req.body;
  
  if (!status || !animalType || !location || !date || !description || !contact) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  
  let imagePath = null;
  if (req.file) {
    imagePath = req.file.path;
  }
  
  const query = `
    INSERT INTO lost_found_reports (status, petName, animalType, breed, location, date, color, description, contact, reward, imagePath) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query, [status, petName, animalType, breed, location, date, color, description, contact, reward, imagePath], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Report submitted successfully', 
      reportId: results.insertId 
    });
  });
});

app.get('/api/lostfound', (req, res) => {
  const query = `
    SELECT id, status, petName, animalType, breed, location, date, color, description, contact, reward, imagePath, created_at
    FROM lost_found_reports 
    ORDER BY created_at DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const reportsWithImageUrls = results.map(report => {
  if (report.imagePath) {
    return {
      ...report,
      imageData: `https://pawconnect-u65b.onrender.com/${report.imagePath}`
    };
  }else {
        const defaults = {
          Dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
          Cat: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
          Bird: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?auto=format&fit=crop&w=600&q=80",
          Rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80"
        };
        
        return {
          ...report,
          imageData: defaults[report.animalType] || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80"
        };
      }
    });
    
    res.json(reportsWithImageUrls);
  });
});

// Emergency alerts endpoints
app.post('/api/emergency-alerts', (req, res) => {
  const { type, title, location, animalType, urgency, details, contact } = req.body;
  
  if (!type || !title || !location || !urgency || !details || !contact) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  
  const query = `
    INSERT INTO emergency_alerts (type, title, location, animal_type, urgency, details, contact) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query, [type, title, location, animalType, urgency, details, contact], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      message: 'Emergency alert submitted successfully', 
      alertId: results.insertId 
    });
  });
});

app.get('/api/emergency-alerts', (req, res) => {
  const query = `
    SELECT id, type, title, location, animal_type as animalType, urgency, details, contact, 
           DATE_FORMAT(created_at, '%H:%i %d/%m/%Y') as time
    FROM emergency_alerts 
    WHERE status = 'active'
    ORDER BY 
      CASE urgency 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
      END,
      created_at DESC
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

app.delete('/api/emergency-alerts/:id', (req, res) => {
  const alertId = req.params.id;
  
  const query = `
    UPDATE emergency_alerts 
    SET status = 'resolved' 
    WHERE id = ?
  `;
  
  db.execute(query, [alertId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({ 
      message: 'Alert resolved successfully'
    });
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>Available pages:</p>
        <ul style="list-style: none; padding: 0;">
          <li><a href="/">Home</a></li>
          <li><a href="/adoption">Adoption</a></li>
          <li><a href="/rescue">Rescue</a></li>
          <li><a href="/donation">Donation</a></li>
          <li><a href="/community">Community</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available pages:`);
  console.log(`- / (Home)`);
  console.log(`- /adoption`);
  console.log(`- /rescue`);
  console.log(`- /donation`);
  console.log(`- /community`);
  console.log(`- /login`);
  console.log(`- /register`);
  console.log(`- /debug (for debugging)`);
});