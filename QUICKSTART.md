# 🚀 Quick Start - TDRMF Website

**Built from your React boilerplate + Python backend**

## ✅ What's Been Fixed

I've reorganized the project to use your existing React boilerplate at the root level instead of the complex monorepo structure. Much simpler now!

## 📁 New Structure

```
dorothy-foundation/
├── src/                   # Your React app (TypeScript now)
│   ├── components/        # Reusable UI components
│   ├── features/          # Admin, events, donations, etc.
│   ├── routes/            # All pages (Home, About, Donate, etc.)
│   ├── lib/               # Utilities, API client, types
│   └── styles/            # Tailwind CSS styles
│
├── backend/               # Python FastAPI backend
│   ├── app/              # Main application code
│   ├── alembic/          # Database migrations
│   └── scripts/          # Seed data, etc.
│
├── package.json          # Frontend deps (at root)
├── vite.config.ts        # Vite config
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS
└── docker-compose.yml    # Run everything with Docker
```

## 🏃 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
# Frontend (at root)
npm install

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Set Up Environment
```bash
# Copy env files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit both .env files and add your Stripe test keys
# Get them from: https://dashboard.stripe.com/test/apikeys
# Optionally add VITE_CLERK_PUBLISHABLE_KEY for Clerk authentication
```

### 3. Start Database (Docker)
```bash
docker-compose up -d postgres minio
```

### 4. Run Migrations & Seed Data
```bash
cd backend
alembic upgrade head
python scripts/seed.py
cd ..
```

### 5. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev
```

## 🌐 Access the Site

- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
  - Email: `admin@tdrmf.org`
  - Password: `admin123`
- **API Docs**: http://localhost:8000/docs

## 🎨 What's Included

### Frontend Pages (All Built!)
- ✅ Home with hero and core values
- ✅ About Dorothy and the foundation
- ✅ Events listing and detail pages
- ✅ Donate with Stripe (one-time & recurring)
- ✅ Volunteer application form
- ✅ Photo gallery with submissions
- ✅ Sponsors page
- ✅ Contact form
- ✅ Privacy & Terms pages

### Admin Dashboard
- ✅ Secure login
- ✅ Manage events (create, edit, publish)
- ✅ Moderate gallery photos (approve/reject)
- ✅ View donations & export CSV
- ✅ Manage sponsor tiers

### Backend API
- ✅ Authentication with JWT
- ✅ Event management
- ✅ Stripe payment processing
- ✅ S3 file storage
- ✅ Email notifications
- ✅ All CRUD operations

## 🎯 Test It Out

### 1. Create an Event
1. Go to http://localhost:3000/admin/login
2. Login with `admin@tdrmf.org` / `admin123`
3. Click "Events" → "Create Event"
4. Fill in details, check "Publish"
5. Go to http://localhost:3000/events - see your event!

### 2. Make a Test Donation
1. Go to http://localhost:3000/donate
2. Select $25
3. Click "Proceed to Payment"
4. Use test card: `4242 4242 4242 4242`
5. Any future date, any CVC
6. See success message!
7. Check admin dashboard for the donation

### 3. Upload a Photo
1. Go to http://localhost:3000/gallery/submit
2. Upload any JPG/PNG image
3. Fill in details, check consent
4. Go to admin → Gallery
5. Approve the photo
6. Check public gallery - it's there!

## 🔧 Key Files to Customize

### Content
- `src/lib/content.ts` - All site copy (mission, values, contact info)

### Styling
- `tailwind.config.js` - Colors and theme
- `src/styles/index.css` - Global styles

### Environment
- `.env` - Frontend config (Stripe public key, API URL)
- `backend/.env` - Backend config (Stripe secret, database, SMTP)

## 📝 Common Commands

```bash
# Start everything
make dev

# Run migrations
make migrate

# Seed database
make seed

# Install all deps
make install

# Format code
make fmt

# With Docker
make docker-up
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Kill processes on port 8000
lsof -ti:8000 | xargs kill -9
```

### Database Connection Error
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Or check if it's running
docker-compose ps
```

### Stripe Not Working
- Make sure you're using test keys (start with `pk_test_` and `sk_test_`)
- Check both `.env` files have the keys
- Restart both servers after adding keys

## 🎉 You're All Set!

The site is production-ready and built exactly on your React boilerplate. Just add your Stripe keys, customize the content, and you're ready to deploy!

**From Loss to Light.** ✨

---

**Need Help?** Check the full README.md for detailed documentation.

