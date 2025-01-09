# Job Portal Frontend

A modern job portal application built with Vue 3, featuring a responsive design and comprehensive job search functionality.

## Features

- **User Authentication**
  - Registration with role selection (Job Seeker/Employer)
  - Login with remember me functionality
  - Password reset capabilities
  - Protected routes

- **Job Seeker Features**
  - Browse job listings with advanced filters
  - Search jobs by title, location, or company
  - Apply to jobs with resume/CV upload
  - Track application status
  - Save favorite jobs
  - Profile management

- **Employer Features**
  - Post new job listings
  - Manage job postings
  - View and manage applications
  - Company profile management

## Tech Stack

- **Framework:** Vue 3
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **UI Framework:** Bootstrap 5
- **Icons:** Bootstrap Icons
- **HTTP Client:** Axios
- **Form Validation:** Vue Native Validation

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable Vue components
│   │   ├── common/    # Common UI components
│   │   ├── forms/     # Form components
│   │   └── layout/    # Layout components
│   ├── layouts/        # Page layouts
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   │   ├── auth.js    # Authentication store
│   │   └── jobs.js    # Jobs store
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
└── package.json        # Dependencies and scripts
```

## Setup and Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd job_portal/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Job Portal"
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## Component Documentation

### Views

- **Home.vue**: Landing page with featured jobs and search functionality
- **Login.vue**: User authentication page
- **Register.vue**: User registration with role selection
- **JobListings.vue**: Browse and search job listings
- **JobDetails.vue**: Detailed view of a job posting
- **ApplicationForm.vue**: Job application form
- **Dashboard.vue**: User dashboard (different for job seekers and employers)

### Stores

- **auth.js**: Handles user authentication and profile management
- **jobs.js**: Manages job listings and applications

### Layouts

- **AuthLayout.vue**: Layout for authentication pages
- **DefaultLayout.vue**: Main application layout
- **DashboardLayout.vue**: Dashboard layout with sidebar navigation

## Authentication

The application uses token-based authentication:
- JWT tokens are stored in localStorage
- Automatic token refresh
- Protected route guards
- Role-based access control

## API Integration

- Base URL configuration in environment variables
- Axios interceptors for authentication
- Error handling and response transformation
- Request/response logging in development

## Styling

- Bootstrap 5 for responsive design
- Custom SCSS variables for theming
- Consistent component styling
- Mobile-first approach

## Performance Optimization

- Lazy loading of routes
- Component code splitting
- Asset optimization
- Caching strategies

## Testing

Run tests with:
```bash
npm run test
```

## Responsive Design

The application is fully responsive and tested on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request


