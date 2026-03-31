# Smart Healthcare Management System - Complete Documentation

## 📋 **Table of Contents**
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [User Roles & Features](#user-roles--features)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Installation Guide](#installation-guide)
8. [Configuration](#configuration)
9. [User Manual](#user-manual)
10. [Troubleshooting](#troubleshooting)
11. [Security Features](#security-features)
12. [Future Enhancements](#future-enhancements)

---

## 📖 **Project Overview**

### **Project Name:** Smart Healthcare Management System
### **Version:** 1.0.0
### **Author:** Gowthamraj K (Modified by Rakesh Raushan)
### **Project Type:** Full-Stack Web Application with AI Integration

### **Description**
The Smart Healthcare Management System is a comprehensive web-based platform designed to digitize and streamline healthcare operations. It provides a unified solution for managing hospital operations, patient care, doctor appointments, and prescription management with integrated AI-powered disease prediction capabilities.

### **Key Objectives**
- Digitalize healthcare management processes
- Provide role-based access control for different user types
- Enable efficient appointment booking and management
- Facilitate prescription management and printing
- Integrate AI-based disease prediction for enhanced diagnosis
- Ensure secure and scalable healthcare data management

---

## 🏗️ **System Architecture**

### **Architecture Type:** Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│  │   Angular Frontend  │ │     AI Disease Predictor      │ │
│  │   (Port: 4200)      │ │     (Flask - Port: 10000)     │ │
│  └─────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          Spring Boot Backend (Port: 8081)              │ │
│  │  • REST API Controllers                                │ │
│  │  • Business Logic Services                             │ │
│  │  • Security & Authentication                           │ │
│  │  • JWT Token Management                                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              MySQL Database                            │ │
│  │  • User Management Tables                              │ │
│  │  • Doctor & Patient Records                            │ │
│  │  • Appointment Management                              │ │
│  │  • Prescription Storage                                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Component Breakdown**

#### **Frontend Components**
- **Angular 12 Application** - Main web interface
- **Responsive Design** - Bootstrap-based UI
- **Role-based Dashboards** - Separate interfaces for Admin, Doctor, User
- **Real-time Updates** - Dynamic data visualization

#### **Backend Components**
- **Spring Boot Application** - RESTful API server
- **JWT Authentication** - Secure token-based authentication
- **Spring Security** - Authorization and access control
- **JPA/Hibernate** - Database ORM and management

#### **AI Component**
- **Flask Application** - Machine learning service
- **Disease Prediction** - Symptom-based diagnosis
- **Multiple ML Models** - Decision Tree, Random Forest, Naive Bayes

---

## 💻 **Technology Stack**

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 12.0.3 | Frontend Framework |
| TypeScript | 4.2.3 | Programming Language |
| HTML5 | Latest | Markup Language |
| CSS3 | Latest | Styling |
| Bootstrap | 5.0.1 | UI Framework |
| jQuery | 3.6.0 | DOM Manipulation |
| Font Awesome | 4.7.0 | Icons |
| Angular Material | 12.0.5 | Material Design Components |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 2.5.1 | Backend Framework |
| Spring Security | 2.5.1 | Security & Authentication |
| Spring Data JPA | 2.5.1 | Data Access Layer |
| Hibernate | 5.5.3 | ORM Framework |
| JWT | 0.9.1 | Token-based Authentication |
| Maven | 3.6+ | Build Tool |
| Java | 11+ | Programming Language |

### **Database Technology**
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL | 8.0+ | Primary Database |
| MySQL Connector | 8.0.25 | Database Driver |

### **AI/ML Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Programming Language |
| Flask | 2.0+ | Web Framework |
| Scikit-learn | 1.0+ | Machine Learning Library |
| Pandas | 1.3+ | Data Manipulation |
| NumPy | 1.21+ | Numerical Computing |

---

## 👥 **User Roles & Features**

### **1. ADMIN Role** 🔭

#### **Dashboard Features**
- **System Overview**: Total users, doctors, patients, appointments
- **Real-time Statistics**: Live data visualization
- **Quick Actions**: Direct access to management functions

#### **User Management**
- **View All Users**: Complete user database with search and filter
- **User Registration**: Manual user account creation
- **Account Status**: Enable/disable user accounts
- **User Analytics**: Registration trends and user activity

#### **Doctor Management**
- **Add Doctors**: Manual doctor registration with verification
- **Approve/Reject**: Doctor registration approval workflow
- **Doctor List**: Complete doctor database with specializations
- **Qualification Verification**: Document and credential validation
- **Status Management**: Active/inactive doctor status control

#### **Patient Management**
- **Patient List**: Complete patient database
- **Medical History**: Access to patient medical records
- **Appointment History**: Patient appointment tracking
- **Prescription History**: Patient medication records

#### **System Administration**
- **Appointment Oversight**: System-wide appointment monitoring
- **Prescription Analytics**: Medication prescription trends
- **System Reports**: Comprehensive system usage reports
- **Data Backup**: System data backup and recovery

### **2. DOCTOR Role** ❤️

#### **Dashboard Features**
- **Personal Statistics**: Prescriptions given, patients treated
- **Today's Schedule**: Current day appointments
- **Patient Overview**: Active patient count
- **Quick Actions**: Access to frequently used functions

#### **Profile Management**
- **Edit Profile**: Update personal and professional information
- **Qualification Updates**: Modify educational and experience details
- **Specialization**: Update medical specializations
- **Contact Information**: Manage contact details

#### **Appointment Management**
- **Schedule Slots**: Create available time slots for appointments
- **View Appointments**: Today's and upcoming appointments
- **Appointment Status**: Accept/reject appointment requests
- **Patient History**: Access patient previous appointments

#### **Patient Care**
- **Patient List**: View all assigned patients
- **Medical Records**: Access patient medical history
- **Treatment Plans**: Create and manage treatment protocols
- **Follow-up Scheduling**: Schedule patient follow-up appointments

#### **Prescription Management**
- **Create Prescriptions**: Digital prescription creation
- **Prescription History**: View all issued prescriptions
- **Drug Interaction Check**: Medication compatibility verification
- **Dosage Guidelines**: Standard dosage recommendations

#### **Professional Features**
- **Approval Status**: Check registration approval status
- **Peer Network**: Connect with other doctors
- **Medical Updates**: Access to latest medical information
- **Continuing Education**: Professional development resources

### **3. USER/PATIENT Role** 😄

#### **Dashboard Features**
- **Personal Health Overview**: Health statistics and records
- **Upcoming Appointments**: Scheduled medical appointments
- **Recent Prescriptions**: Latest medication prescriptions
- **Health Metrics**: Personal health tracking

#### **Profile Management**
- **Personal Information**: Update contact and personal details
- **Medical History**: View and update medical history
- **Emergency Contacts**: Manage emergency contact information
- **Insurance Details**: Health insurance information management

#### **Doctor Services**
- **Doctor Search**: Find doctors by specialization
- **Doctor Profiles**: View doctor qualifications and experience
- **Availability Check**: Real-time doctor availability
- **Rating & Reviews**: Rate and review doctor services

#### **Appointment Management**
- **Book Appointments**: Schedule appointments with doctors
- **View Schedule**: Upcoming and past appointments
- **Appointment Status**: Check approval status
- **Reschedule/Cancel**: Modify or cancel appointments
- **Appointment Reminders**: Automated appointment notifications

#### **Prescription Services**
- **View Prescriptions**: Access all medical prescriptions
- **Prescription History**: Complete medication history
- **Print Prescriptions**: Generate printable prescription copies
- **Drug Information**: Detailed medication information
- **Refill Requests**: Request prescription refills

#### **Health Records**
- **Medical History**: Complete medical record access
- **Test Results**: Laboratory and diagnostic test results
- **Treatment History**: Previous treatment records
- **Vaccination Records**: Immunization history

---

## 🗄️ **Database Design**

### **Entity Relationship Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      USER       │    │     DOCTOR      │    │   APPOINTMENTS  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ email (PK)      │    │ email (PK)      │    │ id (PK)         │
│ username        │◄──┐│ doctorname      │◄──┐│ patient_email   │
│ mobile          │   ││ mobile          │   ││ doctor_email    │
│ gender          │   ││ gender          │   ││ appointment_date│
│ age             │   ││ experience      │   ││ slot_time       │
│ address         │   ││ specialization  │   ││ status          │
│ password        │   ││ previous_hospital│   ││ symptoms        │
└─────────────────┘   ││ address         │   │└─────────────────┘
                      ││ password        │   │
                      ││ status          │   │
                      │└─────────────────┘   │
                      │                      │
                      │┌─────────────────┐   │
                      ││     SLOTS       │   │
                      │├─────────────────┤   │
                      ││ id (PK)         │   │
                      ││ doctor_email    │───┘
                      ││ date            │
                      ││ start_time      │
                      ││ end_time        │
                      ││ availability    │
                      │└─────────────────┘
                      │
                      │┌─────────────────┐
                      ││ PRESCRIPTION    │
                      │├─────────────────┤
                      ││ id (PK)         │
                      ││ patient_name    │
                      ││ doctor_email    │───┘
                      ││ medicines       │
                      ││ dosage          │
                      ││ instructions    │
                      ││ issue_date      │
                      │└─────────────────┘
```

### **Table Specifications**

#### **USER Table**
```sql
CREATE TABLE user (
    email VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    mobile VARCHAR(15),
    gender VARCHAR(10),
    age VARCHAR(3),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **DOCTOR Table**
```sql
CREATE TABLE doctor (
    email VARCHAR(255) PRIMARY KEY,
    doctorname VARCHAR(100) NOT NULL,
    mobile VARCHAR(15),
    gender VARCHAR(10),
    experience VARCHAR(50),
    specialization VARCHAR(100),
    previous_hospital VARCHAR(200),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(10) DEFAULT 'false',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **APPOINTMENTS Table**
```sql
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_email VARCHAR(255),
    doctor_email VARCHAR(255),
    appointment_date DATE,
    slot_time VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    symptoms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_email) REFERENCES user(email),
    FOREIGN KEY (doctor_email) REFERENCES doctor(email)
);
```

#### **SLOTS Table**
```sql
CREATE TABLE slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_email VARCHAR(255),
    date DATE,
    start_time TIME,
    end_time TIME,
    availability BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_email) REFERENCES doctor(email)
);
```

#### **PRESCRIPTION Table**
```sql
CREATE TABLE prescription (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100),
    doctor_email VARCHAR(255),
    medicines TEXT,
    dosage TEXT,
    instructions TEXT,
    issue_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_email) REFERENCES doctor(email)
);
```

---

## 🔌 **API Documentation**

### **Base URL:** `http://localhost:8081`

### **Authentication Endpoints**

#### **POST /login**
**Description:** Unified login for all user types
**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "token": "jwt-token-string",
    "role": "admin|doctor|user",
    "email": "user@example.com",
    "name": "User Name"
}
```

#### **POST /loginuser**
**Description:** User-specific login endpoint
**Request Body:**
```json
{
    "email": "patient@example.com",
    "password": "password123"
}
```

#### **POST /logindoctor**
**Description:** Doctor-specific login endpoint
**Request Body:**
```json
{
    "email": "doctor@example.com",
    "password": "password123"
}
```

### **Registration Endpoints**

#### **POST /registeruser**
**Description:** Register a new user/patient
**Request Body:**
```json
{
    "email": "patient@example.com",
    "username": "John Doe",
    "mobile": "1234567890",
    "gender": "Male",
    "age": "30",
    "address": "123 Main St",
    "password": "password123"
}
```

#### **POST /registerdoctor**
**Description:** Register a new doctor
**Request Body:**
```json
{
    "email": "doctor@example.com",
    "doctorname": "Dr. Smith",
    "mobile": "1234567890",
    "gender": "Male",
    "experience": "5 years",
    "specialization": "Cardiology",
    "previous_hospital": "City Hospital",
    "address": "456 Medical St",
    "password": "password123"
}
```

#### **POST /addDoctor**
**Description:** Admin adds doctor directly
**Request Body:**
```json
{
    "email": "doctor@example.com",
    "doctorname": "Dr. Smith",
    "specialization": "Cardiology",
    "experience": "5 years",
    "status": "true"
}
```

### **User Management Endpoints**

#### **GET /userlist**
**Description:** Get all registered users
**Response:**
```json
[
    {
        "email": "user@example.com",
        "username": "John Doe",
        "mobile": "1234567890",
        "gender": "Male",
        "age": "30",
        "address": "123 Main St"
    }
]
```

#### **GET /gettotalusers**
**Description:** Get total number of users
**Response:**
```json
[25]
```

### **Doctor Management Endpoints**

#### **GET /doctorlist**
**Description:** Get all approved doctors
**Response:**
```json
[
    {
        "email": "doctor@example.com",
        "doctorname": "Dr. Smith",
        "specialization": "Cardiology",
        "experience": "5 years",
        "status": "true"
    }
]
```

#### **GET /gettotaldoctors**
**Description:** Get total number of doctors
**Response:**
```json
[12]
```

#### **GET /acceptstatus/{email}**
**Description:** Approve a doctor's registration
**Parameters:** email (path parameter)

#### **GET /rejectstatus/{email}**
**Description:** Reject a doctor's registration
**Parameters:** email (path parameter)

#### **GET /doctorProfileDetails/{email}**
**Description:** Get doctor profile details
**Parameters:** email (path parameter)

### **Appointment Management Endpoints**

#### **POST /bookappointment**
**Description:** Book a new appointment
**Request Body:**
```json
{
    "patient_email": "patient@example.com",
    "doctor_email": "doctor@example.com",
    "appointment_date": "2025-08-15",
    "slot_time": "10:00 AM - 11:00 AM",
    "symptoms": "Chest pain and shortness of breath"
}
```

#### **GET /patientlist**
**Description:** Get all patients with appointments

#### **GET /patientlistbydoctoremail/{email}**
**Description:** Get patients for a specific doctor
**Parameters:** email (path parameter)

#### **GET /acceptpatient/{slot}**
**Description:** Accept patient appointment
**Parameters:** slot (path parameter)

#### **GET /rejectpatient/{slot}**
**Description:** Reject patient appointment
**Parameters:** slot (path parameter)

### **Slot Management Endpoints**

#### **POST /addBookingSlots**
**Description:** Add available booking slots
**Request Body:**
```json
{
    "doctor_email": "doctor@example.com",
    "date": "2025-08-15",
    "start_time": "09:00",
    "end_time": "17:00"
}
```

#### **GET /gettotalslots**
**Description:** Get total number of available slots

#### **GET /getslotdetailswithuniquespecializations**
**Description:** Get slots with unique doctor specializations

### **Prescription Management Endpoints**

#### **POST /addPrescription**
**Description:** Add a new prescription
**Request Body:**
```json
{
    "patient_name": "John Doe",
    "doctor_email": "doctor@example.com",
    "medicines": "Aspirin 75mg, Lisinopril 10mg",
    "dosage": "Once daily, Twice daily",
    "instructions": "Take with food"
}
```

#### **GET /getprescriptionbyname/{patientname}**
**Description:** Get prescriptions for a specific patient
**Parameters:** patientname (path parameter)

---

## 🚀 **Installation Guide**

### **Prerequisites**
- **Java 11 or higher**
- **Node.js 14 or higher**
- **MySQL 8.0 or higher**
- **Python 3.8 or higher** (for AI component)
- **Maven 3.6 or higher**
- **Git**

### **1. Database Setup**

#### **Install MySQL**
1. Download MySQL Community Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Install and configure MySQL with root password: `@Rakesh162`
3. Start MySQL service

#### **Create Database**
```sql
-- Connect to MySQL
mysql -u root -p
-- Enter password: @Rakesh162

