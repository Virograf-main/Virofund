# Virofund Matching API — Frontend Developer Guide

## Overview

The Virofund matching system supports **AI-powered co-founder discovery** with compatibility scoring, plus **connection requests** (LinkedIn-style). Users can create detailed profiles, set co-founder preferences, discover matches through vector‑based similarity, and send/accept/reject connection requests.

---

## Authentication

Most endpoints require a **JWT Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from `POST /api/auth/login` or `POST /api/auth/register`.

---

## Base URL

All endpoints are prefixed with `/api`. Example:

```
https://your-domain.com/api/auth/login
```

---

## 📋 Complete Route Table

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | Health check / welcome message |
| | **Auth** | | |
| POST | `/auth/login` | — | Login with email + password |
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/otp/send` | — | Send OTP for password reset |
| POST | `/auth/otp/verify` | — | Verify OTP code |
| PATCH | `/auth/password/update` | Reset‑Token | Update password after OTP verification |
| POST | `/auth/refresh` | JWT | Refresh access + refresh tokens |
| POST | `/auth/logout` | JWT | Invalidate refresh token |

| | **Profiles** | | |
| POST | `/profiles` | JWT | Create profile (also creates preferences + embeddings) |
| GET | `/profiles` | JWT + Admin | Get **all** profiles (admin only) |
| GET | `/profiles/me` | JWT | Get **my** profile with preferences |
| GET | `/profiles/me/exists` | JWT | Check whether I have a profile |
| PATCH | `/profiles/me` | JWT | Update my profile |
| DELETE | `/profiles/me` | JWT | Delete my profile |
| PATCH | `/profiles/:id` | JWT | Update a specific profile by ID |
| GET | `/profiles/:id` | JWT | Get a specific profile by ID |
| DELETE | `/profiles/:id` | JWT + Admin | Delete a profile by ID (admin only) |
| GET | `/profiles/me/matches` | JWT | Find AI‑powered match suggestions |
| PATCH | `/profiles/me/preferences` | JWT | Update co‑founder preferences |
| | **Matches & Connections** | | |
| GET | `/matches` | JWT | Get all algorithmic matches |
| GET | `/matches/incoming` | JWT | Get incoming connection requests |
| GET | `/matches/sent` | JWT | Get sent connection requests |
| POST | `/matches/request/:userId` | JWT | Send a connection request |
| PATCH | `/matches/requests/:id/status` | JWT | Accept or reject a connection request |
| | **Users** | | |
| POST | `/users` | — | Create a user directly (admin/internal) |
| GET | `/users/:id` | — | Get user by ID |
| GET | `/users/email/:email` | — | Get user by email |
| | **Constants** | | |
| GET | `/constants/industries` | — | List all industry options |
| GET | `/constants/founder-statuses` | — | List founder‑status options |
| GET | `/constants/commitment-levels` | — | List commitment‑level options |
| GET | `/constants/personality-traits` | — | List personality‑trait options |
| GET | `/constants/skills` | — | List skill‑category options |
| GET | `/constants/financial-contributions` | — | List financial‑contribution options |
| GET | `/constants/locations` | — | List location options |

---

## 🔐 Auth Endpoints

### 1. Login

**`POST /api/auth/login`**

Request:
```json
{
  "email": "user@example.com",
  "password": "StrongP@ss123"
}
```

Response 200:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

### 2. Register

**`POST /api/auth/register`**

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "StrongP@ss123",
  "otp": "123456"
}
```

Response 201:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

### 3. Send OTP

**`POST /api/auth/otp/send`**

Sends a 6-digit OTP to the user's email (used for password-reset flow). If `isRegistering` is `true`, it skips the "user exists" check (used during registration).

Request:
```json
{
  "email": "user@example.com",
  "isRegistering": false
}
```

Response 201:
```json
{
  "message": "OTP sent successfully"
}
```

### 4. Verify OTP

**`POST /api/auth/otp/verify`**

Verifies the 6-digit OTP and returns a **reset token** that must be passed to `PATCH /auth/password/update`.

Request:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response 201:
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIs...",
  "message": "OTP verified successfully"
}
```

### 5. Update Password

**`PATCH /api/auth/password/update`**

Requires the `resetToken` from OTP verification in the `Authorization` header.

```
Authorization: Bearer <reset_token>
```

Request:
```json
{
  "email": "user@example.com",
  "password": "NewStr0ng!Pass"
}
```

Response 201:
```json
{
  "message": "Password updated successfully"
}
```

### 6. Refresh Tokens

**`POST /api/auth/refresh`**

Request:
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

Response 200:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "bmV3IHJlZnJlc2ggdG9rZW4..."
}
```

