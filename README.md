# 👟 Mahendra Footwear — E-Commerce Website & Admin Control Center

A modern, responsive, real-time footwear e-commerce application for **Mahendra Footwear**, built with **React**, **Vite**, **Tailwind CSS**, and **Firebase** (Firestore, Authentication, Storage, and Hosting).

The platform features two synchronized interfaces:
1. **Customer-Facing Shopping Website**: Inspired by the clean, spacious layouts of Nike and Bata, featuring Men's and Ladies' footwear collections, dynamic search, price and size filters, persistent cart & wishlist, and direct WhatsApp order links with automatic price and size formatting.
2. **Secure Admin Dashboard**: Secure `/admin` portal to manage products, pricing, discounts, stock levels, product visibility, and shop contact/WhatsApp configurations in real-time.

---

## 🌟 Key Features

### 1. Customer Shopping Portal
- **Branding**: Warm off-white canvas, bold typography, rich cognac leather accents (`#9A3412`), and WhatsApp emerald badges.
- **4 Core Footwear Categories**:
  - **Men's Shoes**: Formal derbies, running sneakers, slip-on loafers.
  - **Men's Slippers**: Comfort slides, doctor orthopedic slippers, authentic Kolhapuri chappals.
  - **Ladies' Sandals**: Block heels, wedge walking sandals, ethnic golden flats.
  - **Ladies' Slippers**: Memory foam house slippers, soft plush velvet slides.
- **Dynamic Product Cards**:
  - Auto-calculated final price and discount savings (`Save ₹300 (20% OFF)`).
  - Stock availability badge (`In Stock`, `Only 2 left`, `Out of Stock`).
  - Available UK/IND sizes.
  - Direct 1-click **Order on WhatsApp** button.
  - Add to Cart & Wishlist toggles.
  - Out-of-stock items automatically show unavailable and block ordering.
- **Search, Filters & Sorting**:
  - Live keyword search by product name and description.
  - Filter by category (Men's / Ladies').
  - Filter by price ranges (Under ₹500, ₹500–₹1,000, ₹1,000–₹2,000, Above ₹2,000).
  - Filter by UK/IND sizes (4 to 11).
  - "Discounted Only" and "In-Stock Only" quick toggles.
  - Sorting: Price (Low to High, High to Low), Newest Arrivals, Highest Discount, Featured.
- **WhatsApp Direct & Multi-Item Cart Ordering**:
  - Individual product order link automatically pre-fills product name, category, selected size, quantity, unit price, and total.
  - Full-cart WhatsApp order formats an itemized receipt with all selected footwear items and calculated grand total.
  - Floating WhatsApp action button for quick customer queries.
- **Persistent Cart & Wishlist**:
  - Saved in browser `localStorage` with quantity increments/decrements capped at available stock.

---

### 2. Admin Management Dashboard (`/admin`)
- **Dashboard Overview**:
  - Total active products, out-of-stock count, active discounts, category distribution.
  - **Low Stock Warning Table** (products with $\le 5$ pairs) with a `+5` quick-add button.
  - Recently added/modified footwear.
- **Product Management**:
  - Add, edit, and delete products (with safety confirmation dialog).
  - Enforced category dropdown for the 4 official departments.
  - **Real-Time Discount Engine**:
    $$\text{Discount Amount} = \frac{\text{Original Price} \times \text{Discount Percentage}}{100}$$
    $$\text{Final Price} = \text{Original Price} - \text{Discount Amount}$$
    Calculated automatically with live preview. Negative prices and out-of-bound discounts (0–100%) are strictly prevented.
  - Stock inventory quantity adjustment.
  - Active/Inactive toggle (instantly hides or shows the product on the customer storefront without page reload).
  - Homepage Featured product toggle.
  - Product image upload to Firebase Storage with progress tracking, plus direct image URL support.
- **Shop & WhatsApp Settings**:
  - Configurable Shop Name, Tagline, Address, Contact Email, and Opening Hours.
  - Configurable **Shop WhatsApp Number** with international format validation (e.g. `919876543210`).
  - Announcement banner message displayed at the top of the store.
  - **1-Click "Load Default Catalog" button**: Seeds realistic footwear products across all 4 categories for instant testing.

---

### 3. Real-Time Synchronization
- Firestore `onSnapshot` listeners connect both the customer storefront and admin dashboard.
- Any change made by an administrator (price change, stock adjustment, deactivation, deletion) immediately reflects on all connected customer browsers without requiring a manual refresh.
- Includes a smooth local reactive fallback mode when running without Firebase credentials.

---

## 🚀 Quick Start (Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Admin Access
Click the **"Staff Login"** button in the header, or visit:
```
http://localhost:3000/admin/login
```
For instant evaluation before linking your Firebase project, use the pre-configured credentials:
- **Email**: `admin@mahendrafootwear.com`
- **Password**: `admin123`

---

## 🔒 Firebase Integration & Production Setup

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project named **Mahendra Footwear**.
2. Click **Add App** and select **Web** (`</>`). Register the app and copy your configuration keys.