-- Create database
CREATE DATABASE healthcaresystem;

-- Verify creation
SHOW DATABASES;

-- Exit
EXIT;
```

### **2. Backend Setup**

#### **Navigate to Backend Directory**
```bash
cd "C:\Users\Rakesh Raushan\Downloads\ST\Smart-Health-Care-System-main\SmartHealthcareSystem-Backend"
```

#### **Configure Database**
Edit `src/main/resources/application.properties`:
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/healthcaresystem
spring.datasource.username=root
spring.datasource.password=@Rakesh162
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=true
```

#### **Build and Run**
```bash
# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

**Backend will start on:** `http://localhost:8081`

### **3. Frontend Setup**

#### **Navigate to Frontend Directory**
```bash
cd "C:\Users\Rakesh Raushan\Downloads\ST\Smart-Health-Care-System-main\SmartHealthCareSystem-main"
```

#### **Install Dependencies**
```powershell
# For Node.js compatibility issues (PowerShell)
$env:NODE_OPTIONS="--openssl-legacy-provider"

# Install dependencies
npm install --legacy-peer-deps
```

#### **Configure Environment**
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiURL: "http://localhost:8081"
};
```

#### **Start Development Server**
```bash
# Start the Angular application
npm start
```

**Frontend will start on:** `http://localhost:4200`