### 7. Logout

**`POST /api/auth/logout`**

Invalidates the user's refresh token. Requires JWT.

Response 200:
```json
{
  "message": "Logged out successfully"
}
```

---

## 👤 Profiles Endpoints

### 1. Create Profile

**`POST /api/profiles`**

Creates a profile **and** a preference entity (all preference fields start as `null`). Both profile and preference AI embeddings are computed automatically via OpenRouter.

Request:
```json
{
  "userName": "john_doe_founder",
  "bio": "Experienced software engineer passionate about fintech innovation...",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "founderStatus": "First-time Founder",
  "skills": ["Software Development", "Product Management"],
  "industry": "Fintech",
  "currentOccupation": "Software Engineer",
  "yearsExperience": 5,
  "commitmentLevel": "Full-time",
  "financialContribution": "Can invest $25K-$100K personally",
  "personalityTraits": ["Visionary", "Analytical"],
  "location": "US - West Coast",
  "workStyle": "Hybrid",
  "hasStartup": true,
  "riskManagementStyle": "Calculated Risk-taker",
  "pastExperience": "Successfully launched 2 startups"
}
```

Response 201 — Full profile with preferences:
```json
{
  "id": "PFD_abc123",
  "userId": "USR_abc123",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "john_doe_founder",
  "bio": "Experienced software engineer...",
  "email": "user@example.com",
  "founderStatus": "First-time Founder",
  "skills": ["Software Development", "Product Management"],
  "industry": "Fintech",
  "currentOccupation": "Software Engineer",
  "yearsExperience": 5,
  "commitmentLevel": "Full-time",
  "financialContribution": "Can invest $25K-$100K personally",
  "personalityTraits": ["Visionary", "Analytical"],
  "location": "US - West Coast",
  "workStyle": "Hybrid",
  "preferredSkills": null,
  "preferredFounderType": null,
  "preferredIndustry": null,
  "preferredCommitmentLevel": null,
  "preferredFinancial": null,
  "preferredPersonalityTraits": null,
  "preferredLocation": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Get My Profile

**`GET /api/profiles/me`**

Same shape as the Create Profile response.

### 3. Check Profile Exists

**`GET /api/profiles/me/exists`**

Response 200:
```json
{
  "exists": true
}
```

### 4. Update My Profile

**`PATCH /api/profiles/me`**

Accepts any subset of the profile fields. Also **recomputes the AI embedding**.

You can also update your **first name** and **last name** (stored on the User record) via `firstName` and `lastName` fields.

Request (partial update):
```json
{
  "bio": "Updated bio text...",
  "skills": ["Software Development", "AI/ML"],
  "firstName": "John",
  "lastName": "Doe"
}
```

Response 200 — Same shape as the profile response (including `firstName` and `lastName`).

### 5. Delete My Profile

**`DELETE /api/profiles/me`**

Returns **204 No Content** on success.

### 6. Get All Profiles (Admin)

**`GET /api/profiles`**

Requires `AdminGuard`. Returns an array of all profiles with preferences.

### 7. Get Profile by ID

**`GET /api/profiles/:id`**

### 8. Update Profile by ID

Accepts any subset of the profile fields — same shape as `PATCH /profiles/me`. Also supports updating `firstName` and `lastName`.

**`PATCH /api/profiles/:id`**

### 9. Delete Profile by ID (Admin)

**`DELETE /api/profiles/:id`**

Requires `AdminGuard`. Returns **204 No Content**.

### 10. Find My Matches

**`GET /api/profiles/me/matches`**

Runs the **3-stage matching pipeline**:

1. **Vector search** — cosine similarity between your preference embedding and all other profiles' embeddings (pgvector `<=>`)
2. **Weighted scoring** — combines field-level matches (skills, industry, location, etc.) with AI vector similarity
3. **Top-K selection** — returns the best matches sorted by weighted score

Response 200:
```json
[
  {
    "profile": {
      "id": "PFD_def456",
      "firstName": "Sarah",
      "lastName": "Smith",
      "userName": "sarah_smith",
      "bio": "Serial entrepreneur in e-commerce...",
      "email": "sarah@example.com",
      "founderStatus": "Serial Entrepreneur",
      "skills": ["Marketing", "Business Development"],
      "industry": "E-commerce",
      "currentOccupation": "Marketing Director",
      "yearsExperience": 8,
      "commitmentLevel": "Full-time",
      "financialContribution": "Can invest >$100K personally",
      "personalityTraits": ["Strategic thinker", "People-focused"],
      "location": "US - East Coast",
      "workStyle": "Hybrid",
      "preferredSkills": ["Software Development", "Product Management"],
      "preferredFounderType": "First-time Founder",
      "preferredIndustry": "Fintech",
      "preferredCommitmentLevel": "Full-time",
      "preferredFinancial": "Can invest $25K-$100K personally",
      "preferredPersonalityTraits": ["Visionary", "Strategic thinker"],
      "preferredLocation": "US - West Coast",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "vectorSimilarity": 0.82,
    "weightedScore": 0.76,
    "breakdownScores": {
      "skillsScore": 0.85,
      "industryScore": 0.90,
      "locationScore": 0.70,
      "commitmentScore": 1.0,
      "founderTypeScore": 0.80,
      "personalityScore": 0.75,
      "vectorScore": 0.82
    }
  }
]
```

### 11. Update Co-founder Preferences

**`PATCH /api/profiles/me/preferences`**

Updates preference fields and **recomputes the preference embedding**.

Request:
```json
{
  "preferredSkills": ["Software Development", "Product Management"],
  "preferredFounderType": "First-time Founder",
  "preferredIndustry": "Fintech",
  "preferredCommitmentLevel": "Full-time",
  "preferredFinancial": "Can invest $25K-$100K personally",
  "preferredPersonalityTraits": ["Visionary", "Strategic thinker"],
  "preferredLocation": "US - West Coast"
}
```

Response:
```json
{
  "id": "PRF_abc123",
  "preferredSkills": ["Software Development", "Product Management"],
  "preferredFounderType": "First-time Founder",
  "preferredIndustry": "Fintech",
  "preferredCommitmentLevel": "Full-time",
  "preferredFinancial": "Can invest $25K-$100K personally",
  "preferredPersonalityTraits": ["Visionary", "Strategic thinker"],
  "preferredLocation": "US - West Coast"
}
```

---

## 🎯 Matches & Connections Endpoints

### 1. Get Algorithmic Matches

**`GET /api/matches`**

Returns pre-computed algorithmic matches. Results are **cached in Redis** for 15 minutes.

Response 200:
```json
[
  {
    "matchedFounderId": "USR_def456",
    "matchedProfileId": "PFD_def456",
    "overallScore": 0.85,
    "vectorSimilarity": 0.7532,
    "breakdownScores": {
      "industry": 1.0,
      "skills": 0.8,
      "experience": 0.5,
      "commitment": 1.0,
      "financial": 0.0,
      "personality": 0.7,
      "location": 1.0
    },
    "matchedFounderDetails": {
      "name": "Sarah Smith",
      "founderStatus": "Serial Entrepreneur",
      "skills": ["Product Management", "Marketing"],
      "industry": "Fintech",
      "yearsExperience": 8,
      "location": "US - West Coast"
    },
    "generatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Send Connection Request

**`POST /api/matches/request/:userId`**

Send a connection request to any user (even if not algorithmically matched). The compatibility score is computed at request time.

```javascript
const response = await fetch('/api/matches/request/USR_def456', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token }
});
```

Response 201:
```json
{
  "id": "CNR_abc123",
  "sender": {
    "id": "USR_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "receiver": {
    "id": "USR_def456",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com"
  },
  "status": "pending",
  "compatibilityScore": 0.75,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. Get Incoming Requests

**`GET /api/matches/incoming`**

Response 200:
```json
[
  {
    "id": "CNR_abc123",
    "sender": {
      "id": "USR_def456",
      "firstName": "Sarah",
      "lastName": "Smith",
      "email": "sarah@example.com"
    },
    "receiver": {
      "id": "USR_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "status": "pending",
    "compatibilityScore": 0.72,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 4. Get Sent Requests

**`GET /api/matches/sent`**

Same shape as `GET /incoming`, but shows requests **you** sent.

### 5. Accept/Reject Connection Request

**`PATCH /api/matches/requests/:id/status`**

Only the **receiver** can accept/reject. `status` must be `"accepted"` or `"rejected"`.

Request:
```json
{
  "status": "accepted"
}
```

Response 200:
```json
{
  "id": "CNR_abc123",
  "sender": {
    "id": "USR_def456",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com"
  },
  "receiver": {
    "id": "USR_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "status": "accepted",
  "compatibilityScore": 0.68,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 👥 Users Endpoints

These are basic CRUD endpoints for user records.

### 1. Create User

**`POST /api/users`**

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "StrongP@ss123",
  "otp": "123456"
}
```

Response 201:
```json
{
  "id": "USR_abc123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "isActive": true,
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "profile": null
}
```

### 2. Get User by ID

**`GET /api/users/:id`**

Response 200:
```json
{
  "id": "USR_abc123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "isActive": true,
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "profile": { ... }
}
```

### 3. Get User by Email

**`GET /api/users/email/:email`**

Similar to `GET /users/:id`, keyed by email instead.

---

## 🏷️ Constants Endpoints

All constants endpoints return simple **arrays of strings**.

| Endpoint | Returns |
|----------|---------|
| `GET /api/constants/industries` | `["Fintech", "Healthtech", "E-commerce", ...]` |
| `GET /api/constants/founder-statuses` | `["First-time Founder", "Serial Entrepreneur", ...]` |
| `GET /api/constants/commitment-levels` | `["Full-time", "Part-time", ...]` |
| `GET /api/constants/personality-traits` | `["Visionary", "Analytical", ...]` |
| `GET /api/constants/skills` | `["Software Development", "Marketing", ...]` |
| `GET /api/constants/financial-contributions` | `["Can invest >$100K personally", ...]` |
| `GET /api/constants/locations` | `["US - West Coast", "US - East Coast", ...]` |

---

## 📱 Frontend Implementation Examples

### Registration Flow (OTP + Register)

```jsx
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // email -> otp -> register

  const sendOtp = async () => {
    await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, isRegistering: true }),
    });
    setStep("otp");
  };

  const register = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { accessToken, refreshToken } = await res.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };
}
```

### Connection Requests Manager

```jsx
function ConnectionRequests() {
  const [incoming, setIncoming] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch("/api/matches/incoming", {
      headers: { "Authorization": "Bearer " + token }
    })
    .then(r => r.json())
    .then(setIncoming);
  }, []);

  const handleRequest = async (requestId, status) => {
    await fetch(`/api/matches/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    setIncoming(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div>
      {incoming.map(request => (
        <div key={request.id}>
          <h3>{request.sender.firstName} {request.sender.lastName} wants to connect</h3>
          <p>{Math.round(request.compatibilityScore * 100)}% compatibility</p>
          <button onClick={() => handleRequest(request.id, "accepted")}>Accept</button>
          <button onClick={() => handleRequest(request.id, "rejected")}>Decline</button>
        </div>
      ))}
    </div>
  );
}
```

### Password Reset Flow

```jsx
function PasswordReset() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const sendOtp = async () => {
    await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, isRegistering: false }),
    });
  };

  const verifyOtp = async (otp) => {
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setResetToken(data.resetToken);
  };

  const updatePassword = async (newPassword) => {
    await fetch("/api/auth/password/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + resetToken
      },
      body: JSON.stringify({ email, password: newPassword }),
    });
  };
}
```

---

## 🔄 User Flow Summary

```
1. Register / Login
   └─ POST /auth/register    OR    POST /auth/login

