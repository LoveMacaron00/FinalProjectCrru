# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for a Smart Travel application with three main components:
- `myapp/` - Flutter mobile app (Firebase authentication)
- `admin/client/` - React admin frontend (Vite + Tailwind CSS)
- `admin/server/` - Express.js backend with PostgreSQL

---

## Build / Dev Commands

### Flutter Mobile App (`myapp/`)
```bash
cd myapp

# Install dependencies
flutter pub get

# Run on connected device/emulator
flutter run

# Build APK (Android)
flutter build apk

# Build for iOS (macOS only)
flutter build ios

# Run tests
flutter test

# Run single test file
flutter test test/widget_test.dart
```

### Admin Client (`admin/client/`)
```bash
cd admin/client

# Install dependencies
npm install

# Development server (port 3000)
npm run dev

# Build for production
npm run build

# Lint (ESLint)
npm run lint

# Preview production build
npm run preview
```

### Admin Server (`admin/server/`)
```bash
cd admin/server

# Install dependencies
npm install

# Development (nodemon)
npm run dev

# Production
npm start
```

---

## Architecture

### Flutter App (`myapp/`)
```
lib/
├── main.dart           # Entry point, MaterialApp config
├── model/              # Data models
│   └── profile.dart
└── screen/             # UI screens
    ├── home.dart
    ├── login.dart
    └── register.dart
```
- Uses Firebase Auth (`firebase_auth`, `firebase_core`)
- Form validation with `form_field_validator`
- Assets stored in `assets/images/`

### Admin Backend (`admin/server/`) - MVC Pattern
```
server/
├── config/             # Configuration (multer for file uploads)
├── controllers/        # Business logic
│   ├── analyticsController.js
│   ├── authController.js
│   ├── destinationController.js
│   ├── tatController.js
│   └── uploadController.js
├── models/             # Database queries
│   ├── adminModel.js
│   ├── analyticsModel.js
│   └── destinationModel.js
├── routes/             # API route definitions
├── utils/              # Utilities (in-memory cache)
├── db.js               # PostgreSQL connection (pg)
├── server.js           # Express app entry point
└── uploads/            # Uploaded images
```

### Admin Frontend (`admin/client/`)
- React Router for navigation
- Leaflet/react-leaflet for maps
- react-quill-new for rich text editing
- lucide-react for icons
- Tailwind CSS for styling

---

## Code Style

### General
- **Indentation**: 4 spaces (no tabs)
- **Line endings**: LF (Unix-style)
- **Max line length**: 100 characters (soft limit)
- **No unused variables or imports**

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `Login.jsx`, `Dashboard.jsx` |
| Utility files | camelCase | `apiHelper.js` |
| Functions | camelCase | `handleLogin`, `fetchDestinations` |
| Database tables/columns | snake_case | `destination_images`, `opening_time` |
| Flutter files | lowercase | `home.dart`, `profile.dart` |

### React Component Structure
```jsx
const ComponentName = ({ prop1, prop2 }) => {
    // 1. State hooks
    const [state, setState] = useState('');

    // 2. Effects
    useEffect(() => {}, []);

    // 3. Event handlers
    const handleClick = () => {};

    // 4. Render
    return <div>...</div>;
};
```

### Express Routes
```javascript
// Always use parameterized queries (prevent SQL injection)
router.get('/endpoint', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM table WHERE id = $1', [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
```

### Tailwind Colors
- Gold: `#f0a500`
- Dark blue: `#0f1728`
- Dark purple: `#1a1a2e`

---

## Environment Variables

### Admin Server (`admin/server/.env`)
```
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

### Flutter (`myapp/`)
Firebase configuration is handled through `firebase_core` - ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are properly configured.

---

## Notes

- Client dev server proxies API requests from `localhost:3000` to `localhost:5000`
- Uploaded images served from `/uploads` endpoint
- Some error messages are in Thai - maintain this for consistency
- No TypeScript - plain JavaScript/JSX only
- Flutter SDK: ^3.9.2