### **4. AI Component Setup (Optional)**

#### **Navigate to AI Directory**
```bash
cd "C:\Users\Rakesh Raushan\Downloads\ST\Doctor"
```

#### **Install Python Dependencies**
```bash
# Install dependencies
pip install flask pandas numpy scikit-learn

# Or if requirements.txt exists
pip install -r requirements.txt
```

#### **Run AI Service**
```bash
python app.py
```

**AI Service will start on:** `http://localhost:10000`

---

## ⚙️ **Configuration**

### **Backend Configuration**

#### **Application Properties**
```properties
# Server Configuration
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/healthcaresystem
spring.datasource.username=root
spring.datasource.password=@Rakesh162
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=true

# Security Configuration
security.basic.enable=false
security.ignored=/**
```

#### **CORS Configuration**
All controllers are configured with:
```java
@CrossOrigin(origins = "http://localhost:4200")
```

### **Frontend Configuration**

#### **Environment Variables**
```typescript
// environment.ts
export const environment = {
  production: false,
  apiURL: "http://localhost:8081"
};

// environment.prod.ts
export const environment = {
  production: true,
  apiURL: "https://your-production-api-url.com"
};
```

#### **Angular Configuration**
```json
// angular.json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "configurations": {
      "production": {
        "browserTarget": "health-care-management:build:production"
      },
      "development": {
        "browserTarget": "health-care-management:build:development"
      }
    },
    "defaultConfiguration": "development"
  }
}
```

