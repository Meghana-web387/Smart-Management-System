-- Create Database
CREATE DATABASE IF NOT EXISTS smart_mgmt_db;
USE smart_mgmt_db;

-- Initial Admin User (Password: admin123)
-- Note: In a real app, passwords must be BCrypt encoded. 
-- The backend AuthController /signup endpoint is recommended for creating users.
-- This script is for reference and manual DB structure verification.

-- The tables will be automatically created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- once the Spring Boot application starts and connects to the database.

-- Example of how to manually insert a record if needed (AFTER tables are created):
-- INSERT INTO users (name, email, password, role, status, created_at) 
-- VALUES ('Admin User', 'admin@example.com', '$2a$10$W2iX8E.S.9.zYy.u0U6G.O9h.e7i9j8k7l6m5n4o3p2q1r0s9t8u', 'ROLE_ADMIN', 'ACTIVE', NOW());
