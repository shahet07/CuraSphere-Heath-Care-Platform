[# Smart Healthcare System (Angular + Spring Boot + Python AI)

Full-stack healthcare management platform with:
- Angular 12 Frontend (patient / doctor / admin interfaces)
- Spring Boot (REST API, JWT auth, MySQL persistence)
- Python Flask AI Service (disease prediction)
- MySQL 8 Database

---
## 1. Architecture Overview
Component | Tech | Default Port | Purpose
--------- | ---- | ------------ | -------
Frontend | Angular 12 | 4200 | UI for users, doctors, admin
Backend API | Spring Boot (Java 17) | 8081 | Auth, users, doctors, appointments, prescriptions
AI Service | Python Flask | 10000 | Symptom/disease prediction endpoint(s)
Database | MySQL 8 | 3306 | Persistent storage

---
## 2. Prerequisites
Install / verify:
- Java 17 (`java -version`)
- Maven 3.6+ (`mvn -v`)
- Node.js 16.x or 18.x LTS recommended (Angular 12 is not tested on Node 22)  
  (If you must use Node 22: set `NODE_OPTIONS=--openssl-legacy-provider` when running.)
- Python 3.11+ (`python --version`)
- MySQL 8 (`mysql --version`)

Python packages (will install later): `flask pandas scikit-learn numpy`

---
## 3. Repository Layout
```
Smart-Health-Care-System-main/
  SmartHealthcareSystem-Backend/   <- Spring Boot backend
  SmartHealthCareSystem-main/      <- Angular frontend
Doctor/                            <- Python AI service
```
## Clone this repository

To get a local copy up and running, run this command:
```bash
git clone https://github.com/Rakesh161rausahn/Angular-Spring-boot-Smart-Healthcare-System.git
```
## 4. Database Setup
Login to MySQL and create the schema if not present:
```sql
CREATE DATABASE IF NOT EXISTS healthcaresystem;
```
Edit `SmartHealthcareSystem-Backend/src/main/resources/application.properties` if you need to change credentials:
```
spring.datasource.url=jdbc:mysql://localhost:3306/healthcaresystem
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=create-drop   # Dev only
```
Change `create-drop` to `update` or `none` for persistent data outside development.

---
## 5. Run Backend (Spring Boot)
Development (auto reload via devtools):
```powershell
cd "Smart-Health-Care-System-main/SmartHealthcareSystem-Backend"
mvn spring-boot:run
```
Build executable JAR:
```powershell
cd "Smart-Health-Care-System-main/SmartHealthcareSystem-Backend"
mvn clean package -DskipTests
java -jar target/HealthcareManagement-Backend-0.0.1-SNAPSHOT.jar
```
Backend starts on: http://localhost:8081

---
## 6. Run Angular Frontend (Development)
Install dependencies (first time):
```powershell
cd "Smart-Health-Care-System-main/SmartHealthCareSystem-Frontend"
$env:NODE_OPTIONS="--openssl-legacy-provider"   # Only if using Node >=17
npm install --legacy-peer-deps
```
Start dev server:
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
```
Access UI: http://localhost:4200

### Production Build
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run build -- --configuration=production
```
Output: `dist/HealthCareManagement/`
Serve with a simple static server (example using `npx serve`):
```powershell
npx serve -s dist/HealthCareManagement -l 4300
```
Visit: http://localhost:4300

---
## 7. Run Python AI Service
Install packages (one time):
```powershell
cd "Doctor"
python -m pip install --upgrade pip
pip install flask pandas scikit-learn numpy
```
Start service:
```powershell
python app.py
```
AI service: http://localhost:10000

---
## 8. Frontend ⇄ Backend Communication
Base API URL (development): `http://localhost:8081`
Services use an `ApiConfigService` (absolute URL) OR dev proxy (if re-enabled).

Key endpoints (unauthenticated):
- `POST /registeruser` – create patient
- `POST /registerdoctor` – create doctor
- `POST /loginuser` – user login (returns JWT token)
- `POST /logindoctor` – doctor login (returns JWT token)

On success, frontend stores:
- `sessionStorage.TOKEN = Bearer <jwt>`
- `sessionStorage.USER` and `sessionStorage.ROLE`

If duplicate user/doctor email -> backend returns **409 Conflict** with plain message.

---
## 9. Typical Start Sequence (All Services)
Open three PowerShell windows (or run sequentially):
1. Backend:
   ```powershell
   cd "Smart-Health-Care-System-main/SmartHealthcareSystem-Backend"
   mvn spring-boot:run
   ```
2. Frontend:
   ```powershell
   cd "Smart-Health-Care-System-main/SmartHealthCareSystem-Frontend"
   $env:NODE_OPTIONS="--openssl-legacy-provider"
   npm start
   ```
3. AI Service:
   ```powershell
   cd "Doctor"
   python app.py
   ```
Visit http://localhost:4200 and register / login.

---
## 10. Configuration & Customization
Property | File | Purpose
-------- | ---- | -------
`spring.jpa.hibernate.ddl-auto` | application.properties | Schema generation strategy
`server.port` | application.properties | Change backend port (default 8081)
`environment*.ts apiURL` | Angular environments | Frontend base API URL
`ApiConfigService` | Angular service | Central URL builder

If you change backend port, update `environment.ts` & `environment.prod.ts`.

---
## 11. Troubleshooting
Problem | Cause | Fix
------- | ----- | ---
Registration “failed” + network error to 8080 | Old hardcoded port | Ensure all services use 8081 (search for 8080) / updated env
Button disabled on Register | Form invalid (confirm password not bound) | Ensure confirm password uses `[(ngModel)]` (already fixed)
"User already exists" even after restart | Using `update` schema & row exists | Delete row in table or switch to `create-drop` temporarily
CORS errors | Direct cross-origin calls | Run via same origin (Angular dev) or add proxy / configure CORS in backend
Angular build budget errors | Strict default budgets | Budgets increased in `angular.json`
Node engine warnings | Using Node 22 with Angular 12 | Use Node 16/18 LTS or keep `--openssl-legacy-provider`
SciPy / NumPy version warning | Incompatible wheel with latest NumPy | Pin versions if needed: `pip install numpy==2.0.2 scipy==1.11.4`

---
## 12. Security Notes
- `create-drop` recreates schema each restart – do not use in production.
- Admin login logic is hardcoded (email/password) – replace with secure backend verification.
- JWT tokens stored in `sessionStorage` – consider HttpOnly cookies for production.

---
## 13. Next Improvements (Optional)
- Add HTTP interceptor to auto-attach JWT and handle 401 globally.
- Implement password hashing (BCrypt) in backend.
- Replace jQuery tab handling with pure Angular.
- Add unit tests for services and controllers.
- Dockerize all services (compose file for multi-container run).
- Add rate limiting & validation for public endpoints.

---
## 14. Quick Clean & Reset
To wipe DB (dev):
```sql
TRUNCATE TABLE user;
TRUNCATE TABLE doctor;
```
Or temporarily set `spring.jpa.hibernate.ddl-auto=create-drop` and restart.

---
## 15. License / Attribution
Internal academic / demonstration project. Add license file if distributing.

---
## 16. Support
If something fails:
1. Check backend console for stack trace.
2. Open browser DevTools Network tab (verify calls hit http://localhost:8081/…)
3. Confirm MySQL is running and credentials correct.
4. Validate Angular environment API URL.
5. Run `mvn clean package` to ensure backend compiles.

Feel free to extend and optimize. Happy coding!
](https://github.com/Rakesh161rausahn/Angular-Spring-boot-Smart-Healthcare-System.git)