---

## 📖 **User Manual**

### **Admin Access**
#### **Login Credentials**
- **URL:** `http://localhost:4200`
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

#### **Admin Functions**
1. **Dashboard Overview**
   - View system statistics
   - Monitor user activity
   - Check appointment trends

2. **Doctor Management**
   - Add new doctors manually
   - Approve/reject doctor registrations
   - View doctor list with specializations
   - Manage doctor status (active/inactive)

3. **User Management**
   - View all registered users
   - Monitor user registration trends
   - Access user profiles and medical history

4. **System Administration**
   - Monitor appointment bookings
   - Track prescription analytics
   - Generate system reports

### **Doctor Registration & Login**
#### **Registration Process**
1. Navigate to registration page
2. Select "Doctor" tab
3. Fill in required information:
   - Personal details (name, email, mobile)
   - Professional details (specialization, experience)
   - Previous hospital information
   - Complete address
4. Submit registration
5. Wait for admin approval

#### **Login Process**
1. Navigate to login page
2. Select "Doctor" tab
3. Enter approved credentials
4. Access doctor dashboard

#### **Doctor Functions**
1. **Profile Management**
   - Update personal information
   - Modify professional details
   - Check approval status

2. **Appointment Management**
   - Create available time slots
   - View today's appointments
   - Accept/reject appointment requests
   - Manage patient appointments

