# The Dorothy R. Morgan Foundation Website

**From Loss to Light**

A production-ready foundation website honoring Dorothy R. Morgan, lost on 9/11, supporting families, healing, and youth programs.

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** + **Zod** for form validation
- **Stripe** for payment processing
- **Radix UI** and **Headless UI** for accessible components
- **Yet Another React Lightbox** for gallery

### Backend
- **Python 3.12**
- **FastAPI** for API
- **PostgreSQL** for database
- **SQLAlchemy** + **Alembic** for ORM and migrations
- **Stripe SDK** for payments
- **Clerk** for admin authentication
- **Boto3** for S3-compatible storage
- **aiosmtplib** for email notifications

### DevOps
- **Docker** and **Docker Compose** for local development
- **Nginx** for frontend serving
- **MinIO** for local S3-compatible storage
- **Makefile** for common tasks

## 📦 Project Structure

```
dorothy-foundation/
├── src/                    # React TypeScript frontend
│   ├── components/         # Reusable components
│   ├── features/           # Feature modules (admin, events, etc.)
│   ├── routes/             # Page components
│   ├── lib/                # Utilities, API client, types
│   └── styles/             # Global styles
│
├── backend/                # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes/     # API endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── core/           # Config and database
│   ├── alembic/            # Database migrations
│   ├── scripts/            # Utility scripts
│   ├── Dockerfile
│   └── requirements.txt
│
├── public/                 # Static assets
├── index.html             # Entry HTML
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite config
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
├── docker-compose.yml     # Local development stack
├── Makefile              # Common commands
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.12+
- **PostgreSQL** 15+
- **Docker** and Docker Compose (for local development)
- **Stripe** account (test mode keys)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dorothy-foundation
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp .env.example .env
   ```

3. **Edit `.env` files with your Stripe keys** (at minimum)

4. **Start all services**
   ```bash
   make docker-up
   ```

5. **Run database migrations and seed data**
   ```bash
   docker-compose exec backend alembic upgrade head
   docker-compose exec backend python scripts/seed.py
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### Option 2: Manual Setup

1. **Set up PostgreSQL**
   ```bash
   createdb tdrmf
   ```

2. **Backend setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   alembic upgrade head
   python scripts/seed.py
   uvicorn app.main:app --reload --port 8000
   ```

3. **Frontend setup** (in a new terminal)
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

## 🔑 Environment Variables

### Backend (`backend/.env`)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tdrmf

# Clerk (admin authentication)
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# S3 (MinIO for local, S3 for production)
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=tdrmf-gallery
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_TO_EMAIL=info@tdrmf.org

# CORS
FRONTEND_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

### Frontend (`.env`)

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
VITE_SITE_URL=http://localhost:3000
```

## 🔐 Admin Setup (Clerk)

Admin access uses [Clerk](https://clerk.com) with role-based authorization. Only users with `publicMetadata.role = "admin"` can access the admin panel and API.

### 1. Create a Clerk application

1. Sign up at [clerk.com](https://clerk.com) and create an application
2. Copy the **Publishable Key** to frontend `.env` as `VITE_CLERK_PUBLISHABLE_KEY`
3. Copy the **Secret Key** to backend `.env` as `CLERK_SECRET_KEY`

### 2. Restrict sign-up (recommended)

In the Clerk Dashboard, disable public sign-up or restrict to invite-only so only authorized users can create accounts.

### 3. Create admin users

1. In Clerk Dashboard → **Users**, create or invite admin users
2. For each admin user, set **Public metadata**:
   ```json
   { "role": "admin" }
   ```

### 4. Sign in

1. Go directly to `/admin` (bookmark this URL)
2. Sign in with your Clerk admin account when prompted

**Note:** The legacy email/password login at `/admin/login` has been removed. Admin access is Clerk-only.

## 📝 Common Commands

```bash
# Development
make dev              # Run frontend and backend
make docker-up        # Start Docker services
make docker-down      # Stop Docker services

