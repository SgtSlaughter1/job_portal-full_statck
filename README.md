# Job Portal Application

A modern job portal application built with Vue 3 and Laravel that connects job seekers with employers. The platform provides an intuitive interface for job searching, applications, and recruitment management.

## Features

### For Job Seekers
- Browse and search job listings
- Filtering options
- Easy job application process
- Application tracking
- Profile management
- Save favorite jobs

### For Employers
- Post and manage job listings
- Review applications
- Company profile management
- Applicant tracking system

## Tech Stack

### Frontend
- **Framework:** Vue 3
- **State Management:** Pinia
- **Routing:** Vue Router
- **UI Framework:** Bootstrap 5
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Backend
- **Framework:** Laravel 10
- **Database:** MySQL
- **Server:** Apache
- **Authentication:** Sanctum 

## Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- PHP (v8.1 or higher)
- Composer
- MySQL
- Apache

## Installation

### Backend Setup

1. Start Apache and MySQL services:

**For XAMPP:**
# Start Apache

# Start MySQL


2. Create database:

# CREATE DATABASE job_portal;

3. Configure backend environment:
```bash
cd backend

Edit `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_portal
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Add CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

4. Install backend dependencies:
composer install

5. Generate application key:

php artisan key:generate

6. Run migrations and seeders:

php artisan migrate
php artisan db:seed


7. Start Laravel development server:

php artisan serve


### Frontend Setup

1. Install dependencies:
Open a new terminal
cd frontend
npm install
```


2. Start development server:
```bash
npm run dev
```


## Project Structure

```
project/
├── frontend/           # Vue frontend application
│   ├── public/        # Static assets
│   ├── src/           # Source files
│   └── package.json   # Frontend dependencies
│
├── backend/           # Laravel backend application
│   ├── app/          # Application logic
│   ├── database/     # Migrations and seeders
│   ├── routes/       # API routes
│   └── .env         # Backend environment variables
```

## Default Users

After running seeders, register then login with the account created 

## Common Issues

1. **CORS Issues:**
   - Ensure your backend `.env` has correct CORS settings
   - Check frontend API URL matches backend URL

2. **Database Connection:**
   - Verify MySQL service is running
   - Check database credentials in `.env`
   - Ensure database exists

3. **Apache/MySQL Services:**
   - If using XAMPP, ensure ports aren't conflicting
   - Check error logs in `/opt/lampp/logs/`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