3. **Patient Care**
   - Access patient list
   - View patient medical history
   - Create treatment plans
   - Schedule follow-ups

4. **Prescription Management**
   - Create digital prescriptions
   - View prescription history
   - Check drug interactions
   - Provide dosage instructions

### **User/Patient Registration & Login**
#### **Registration Process**
1. Navigate to registration page
2. Select "User" tab
3. Fill in personal information:
   - Basic details (name, email, mobile)
   - Demographics (age, gender)
   - Contact address
4. Submit registration (immediate approval)

#### **Login Process**
1. Navigate to login page
2. Select "User" tab
3. Enter registration credentials
4. Access user dashboard

#### **Patient Functions**
1. **Profile Management**
   - Update personal information
   - Manage medical history
   - Set emergency contacts

2. **Doctor Services**
   - Browse doctor list
   - Filter by specialization
   - View doctor profiles and experience
   - Check doctor availability

3. **Appointment Booking**
   - Select preferred doctor
   - Choose available time slots
   - Provide symptoms/reason for visit
   - Submit appointment request
   - Track appointment status

4. **Prescription Access**
   - View all prescriptions
   - Access prescription history
   - Print prescription copies
   - Get medication information

### **AI Disease Prediction (Optional)**
#### **Access AI Service**
1. Navigate to `http://localhost:10000`
2. Select up to 5 symptoms from dropdown
3. Submit for prediction
4. View predicted diseases with confidence levels