2. Create Profile
   └─ POST /profiles  (includes preferences + AI embedding)

3. Discover Co-founders
   ├─ GET /profiles/me/matches  → AI-powered match suggestions
   └─ GET /matches           → Cached algorithmic matches

4. Connect
   ├─ POST /matches/request/:userId  → Send connection request
   ├─ GET /matches/incoming          → See who wants to connect
   ├─ GET /matches/sent              → Track sent requests
   └─ PATCH /matches/requests/:id/status  → Accept / Reject

5. Manage Profile & Preferences
   ├─ PATCH /profiles/me             → Update profile
   ├─ PATCH /profiles/me/preferences → Update co-founder preferences
   └─ GET /profiles/me               → View current profile
```

---

## 📊 Response Status Codes

| Code | Meaning |
|------|---------|
| **200** | Success |
| **201** | Created (resource created successfully) |
| **204** | No Content (deletion success) |
| **400** | Bad Request (validation error) |
| **401** | Unauthorized (missing or invalid token) |
| **404** | Not Found (resource doesn't exist) |
| **409** | Conflict (duplicate / already exists) |
| **502** | Bad Gateway (e.g. email service failure) |
| **500** | Internal Server Error |

---

## 🎯 Key Features

✅ **AI-powered embeddings** — Profiles and preferences are vectorized via OpenRouter for semantic matching  
✅ **3-stage matching pipeline** — pgvector cosine similarity → field-level scoring → weighted ranking  
✅ **Directional compatibility** — Browse sees *your* compatibility to others, not mutual  
✅ **Asymmetric requests** — Send connection requests to anyone, even without a mutual match  
✅ **Mutual consent** — Both sides must accept for a connection to be established  
✅ **Redis caching** — Match results cached for 15 minutes  
✅ **OTP-protected password reset** — 6-digit email OTP with reset token flow  
✅ **Duplicate prevention** — Can't send multiple requests to the same user  
✅ **Admin endpoints** — Full CRUD for user and profile management
