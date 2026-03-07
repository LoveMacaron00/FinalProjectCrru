# Agent Guidelines for Smart Travel Admin

This project is a **monorepo** with two main components:
- `admin/client` - React frontend (Vite + Tailwind CSS)
- `admin/server` - Express.js backend (PostgreSQL)

## Build / Lint / Test Commands

### Client (React)
```bash
# Navigate to client directory
cd admin/client

# Install dependencies
npm install

# Development server (port 3000)
npm run dev

# Build for production
npm run build

# Lint code (ESLint)
npm run lint

# Preview production build
npm run preview
```

### Server (Express)
```bash
# Navigate to server directory
cd admin/server

# Install dependencies
npm install

# Start production server
npm start

# Development server (with nodemon)
npm run dev
```

### Running a Single Test
**No test framework is currently configured** for this project. If adding tests:
- Client: Use Vitest or Jest (`npx vitest run filename.test.jsx`)
- Server: Use Jest or Mocha (`npx jest filename.test.js`)

---

## Code Style Guidelines

### General
- **Indentation**: 4 spaces (no tabs)
- **Line endings**: LF (Unix-style)
- **Max line length**: 100 characters (soft limit)
- **No trailing whitespace**
- **No unused variables or imports**

### Imports

**Client (React/JSX)**
```jsx
// Group imports in this order:
// 1. React built-ins
// 2. External libraries (react-router, lucide-react, etc.)
// 3. Internal components/pages
// 4. CSS/styles

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, MapPin } from 'lucide-react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
```

**Server (Express)**
```javascript
// Group in order: built-ins, external, internal
const express = require('express');
const cors = require('cors');
const db = require('../db');
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `Login.jsx`, `Dashboard.jsx` |
| Files (utilities) | camelCase | `apiHelper.js`, `authMiddleware.js` |
| Functions | camelCase | `handleLogin`, `fetchDestinations` |
| Components | PascalCase | `const Sidebar = () => {}` |
| CSS Classes | Tailwind utility classes | `className="flex items-center gap-3"` |
| Database tables | snake_case | `destination_images`, `user_auth` |
| Database columns | snake_case | `opening_time`, `image_url` |

### React Patterns

```jsx
// Component structure
const ComponentName = ({ prop1, prop2 }) => {
    // 1. State hooks first
    const [state, setState] = useState('');
    
    // 2. Effects
    useEffect(() => {
        // effect logic
    }, []);
    
    // 3. Event handlers
    const handleClick = () => {};
    
    // 4. Render
    return (
        <div>...</div>
    );
};

// Use early returns for conditions
if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;

// Destructure props where appropriate
const { name, onSave, children } = props;
```

### Express/Node Patterns

```javascript
// Async route handlers with error catching
router.get('/endpoint', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM table WHERE id = $1', [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Parameterized queries (no string concatenation)
// BAD:  db.query(`SELECT * FROM users WHERE id = ${userId}`)
// GOOD: db.query('SELECT * FROM users WHERE id = $1', [userId])
```

### Error Handling

- **Frontend**: Show user-friendly messages in Thai/English
- **Backend**: Always return JSON with `{ message: '...' }` and appropriate HTTP status codes
- Use try/catch for all async database operations
- Log errors server-side with `console.error`

### Database

- Use parameterized queries to prevent SQL injection
- Always handle empty result sets (`rows.length === 0`)
- Use Thai error messages for user-facing errors

### Tailwind CSS

- Use arbitrary values sparingly (`style={{ background: '#f0a500' }}`)
- Prefer Tailwind utility classes when possible
- Keep custom colors consistent (this project uses: `#f0a500` gold, `#0f1728` dark blue, `#1a1a2e` dark purple)

---

## Project Structure

```
admin/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                    # Express backend (MVC Structure)
    ├── config/                # การตั้งค่าต่างๆ
    │   └── multer.js          # ตั้งค่าการอัปโหลดไฟล์
    ├── controllers/           # ส่วนควบคุม (Business Logic)
    │   ├── analyticsController.js  # logic สถิติภาพรวม
    │   ├── authController.js       # logic การยืนยันตัวตน
    │   ├── destinationController.js # logic CRUD สถานที่
    │   ├── tatController.js        # logic เชื่อมต่อ TAT API
    │   └── uploadController.js     # logic อัปโหลดรูปภาพ
    ├── models/                # ส่วนจัดการข้อมูล (Database Queries)
    │   ├── adminModel.js      # query ตาราง admins
    │   ├── analyticsModel.js  # query สถิติภาพรวม
    │   └── destinationModel.js # query ตาราง destinations
    ├── routes/                # เส้นทาง API (Route Definitions)
    │   ├── analyticsRoutes.js # เส้นทางสถิติ
    │   ├── auth.js            # เส้นทางยืนยันตัวตน
    │   ├── destinationRoutes.js # เส้นทาง CRUD สถานที่
    │   ├── tat.js             # เส้นทาง TAT API
    │   └── uploadRoutes.js    # เส้นทางอัปโหลดรูป
    ├── utils/                 # ฟังก์ชันเสริม
    │   └── cache.js           # ระบบ in-memory cache
    ├── db.js                  # เชื่อมต่อฐานข้อมูล PostgreSQL
    ├── server.js              # จุดเริ่มต้นแอปพลิเคชัน
    └── uploads/               # โฟลเดอร์เก็บรูปภาพ
```

---

## Environment Variables

Create `.env` files as needed:

```bash
# admin/server/.env
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

---

## Important Notes

- The server proxies API requests from `localhost:3000` to `localhost:5000`
- Uploaded images are served from `/uploads` endpoint
- Admin authentication uses localStorage with JWT (if implemented)
- Some error messages are in Thai - maintain this for consistency
- No TypeScript - plain JavaScript/JSX only
