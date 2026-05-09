# Route Testing Report

This report documents the testing of all API routes to ensure they are working as expected.

## User Routes (`/api/v1/users`)

### 1. Admin Login

- **Endpoint:** `POST /api/v1/users/admin-login`
- **Description:** Authenticates an admin user and returns a JWT.
- **Test Command:**
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "password"}' http://localhost:3000/api/v1/users/admin-login
  ```
- **Expected Outcome:** A successful response with a status code of 200 and a JSON body containing an access token.
- **Result:** `SUCCESS`

### 2. Get Logged In User

- **Endpoint:** `GET /api/v1/users/me`
- **Description:** Retrieves the profile of the currently logged-in user.
- **Authentication:** Requires JWT.
- **Test Command:**
  ```bash
  curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" http://localhost:3000/api/v1/users/me
  ```
- **Expected Outcome:** A successful response with a status code of 200 and a JSON body containing the user's profile information.
- **Result:** `SUCCESS`

### 3. Google OAuth

- **Endpoint:** `GET /api/v1/users/google`
- **Description:** Initiates the Google OAuth2 authentication flow.
- **Test Command:**
  Open this URL in a browser: `http://localhost:3000/api/v1/users/google`
- **Expected Outcome:** Redirects the user to the Google login page for authentication.
- **Result:** `MANUAL_TEST_REQUIRED`

### 4. Google OAuth Callback

- **Endpoint:** `GET /api/v1/users/google/callback`
- **Description:** The callback URL for Google OAuth.
- **Test Command:** This is handled by the server after Google authentication.
- **Expected Outcome:** Redirects to the frontend application with the user session initiated.
- **Result:** `MANUAL_TEST_REQUIRED`

## Intake Routes (`/api/v1/intake`)

### 1. Create Intake

- **Endpoint:** `POST /api/v1/intake/intake`
- **Description:** Creates a new intake form response.
- **Authentication:** Requires JWT.
- **Test Command:**
  ```bash
  curl -X POST -H "Authorization: Bearer <YOUR_JWT_TOKEN>" -F "field1=value1" -F "field2=value2" http://localhost:3000/api/v1/intake/intake
  ```
- **Expected Outcome:** A successful response with a status code of 201 and a JSON body containing the created intake data.
- **Result:** `SUCCESS`

### 2. Get All Intakes (Admin)

- **Endpoint:** `GET /api/v1/intake/intakes`
- **Description:** Retrieves all intake form responses.
- **Authentication:** Requires Admin JWT.
- **Test Command:**
  ```bash
  curl -H "Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>" http://localhost:3000/api/v1/intake/intakes
  ```
- **Expected Outcome:** A successful response with a status code of 200 and a JSON body containing an array of all intake responses.
- **Result:** `SUCCESS`

### 3. Get My Response

- **Endpoint:** `GET /api/v1/intake/my-response`
- **Description:** Retrieves the intake responses for the logged-in user.
- **Authentication:** Requires JWT.
- **Test Command:**
  ```bash
  curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" http://localhost:3000/api/v1/intake/my-response
  ```
- **Expected Outcome:** A successful response with a status code of 200 and a JSON body containing an array of the user's intake responses.
- **Result:** `SUCCESS`