### Step 2: Configure Environment Variables
Create a file named `.env.local` in the project root:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=mahendra-footwear.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mahendra-footwear
VITE_FIREBASE_STORAGE_BUCKET=mahendra-footwear.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### Step 3: Enable Firebase Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**.
2. Enable **Email/Password**.
3. Under the **Users** tab, click **Add user** and create your admin account (e.g. `owner@mahendrafootwear.com`).

### Step 4: Create Cloud Firestore Database
1. Go to **Firestore Database** > **Create database**.
2. Start in **Production mode** and choose your nearest region (e.g. `asia-south1` for India).
3. Create an `admins` document for your user:
   - Collection: `admins`
   - Document ID: `<User UID from Authentication tab>`
   - Fields:
     - `email`: `"owner@mahendrafootwear.com"` (string)
     - `role`: `"admin"` (string)
     - `createdAt`: `"2026-10-20T12:00:00.000Z"` (string)

### Step 5: Enable Firebase Storage
1. Go to **Storage** > **Get Started**.
2. Choose a bucket location and proceed with default rules.

### Step 6: Deploy Security Rules & Hosting
Install the Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
firebase login
firebase use --add  # Select your created Firebase project
```

Deploy Firestore and Storage security rules:
```bash
firebase deploy --only firestore:rules,storage:rules
```

Build and deploy to Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

Your website will be live on `https://<your-project-id>.web.app`!

---

## 📁 Project Structure

```
mahendrafootwear/
├── public/
│   ├── favicon.svg               # Brand favicon
│   └── placeholder-shoe.svg      # Fallback footwear graphic
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AnnouncementBar.jsx       # Real-time top announcement
│   │   │   ├── Navbar.jsx                # Nike/Bata style sticky navbar
│   │   │   ├── Footer.jsx                # Store info & WhatsApp order prompt
│   │   │   ├── WhatsAppFloatingButton.jsx # Floating click-to-chat action
│   │   │   └── ConfirmationModal.jsx     # Delete safety confirmation
│   │   ├── customer/
│   │   │   ├── HeroBanner.jsx            # Promotional hero showcase
│   │   │   ├── CategoryCards.jsx         # 4 department highlight cards
│   │   │   ├── ProductCard.jsx           # Footwear card with discount & WhatsApp
│   │   │   ├── ProductFilters.jsx        # Search, price, size & discount filters
│   │   │   ├── ProductDetailModal.jsx    # Photo gallery, size & stock selector
│   │   │   ├── CartDrawer.jsx            # Multi-item cart with WhatsApp checkout
│   │   │   ├── WishlistDrawer.jsx        # Customer saved items
│   │   │   └── CustomerHome.jsx          # Main customer storefront layout
│   │   └── admin/
│   │       ├── AdminLayout.jsx           # Dashboard shell & status indicator
│   │       ├── AdminLoginPage.jsx        # Secure auth with demo assistance
│   │       ├── AdminStatsOverview.jsx    # Low-stock alerts & metrics
│   │       ├── ProductListTable.jsx      # Inventory table with quick stock adjust
│   │       ├── ProductFormModal.jsx      # Product form with discount calculator
│   │       └── ShopSettingsForm.jsx      # WhatsApp phone & shop configuration
│   ├── context/
│   │   ├── AuthContext.jsx               # Firebase Auth state & admin verification
│   │   ├── SettingsContext.jsx           # Shop settings real-time subscription
│   │   ├── ProductContext.jsx            # Real-time Firestore product sync
│   │   ├── CartContext.jsx               # Shopping cart & stock limits
│   │   └── WishlistContext.jsx           # Saved items persistence
│   ├── services/
│   │   ├── firebase.js                   # Firebase SDK initialization
│   │   ├── productService.js             # Firestore CRUD with onSnapshot
│   │   ├── settingsService.js            # Settings sync with onSnapshot
│   │   ├── authService.js                # Admin login/logout logic
│   │   ├── storageService.js             # Image upload with progress tracking
│   │   └── seedData.js                   # Seed catalog with realistic products
│   ├── utils/
│   │   ├── pricing.js                    # Formula-driven discount engine
│   │   ├── whatsapp.js                   # WhatsApp link builder & phone sanitization
│   │   └── formatters.js                 # Currency (₹), categories & stock badges
│   ├── App.jsx                           # Root router and modal orchestrator
│   ├── index.css                         # Tailwind CSS directives
│   └── main.jsx                          # React DOM mount
├── firebase.json                         # Hosting rewrites and rules configuration
├── firestore.rules                       # Firestore security rules
├── storage.rules                         # Storage security rules
├── tailwind.config.js                    # Custom footwear brand theme
├── vite.config.js                        # Vite bundler configuration
└── package.json                          # Dependencies & build scripts
```

---

## 🛡️ Security Guarantees
- **No private service account keys or admin secrets** are exposed in frontend code.
- Firestore Security Rules restrict writes exclusively to authenticated administrators in `admins/{uid}`.
- Public customers can only read active products (`isActive == true`) and approved public store settings.
- Inactive or deleted products are shielded from public storefront views.
- Discount calculations and stock checks are validated on client and prepared for rule constraints.
