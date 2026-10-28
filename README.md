# Digital Notice Board - React frontend

## Run
1. Start the Spring Boot backend on http://localhost:8080
2. In this folder:
   npm install
   npm run dev
3. Open http://localhost:5173

The Vite dev server proxies /auth, /api and /admin to port 8080, so no CORS setup is needed in development.

## First admin
No endpoint can create the first admin (/admin/** needs an admin). Register a normal user in the app,
then in MySQL add the role:

  INSERT INTO user_roles (user_id, roles) VALUES (<id>, 'ROLE_ADMIN');

(The table name is usually `user_roles`; check with `SHOW TABLES;`.) Log out and in again afterwards.