# Setup
make setup            # Install deps + migrate + seed
make install          # Install all dependencies
make migrate          # Run database migrations
make seed             # Seed database with sample data

# Code Quality
make fmt              # Format code (Prettier + Ruff)
make lint             # Lint code (ESLint + Ruff)
make test             # Run all tests

# Cleanup
make clean            # Remove build artifacts
```

## 🎨 Key Features

### Public Features
- ✅ Responsive home page with hero, core values, and upcoming events
- ✅ About page with Dorothy's story and mission
- ✅ Events listing and detail pages with RSVP
- ✅ Stripe-powered donation system (one-time and recurring)
- ✅ Volunteer application form
- ✅ Photo gallery with lightbox
- ✅ Gallery submission form with S3 upload
- ✅ Sponsor tier display
- ✅ Contact form with email notifications
- ✅ Privacy policy and donation terms pages

### Admin Dashboard
- ✅ Clerk-based authentication with role gating (`publicMetadata.role = "admin"`)
- ✅ Event management (CRUD with publish toggle)
- ✅ Gallery moderation (approve/reject submissions)
- ✅ Donation records and statistics
- ✅ Sponsor tier management
- ✅ CSV export for donations

### Technical Features
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with custom design system
- ✅ Form validation with Zod
- ✅ Accessible components (WCAG 2.1 AA)
- ✅ S3-compatible file storage
- ✅ Stripe webhook handling
- ✅ Email notifications
- ✅ Toast notifications
- ✅ Docker deployment ready

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
pytest
```

### Frontend Tests
```bash
cd apps/frontend
npm test
```

### Manual Smoke Test Checklist

Run these tests to verify the application:

1. **Home Page**
   - [ ] Page loads correctly
   - [ ] Core values display
   - [ ] Upcoming events show
   - [ ] Donate button works

2. **Events**
   - [ ] Events list displays
   - [ ] Event detail page loads
   - [ ] RSVP form submits

3. **Donate**
   - [ ] Stripe form loads
   - [ ] Test donation with card `4242 4242 4242 4242`
   - [ ] Success page displays
   - [ ] Receipt email sent

4. **Gallery**
   - [ ] Gallery photos display
   - [ ] Lightbox opens
   - [ ] Submit form uploads photo
   - [ ] File size validation works

5. **Admin**
   - [ ] Sign in via Clerk with an admin user (`publicMetadata.role = "admin"`)
   - [ ] Dashboard shows statistics
   - [ ] Create new event
   - [ ] Approve gallery photo
   - [ ] View donations list
   - [ ] Export donations CSV

## 📊 Database Schema

### Core Models

**User** - Legacy admin users (seed data only; admin auth is via Clerk)
- id, email, hashed_password, role

**Event** - Community events
- id, title, summary, description, start_at, end_at, location, external_registration_url, is_published

**Donation** - Donation records
- id, amount_cents, currency, donor_email, donor_name, stripe_payment_intent_id, stripe_subscription_id, status, is_recurring, dedication_note

**GalleryPhoto** - Photo submissions
- id, title, description, uploader_name, uploader_email, s3_key, approved, consent_signed, consent_ip

**SponsorTier** - Sponsorship levels
- id, name, amount_cents, benefits_json, is_active

**AuditLog** - Activity tracking
- id, actor_id, action, entity, entity_id, meta_json

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Connect repository to Vercel/Netlify
2. Set root directory: `.` (project root)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables from `.env.example`
6. Deploy

### Backend (Render/Fly.io)

1. Create new Web Service
2. Connect repository
3. Set root directory: `backend`
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy

**Render Python version:** Render defaults to Python 3.14 for new services. This project uses Python 3.12 (see `backend/.python-version`). If the build still picks 3.14, add this environment variable on Render: `PYTHON_VERSION=3.12.8`