#### **Supported Features**
- **41 Disease Categories**: Including diabetes, hypertension, tuberculosis, etc.
- **132+ Symptoms**: Comprehensive symptom database
- **ML Models**: Decision Tree, Random Forest, Naive Bayes

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Frontend Build Issues**
**Error:** `error:0308010C:digital envelope routines::unsupported`
**Solution:**
```powershell
# For PowerShell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start

# For Command Prompt
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

#### **2. Backend Database Connection Issues**
**Error:** `Communications link failure`
**Solutions:**
1. Verify MySQL is running:
   ```bash
   # Check MySQL service status
   services.msc
   # Look for MySQL80 service
   ```

2. Test database connection:
   ```bash
   mysql -u root -p@Rakesh162 -e "SHOW DATABASES;"
   ```

3. Check connection parameters in `application.properties`

#### **3. CORS Issues**
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
**Solutions:**
1. Verify `@CrossOrigin(origins = "http://localhost:4200")` annotation
2. Check frontend is running on port 4200
3. Restart backend after CORS configuration changes

#### **4. JWT Token Issues**
**Error:** `Invalid JWT token` or `Token expired`
**Solutions:**
1. Clear browser localStorage:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
2. Login again to get fresh token
3. Check token expiration settings

#### **5. Angular Dependencies Issues**
**Error:** `npm ERESOLVE could not resolve`
**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install with legacy peer deps
npm install --legacy-peer-deps
```

#### **6. Maven Build Issues**
**Error:** `Could not find or load main class`
**Solutions:**
```bash
# Clean and rebuild
mvn clean compile

# Skip tests if failing
mvn clean install -DskipTests

# Force update dependencies
mvn clean install -U
```

### **Performance Optimization**

#### **Database Optimization**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_doctor_email ON doctor(email);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_prescription_patient ON prescription(patient_name);
CREATE INDEX idx_doctor_specialization ON doctor(specialization);
```

#### **Frontend Optimization**
```bash
# Production build with optimization
ng build --prod --optimization

# Enable AOT compilation
ng build --aot

# Bundle analysis
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

