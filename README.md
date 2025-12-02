# Wellnest Connect - School Mental Wellness Platform (Frontend)

**A modern, responsive web application for comprehensive school mental health management.**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)

## 🎯 Overview

The Wellnest Connect platform provides a comprehensive solution for managing student mental health and wellbeing in educational institutions. Built with modern web technologies, it offers intuitive dashboards for Teachers, Counsellors, and School Leadership.

## ✨ Key Features

### For Teachers
- **Student Monitoring**: Track student wellbeing and behavior
- **Quick Observations**: Report concerns with severity levels
- **Class Overview**: View class-wide wellbeing metrics
- **Assessment Management**: Assign and track mental health assessments

### For Counsellors
- **Case Management**: Comprehensive counseling case workflows
- **Session Scheduling**: Calendar integration for counseling sessions
- **Journal & Notes**: Detailed case documentation
- **Risk Assessment**: AI-powered risk level tracking
- **Resource Library**: Access to mental health resources

### For School Leadership
- **Analytics Dashboard**: School-wide wellbeing trends
- **Risk Distribution**: Visual breakdown of at-risk students
- **Class Performance**: Compare wellbeing across grades/sections
- **AI Insights**: Data-driven recommendations
- **Governance**: Staff management and oversight

### Additional Features
- **Marketplace**: Book sessions with external therapists
- **Resource Center**: Curated mental health content
- **Webinars**: Access to mental health workshops
- **Activity Tracking**: Monitor student participation in wellbeing programs
- **Multi-theme Support**: Light and dark modes

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool |
| **Shadcn/ui** | Beautiful, accessible components |
| **Tailwind CSS** | Utility-first styling |
| **React Query** | Server state management |
| **React Hook Form** | Form handling with validation |
| **Zod** | Schema validation |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization |
| **Lucide Icons** | Modern icon library |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd calmbridge-mentalhealth-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**
- Open http://localhost:8080 in your browser

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── shared/            # Reusable components
│   ├── modals/            # Modal dialogs
│   └── layout/            # Layout components
├── pages/
│   ├── teacher/           # Teacher portal
│   ├── counsellor/        # Counsellor portal
│   ├── leadership/        # Principal portal
│   └── student/           # Student portal
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── contexts/              # React contexts
├── lib/                   # Utilities
└── assets/                # Static assets
```

## 🎨 UI Components

Built with **Shadcn/ui** for:
- Consistent design system
- Accessibility out of the box
- Customizable theming
- Type-safe components

### Key Components
- `DataTable` - Sortable, searchable tables
- `MetricChart` - Line, bar, and pie charts
- `StatCard` - Dashboard metrics
- Modal system for forms and details
- Form components with validation

## 🔑 Authentication

The app uses JWT-based authentication with role-based routing:

**Demo Credentials:**
```
Counsellor: counsellor@demo.school / password123
Teacher: teacher@demo.school / password123
Principal: principal@demo.school / password123
```

## 🎨 Theming

The app supports light and dark themes using CSS variables:

```css
/* Theme colors defined in src/index.css */
--primary: /* Primary brand color */
--secondary: /* Secondary color */
--accent: /* Accent color */
/* ... */
```

Tailwind config extends with custom colors and animations.

## 📊 State Management

- **React Query** for server state (caching, refetching)
- **React Context** for auth and app-level state
- **React Hook Form** for form state
- Local state with `useState` hook

## 🧪 Development

### Code Quality
```bash
# Lint code
npm run lint

# Type checking
npm run type-check

# Format code (if configured)
npm run format
```

### Development Tools
- Hot Module Replacement (HMR) via Vite
- React DevTools browser extension
- TypeScript IntelliSense

## 🌐 API Integration

All API calls are centralized in `src/services/`:
- `api.ts` - Base API client
- `students.ts` - Student endpoints
- `cases.ts` - Case management
- `assessments.ts` - Assessment APIs
- And more...

Using React Query hooks:
```typescript
import { useStudents } from '@/hooks/useStudents';

const { data, isLoading } = useStudents();
```

## 📱 Responsive Design

Fully responsive design with breakpoints:
- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## 🚢 Deployment

### Environment Variables
```env
VITE_API_BASE_URL=https://api.yourschool.com/api/v1
```

### Deployment Options

**Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

**Netlify**
```bash
npm run build
netlify deploy --prod
```

**Traditional Hosting**
```bash
npm run build
# Upload dist/ folder to your web server
```

## 🔒 Security

- XSS protection via React's auto-escaping
- CSRF protection via JWT tokens
- Secure HTTP-only cookies (if enabled)
- Input validation with Zod schemas
- Role-based route protection

## ♿ Accessibility

- WCAG 2.1 AA compliant components
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- Focus management

## 🎯 Performance

- Code splitting with React.lazy
- Optimized bundle size with Vite
- Image lazy loading
- React Query caching
- Memoization with useMemo/useCallback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checks
5. Submit a pull request

## 📝 License

Proprietary - Wellnest Connect © 2024

## 🆘 Support

For issues or questions, contact: support@wellnestconnect.com

---

**Built with ❤️ for student mental health and wellbeing**