### Database (Managed PostgreSQL)

Use managed PostgreSQL from:
- **Render** (render.com)
- **Neon** (neon.tech)
- **Supabase** (supabase.com)

Update `DATABASE_URL` in backend environment.

### Storage (S3/R2)

For production, use:
- **AWS S3** (aws.amazon.com/s3)
- **Cloudflare R2** (cloudflare.com/products/r2)
- **DigitalOcean Spaces** (digitalocean.com/products/spaces)

Update S3 credentials in backend environment.

## 📸 Replacing Hero Images

To replace the hero images:

1. **Skyline photo**: Place in `apps/frontend/src/assets/hero-skyline.jpg`
2. **Dorothy's photo**: Place in `apps/frontend/src/assets/dorothy.jpg`
3. Update `src/routes/Home.tsx`:
   ```tsx
   import heroSkyline from '@/assets/hero-skyline.jpg'
   
   <Hero
     title="The Dorothy R. Morgan Foundation"
     subtitle="From Loss to Light"
     backgroundImage={heroSkyline}
   />
   ```

## 💰 Exporting Donations CSV

### Via Admin Dashboard
1. Sign in to `/admin` with a Clerk admin account
2. Go to "Donations"
3. Click "Export CSV"

### Via API
```bash
curl -H "Authorization: Bearer YOUR_CLERK_SESSION_TOKEN" \
  http://localhost:8000/api/donations/list > donations.json
```

## 📅 Adding Sponsor Tiers for Events

1. Sign in to the admin dashboard with a Clerk admin account
2. Go to "Sponsors" section
3. Click "Create Tier"
4. Fill in:
   - **Name**: "Gold Event Sponsor"
   - **Amount**: 5000
   - **Benefits**: JSON format
     ```json
     {
       "benefit1": "Logo on event materials",
       "benefit2": "Recognition during event",
       "benefit3": "4 complimentary tickets"
     }
     ```
5. Check "Active tier"
6. Save

## 🔧 Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:8000/api/donations/webhook
   ```
4. Copy webhook secret to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

For production:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-api.com/api/donations/webhook`
3. Select events: `payment_intent.succeeded`, `customer.subscription.created`
4. Copy signing secret to production environment

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
echo $DATABASE_URL
```

### Stripe Payment Not Working
- Verify `STRIPE_PUBLISHABLE_KEY` matches `STRIPE_SECRET_KEY` (test/live)
- Check Stripe Dashboard for errors
- Ensure webhook secret is correct

### S3 Upload Failing
- Check MinIO is running: `docker ps`
- Access MinIO console: http://localhost:9001
- Create bucket: `tdrmf-gallery`
- Verify credentials in `.env`

### Frontend Not Connecting to Backend
- Check CORS settings in `apps/backend/app/main.py`
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check network tab in browser DevTools

## 📞 Support

For questions or issues:
- **Email**: dev@tdrmf.org
- **Documentation**: See `/docs` folder
- **API Docs**: http://localhost:8000/docs (when running)

## 📄 License

© 2024 The Dorothy R. Morgan Foundation. All rights reserved.

## 🙏 Acknowledgments

Built with ❤️ to honor Dorothy R. Morgan and support families in healing and growth.

**From Loss to Light.**

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Create Clerk admin users with `publicMetadata.role = "admin"`
- [ ] Disable public sign-up in Clerk Dashboard
- [ ] Set `CLERK_SECRET_KEY` in production backend environment
- [ ] Switch Stripe keys to live mode
- [ ] Configure production SMTP settings
- [ ] Set up production database backups
- [ ] Configure S3 bucket with proper permissions
- [ ] Enable HTTPS/SSL
- [ ] Set up domain DNS
- [ ] Configure CORS for production domain
- [ ] Test all forms and payments
- [ ] Run security audit
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Review and update legal pages
- [ ] Test email deliverability
- [ ] Set up error tracking (Sentry)