#### **Backend Optimization**
```properties
# application.properties optimizations
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

---

## 🔒 **Security Features**

### **Authentication & Authorization**
- **JWT Token-based Authentication**: Secure stateless authentication
- **Role-based Access Control (RBAC)**: Admin, Doctor, User roles
- **Session Management**: Secure session handling
- **Password Security**: Encrypted password storage

### **Data Security**
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **XSS Protection**: Angular built-in sanitization
- **CSRF Protection**: Spring Security CSRF tokens
- **Input Validation**: Server-side and client-side validation

### **API Security**
- **CORS Configuration**: Controlled cross-origin requests
- **Request Rate Limiting**: Prevent API abuse
- **Secure Headers**: Security-focused HTTP headers
- **Error Handling**: Secure error messages without sensitive data

### **Database Security**
- **Connection Encryption**: SSL/TLS database connections
- **Access Control**: Role-based database access
- **Data Validation**: Comprehensive input validation
- **Backup Strategy**: Regular automated backups

### **Security Best Practices**
1. **Regular Security Updates**: Keep dependencies updated
2. **Environment Variables**: Use environment variables for sensitive data
3. **HTTPS Encryption**: Use HTTPS in production
4. **Security Audits**: Regular security assessments
5. **Logging & Monitoring**: Comprehensive security logging

---

## 🚀 **Future Enhancements**

### **Phase 1: Core Improvements**
1. **Enhanced Authentication**
   - Multi-factor authentication (MFA)
   - OAuth2 integration (Google, Facebook)
   - Password strength enforcement
   - Account lockout policies

2. **Advanced User Interface**
   - Real-time notifications
   - Progressive Web App (PWA) capabilities
   - Mobile-responsive design improvements
   - Dark mode theme

3. **Reporting & Analytics**
   - Advanced dashboard analytics
   - Custom report generation
   - Data visualization improvements
   - Export functionality (PDF, Excel)

### **Phase 2: Advanced Features**
1. **Telemedicine Integration**
   - Video consultation capabilities
   - Real-time chat functionality
   - Screen sharing for consultations
   - Digital whiteboard for explanations

2. **AI/ML Enhancements**
   - Medical image analysis
   - Drug interaction checker
   - Treatment recommendation system
   - Predictive health analytics

3. **Integration Capabilities**
   - Hospital Management Systems integration
   - Laboratory Information Systems (LIS)
   - Pharmacy Management Systems
   - Insurance claim processing

### **Phase 3: Enterprise Features**
1. **Mobile Applications**
   - Native iOS application
   - Native Android application
   - Cross-platform mobile development
   - Push notifications

2. **Advanced Healthcare Features**
   - Electronic Health Records (EHR)
   - Medical device integration
   - Clinical decision support
   - Population health management

3. **Business Intelligence**
   - Advanced analytics dashboard
   - Predictive modeling
   - Performance metrics
   - Resource optimization

### **Technical Improvements**
1. **Architecture Enhancements**
   - Microservices architecture
   - Event-driven architecture
   - API Gateway implementation
   - Service mesh integration

2. **Cloud & DevOps**
   - Cloud deployment (AWS, Azure, GCP)
   - Containerization (Docker, Kubernetes)
   - CI/CD pipeline implementation
   - Infrastructure as Code (IaC)

3. **Performance & Scalability**
   - Load balancing
   - Database sharding
   - Caching strategies (Redis)
   - Content Delivery Network (CDN)

4. **Monitoring & Observability**
   - Application Performance Monitoring (APM)
   - Distributed tracing
   - Centralized logging
   - Health checks and metrics

---

## 📞 **Support & Contact**

### **Technical Support**
- **Primary Developer:** Rakesh Raushan
- **Email:** rakesh.healthcare@support.com
- **Project Location:** `C:\Users\Rakesh Raushan\Downloads\ST\Smart-Health-Care-System-main\`

### **Original Author**
- **Name:** Gowthamraj K
- **Email:** gowthamraj692@gmail.com
- **WhatsApp:** +91-9698382306
- **Portfolio:** [Gowtham's Portfolio](https://gowthamrajk.github.io)
- **GitHub:** [GitHub Profile](https://github.com/gowthamrajk)

### **Documentation & Resources**
- **Project Repository:** Local development environment
- **API Documentation:** Available in this document
- **User Manual:** Included in this documentation
- **Troubleshooting Guide:** See troubleshooting section

### **Community & Contributions**
- **Feature Requests:** Contact development team
- **Bug Reports:** Document and report issues
- **Contributions:** Follow coding standards and guidelines
- **Code Reviews:** Mandatory for all contributions

---

## 📋 **Project Status**

### **Current Version:** 1.0.0
### **Development Status:** Active Development
### **Last Updated:** August 7, 2025
### **Next Review:** September 7, 2025

### **Completed Features**
✅ User authentication and authorization  
✅ Role-based access control  
✅ Doctor registration and approval workflow  
✅ Patient appointment booking system  
✅ Prescription management  
✅ AI-powered disease prediction  
✅ Responsive web interface  
✅ Database integration  
✅ RESTful API implementation  

### **In Progress**
🔄 Performance optimization  
🔄 Security enhancements  
🔄 User interface improvements  
🔄 Testing and quality assurance  

### **Planned Features**
📋 Mobile application development  
📋 Telemedicine integration  
📋 Advanced analytics dashboard  
📋 Cloud deployment  
📋 Integration with external systems  

---

## 📄 **License & Copyright**

**Copyright © 2021-2025 Gowthamraj K & Rakesh Raushan**

This project is developed for educational and healthcare improvement purposes. The software is provided "as is" without warranty of any kind.

### **Usage Guidelines**
- ✅ Educational use permitted
- ✅ Healthcare research allowed
- ✅ Non-commercial development encouraged
- ❌ Commercial use requires permission
- ❌ Redistribution without attribution prohibited

### **Compliance Requirements**
When deploying in production environments, ensure compliance with:
- **HIPAA** (Health Insurance Portability and Accountability Act)
- **GDPR** (General Data Protection Regulation)
- **Local healthcare data protection regulations**
- **Medical device software regulations**

### **Disclaimer**
This software is intended for educational and development purposes. It should not be used in production healthcare environments without proper medical validation, security auditing, and regulatory compliance verification.

---

**Document Version:** 1.0.0  
**Document Status:** Complete  
**Last Updated:** August 7, 2025  
**Next Review:** September 7, 2025  
**Total Pages:** 47  
**Word Count:** ~15,000 words