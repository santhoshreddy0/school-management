# School Management API

This is an Express-based project for managing school-related data.

## Getting Started

### 1. Clone the Repository

```sh
git clone <repository_url>
```

### 2. Move to the Project Directory

```sh
cd school-management
```

### 3. Install Node.js (Version >16)

Ensure you have Node.js version 16 or later installed.

### 4. Install npm

If npm is not installed, install it using:

```sh
npm install -g npm
```

### 5. Install Dependencies

Run the following command to install all required packages:

```sh
npm install
```

### 6. Setup Environment Variables

Create a `.env` file in the root directory and add the following properties:

```
LONG_TOKEN_SECRET=<your_long_token_secret>
SHORT_TOKEN_SECRET=<your_short_token_secret>
NACL_SECRET=<your_nacl_secret>
MONGO_URI=<your_mongo_uri>
REDIS_URI=<your_redis_uri>
SUPERADMIN_EMAIL=<your_superadmin_email>
SUPERADMIN_PASSWORD=<your_superadmin_password>
```

### 7. Load Initial Data into MongoDB

Run the following command to populate the database with sample data:

```sh
node initial_setup/SampleData.js
```

### 8. Start the Development Server

```sh
npm run dev
```

The API will run on port **5111**.

### 9. Run Unit Tests

```sh
npm test
```

### 10. Access API Documentation

Open the following URL in your browser:

```
http://localhost:5111/api-docs
```

## Database Design Steps

The database schema consists of multiple collections:


1. **School**: Stores details about schools.
2. **User**: Stores user information with roles.
3. **Classroom**: Represents classes in a school.
4. **Role & Permission**: Defines roles and permissions for users.
5. **Cardinality**:
   - role : permission ==> M : M ( needs separate mapping table)
   - user: role ==> M : 1 ( user table will have the role id )
   - school : class ==> 1 : M ( class table will have school id)
   - class : user ==> M : M ( needs mapping table for class & user)
     - assuming user can opt for multiple classes
   - school : user ( admin) ==> M : M ( needs mapping table)
     -  assuming one admin can manage multiple school but this can be restricted through bussiness logic
6. **Mappings**:
   - `school_admin_mapping`: Links users as admins of a school.
   - `class_user_mapping`: Links users to classrooms.
   - `role_permission_mapping`: Defines permissions assigned to roles.

### Steps to Set Up Database:

Database documenatation : [click to open docs](https://dbdocs.io/santhoshfrnds490/school-management)

1. **Define Schema Models:**
   - Create Mongoose models for `school`, `user`, `classroom`, `role`, `permission`, and mapping collections.

2. **Establish Relationships:**
   - Use references (`ObjectId`) in Mongoose schemas to link collections.

3. **Indexing & Optimization:**
   - Add indexes for frequently queried fields like `email`, `role`, and `school_id`.

4. **Seeding Data:**
   - Use `SampleData.js` to populate default roles, permissions, and a super admin user.


   ![Database Schema](/public/School%20Management.png)

### Role-Based Access Control (RBAC) in API Implementation
 **Middleware for Permission Checking**
The middleware intercepts API requests, extracts user permissions from the token or a database, and checks if the user is authorized to access the requested route.

Steps in Middleware:
- Extract the authentication token from the request header.
- Decode the token to retrieve user details (roles/permissions).
- Fetch additional permissions from a database if required.
- Verify if the user has access to the requested route.
  - for verifying the access : api route is used for mapping with permissions like `classroom:createClassroom`
  - these permissions are mapped with roles so that dynamic updates are possible for roles
- Deny access if the user lacks the required permissions.

## Deployment Steps

### EC2 Setup and Node.js App Deployment

#### 1. Launch EC2 Instance:

- Create an EC2 instance (Ubuntu recommended).
- Allow SSH (port 22) and HTTP (port 80) in the security group.

#### 2. Download PEM Key:

- Download the `.pem` file (e.g., `login.pem`) to your local machine.

#### 3. Set Permissions for PEM File:

```sh
chmod 400 "login.pem"
```

#### 4. SSH into EC2:

```sh
ssh -i "login.pem" ubuntu@your-public-dns
```

#### 5. Update System:

```sh
sudo apt update
sudo apt upgrade -y
```

#### 6. Install Node.js and npm:

```sh
sudo apt install -y nodejs npm
```

Verify installation:

```sh
node -v
npm -v
```

#### 7. Install Git:

```sh
sudo apt install git -y
```

#### 8. Clone Your Project:

```sh
git clone <repository_url>
cd your-repository
```

#### 9. Install Dependencies:

```sh
npm install
```

#### 10. Install PM2:

```sh
sudo npm install -g pm2
pm2 start app.js
pm2 startup
pm2 save
```

#### 11. Install Nginx:

```sh
sudo apt install nginx
```

#### 12. Configure Nginx:

Edit the Nginx config file:

```sh
sudo nano /etc/nginx/sites-available/default
```

Update it to:

```
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5111;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 13. Restart Nginx:

```sh
sudo systemctl restart nginx
```

#### 14. Optional (HTTPS):

- Set up SSL with Certbot if needed.
- Update DNS records to point to your EC2 IP.


