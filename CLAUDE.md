# Finn's Family Moving - Website

A simple 3-page website for Finn's Family Moving, a local moving and junk removal business.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Hosting**: Vercel

## Project Structure

```
hayden-company-website/
├── app/
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Home page
│   ├── about/
│   │   └── page.tsx        # About Us page
│   └── contact/
│       └── page.tsx        # Contact/Book page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   └── ContactForm.tsx     # Booking/contact form
├── public/
│   ├── logo/
│   │   └── FFM.Final.png   # Company logo
│   └── photos/             # Team/service photos
├── logo/                   # Original logo assets
│   └── FFM.Final.png
└── package.json
```

## Pages

### Home (`/`)
- Hero section with logo and tagline
- Brief intro to services (moving, junk removal)
- Call-to-action buttons linking to Contact page
- Photo gallery preview

### About Us (`/about`)
- Company story and mission
- Team information
- Service area details
- Photos of team/trucks in action

### Contact / Book (`/contact`)
- Contact form with fields:
  - Name, Email, Phone
  - Service type (moving/junk removal)
  - Preferred date
  - Message/details
- Direct contact info (phone, email)
- Business hours
- Service area

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Development server runs at `http://localhost:3000`

## Deployment

Deployed via Vercel. Push to main branch to trigger automatic deployment.

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## Assets

- **Logo**: `logo/FFM.Final.png` - Orange shield logo for Finn's Family Moving
- **Photos**: Add service/team photos to `public/photos/`

## TODO

- [ ] Update contact info (phone, email) in Footer and Contact page
- [ ] Connect contact form to email service (e.g., Resend, SendGrid, Formspree)
- [ ] Add team/service photos to `public/photos/`
- [ ] Add photo gallery component to Home and About pages
- [ ] Update service area details
- [ ] Set up Vercel deployment
