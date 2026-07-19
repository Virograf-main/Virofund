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

## ⏱️ Rate Limiting

The API enforces **rate limits** to prevent abuse. Limits are tracked per IP address using Redis and apply to all endpoints.

### Default Limits

| Endpoint Group | Limit | Window | Headers Returned |
| -------------- | ----- | ------ | ---------------- |
| **All endpoints (global default)** | 20 requests | per 60 seconds | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` |
| **OTP endpoints** (`otp/send`, `otp/verify`) | 5 requests | per 60 seconds | `X-RateLimit-Limit-otp`, `X-RateLimit-Remaining-otp`, `X-RateLimit-Reset-otp` |

### Response Headers

Every API response includes rate limit headers so the frontend can track usage:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 45000
```

| Header | Description |
| ------ | ----------- |
| `X-RateLimit-Limit` | Max requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Milliseconds until the window resets |
| `Retry-After` | (When blocked) Milliseconds to wait before retrying |

> **Note:** OTP endpoints return suffixed headers (`X-RateLimit-Limit-otp`, `Retry-After-otp`, etc.) since they have their own limit separate from the global default.

### When Blocked

If a client exceeds the rate limit, the API responds with:

**`429 Too Many Requests`**

```json
{
  "message": "Too many requests. Please wait before retrying.",
  "statusCode": 429
}
```

The `Retry-After` header indicates how long to wait before retrying. The frontend should respect this header and not retry before the suggested interval.

### Frontend Best Practices

- **Check `X-RateLimit-Remaining`** before making important requests — warn the user when it's low
- **Respect `Retry-After` header** — when blocked, wait the specified time before retrying (this avoids immediate re-blocking)
- **Design for transient failures** — implement exponential backoff if a `429` is received
- **OTP endpoints are extra sensitive** — the 5 req/min limit is intentionally strict to prevent brute-force attacks and SMS bombing

---

## 📋 Complete Route Table

| Method | Path                    | Auth        | Rate Limit           | Description                            |
| ------ | ----------------------- | ----------- | -------------------- | -------------------------------------- |
| GET    | `/`                     | —           | 20 req / 60s         | Health check / welcome message         |
|        | **Auth**                |             |                      |                                        |
| POST   | `/auth/login`           | —           | 20 req / 60s         | Login with email + password            |
| POST   | `/auth/register`        | —           | 20 req / 60s         | Register a new user                    |
| POST   | `/auth/otp/send`        | —           | **5 req / 60s**      | Send OTP for password reset            |
| POST   | `/auth/otp/verify`      | —           | **5 req / 60s**      | Verify OTP code                        |
| PATCH  | `/auth/password/update` | Reset‑Token | Update password after OTP verification |
| POST   | `/auth/refresh`         | JWT         | Refresh access + refresh tokens        |
| POST   | `/auth/logout`          | JWT         | Invalidate refresh token               |

| | **Profiles** | | |
| POST | `/profiles` | JWT | Create profile (also creates preferences + embeddings) |
| GET | `/profiles` | JWT + Admin | Get **all** profiles (admin only) |
| GET | `/profiles/me` | JWT | Get **my** profile with preferences |
| GET | `/profiles/me/exists` | JWT | Check whether I have a profile |
| PATCH | `/profiles/me` | JWT | Update my profile |
| DELETE | `/profiles/me` | JWT | Delete my profile |
| PATCH | `/profiles/:id` | JWT + Admin | Update a specific profile by ID (admin only) |
| GET | `/profiles/:id` | JWT | Get a specific profile by ID |
| DELETE | `/profiles/:id` | JWT + Admin | Delete a profile by ID (admin only) |
| POST | `/profiles/me/match-summary/:profileId` | JWT | Generate AI match summary with another profile |
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
| | **Notifications** | | |
| GET | `/notifications` | JWT | 30 req / 60s | Get latest 10 notifications |
| PATCH | `/notifications/:id/read` | JWT | 30 req / 60s | Mark a notification as read |
| PATCH | `/notifications/read-all` | JWT | 30 req / 60s | Mark all unread notifications as read |

---

## 🔐 Auth Endpoints

### 1. Login

**`POST /api/auth/login`**

Authenticates a user with email and password. Returns user info along with JWT access and refresh tokens.

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongP@ss123"
}
```

**Success Response `200`:**

```json
{
  "user": {
    "id": "USR_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "isActive": true,
    "isAdmin": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Error Responses:**

| Code | Body |
| ---- | ---- |
| `401` | `{ "message": "Invalid email or password", "statusCode": 401 }` |
| `400` | `{ "message": "Login failed. Please try again later.", "statusCode": 400 }` |

---

### 2. Register

**`POST /api/auth/register`**

Creates a new user account. Requires a valid OTP that was sent to the user's email.

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

**Success Response `201`:**

```json
{
  "user": {
    "id": "USR_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "isActive": true,
    "isAdmin": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Error Responses:**

| Code | Body |
| ---- | ---- |
| `409` | `{ "message": "User with this email already exists", "statusCode": 409 }` |
| `400` | `{ "message": "Invalid or expired OTP code", "statusCode": 400 }` |
| `400` | `{ "message": "Registration failed. Please try again later.", "statusCode": 400 }` |

---

### 3. Send OTP

**`POST /api/auth/otp/send`**

Sends a 6-digit OTP to the user's email. Used for both registration and password-reset flows. If `isRegistering` is `true`, it checks the user does **not** exist. If `isRegistering` is `false`, it checks the user **does** exist.

Request:

```json
{
  "email": "user@example.com",
  "isRegistering": false
}
```

**Success Response `201`:**

```json
{
  "message": "OTP sent"
}
```

**Error Responses:**

| Code | Body | Scenario |
| ---- | ---- | -------- |
| `409` | `{ "message": "User with this email already exists", "statusCode": 409 }` | `isRegistering: true` but user exists |
| `429` | `{ "message": "Too many requests. Please wait before retrying.", "statusCode": 429 }` | Rate limit exceeded (5 req/60s) |
| `400` | `{ "message": "User with this email does not exist", "statusCode": 400 }` | `isRegistering: false` but user doesn't exist |
| `502` | `{ "message": "Failed to send OTP email", "statusCode": 502 }` | Email delivery failure |

---

### 4. Verify OTP

**`POST /api/auth/otp/verify`**

Verifies the 6-digit OTP. For the password-reset flow, returns a `reset_token` that must be passed to `PATCH /auth/password/update` in the `Authorization` header.

Request:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response `201` (password-reset flow):**

```json
{
  "message": "OTP verified",
  "reset_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response `201` (registration flow):**

```json
{
  "message": "OTP verified"
}
```

**Error Responses:**

| Code | Body | Scenario |
| ---- | ---- | -------- |
| `429` | `{ "message": "Too many requests. Please wait before retrying.", "statusCode": 429 }` | Rate limit exceeded (5 req/60s) |
| `400` | `{ "message": "Invalid or expired OTP code", "statusCode": 400 }` | Invalid or expired code |

> **Note:** The returned field is `reset_token` (snake_case), NOT `resetToken`. The frontend should use `data.reset_token` when extracting the token.

---

### 5. Update Password

**`PATCH /api/auth/password/update`**

Updates the user's password. Requires the `reset_token` from OTP verification in the `Authorization` header.

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

**Success Response `201`:**

```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**

| Code | Body |
| ---- | ---- |
| `401` | `{ "message": "Unauthorized", "statusCode": 401 }` — Missing or invalid reset token |
| `400` | `{ "message": "User not found", "statusCode": 400 }` |

---

### 6. Refresh Tokens

**`POST /api/auth/refresh`**

Accepts an **expired** access token in the `Authorization` header plus a valid refresh token in the body, and returns a new pair of tokens.

Headers:

```
Authorization: Bearer <expired_access_token>
Content-Type: application/json
```

Request:

```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Success Response `200`:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "bmV3IHJlZnJlc2ggdG9rZW4..."
}
```

**Error Responses:**

| Code | Body |
| ---- | ---- |
| `401` | `{ "message": "Could not refresh tokens", "statusCode": 401 }` |

---

### 7. Logout

**`POST /api/auth/logout`**

Invalidates the user's refresh token in the database. Requires a valid JWT access token.

**Success Response `200`:**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

| Code | Body |
| ---- | ---- |
| `401` | `{ "message": "Unauthorized", "statusCode": 401 }` — Missing or invalid access token |
| `400` | `{ "message": "Logout failed", "statusCode": 400 }` |

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
      "industryScore": 0.9,
      "locationScore": 0.7,
      "commitmentScore": 1.0,
      "founderTypeScore": 0.8,
      "personalityScore": 0.75,
      "vectorScore": 0.82
    }
  }
]
```

### 11. Generate AI Match Summary

**`POST /api/profiles/me/match-summary/:profileId`**

Generates a natural-language match summary between your profile and another user's profile using an AI chat model via OpenRouter. The summary addresses **you** in second person ("you/your").

The summary is **generated on demand** when the endpoint is called (first request takes 1–3 seconds while the AI processes). Results are **cached in Redis for 1 hour** — subsequent requests for the same pair return instantly.

**Cache invalidation:** Cached summaries are automatically invalidated when either profile is updated, deleted, or has its preferences changed. This ensures you always see up-to-date compatibility analysis.

Request:

```
POST /api/profiles/me/match-summary/PFD_def456
Authorization: Bearer <your_jwt_token>
```

Response 200:

```json
{
  "summary": "You and Sarah make a strong co-founder pairing. Your fintech engineering background (Software Development, AI/ML) perfectly complements Sarah's expertise in Marketing and Business Development, covering both product and go-to-market needs. Both of you are committed Full-time and located on the US West Coast, ensuring strong alignment on availability and geography. Sarah's serial entrepreneur experience paired with your first-time founder energy creates a balanced mentor-mentee dynamic that could accelerate your venture."
}
```

### 12. Update Co-founder Preferences

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

All matches endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### 1. Get Algorithmic Matches

**`GET /api/matches`**

Runs the **3-stage matching pipeline** (preference SQL scoring → pgvector cosine similarity → weighted ranking) and returns the top 10 co-founder matches. Results are **cached in Redis for 15 minutes** — subsequent requests within that window return instantly.

If no profile or preferences exist, returns a **400 Bad Request** with the message `"You must create a profile before viewing matches"`.

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

Sends a connection request to any user (even if not algorithmically matched). The compatibility score is computed at request time from your preferences to their profile.

**Note:** The receiver automatically gets a notification created in their notifications list.

Response 201:

```json
{
  "id": "CNR_abc123",
  "sender": {
    "id": "USR_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "matchedProfileId": "PFD_abc123"
  },
  "receiver": {
    "id": "USR_def456",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "matchedProfileId": "PFD_def456"
  },
  "status": "pending",
  "compatibilityScore": 0.75,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error cases:**
- `400` — Sending to yourself (`"Cannot send connection request to yourself"`)
- `400` — Duplicate request (`"Connection request already sent"`)
- `404` — Target user not found

### 3. Get Incoming Requests

**`GET /api/matches/incoming`**

Returns all **pending** connection requests sent to you — these are requests you can accept or reject.

Response 200:

```json
[
  {
    "id": "CNR_abc123",
    "sender": {
      "id": "USR_def456",
      "firstName": "Sarah",
      "lastName": "Smith",
      "email": "sarah@example.com",
      "matchedProfileId": "PFD_def456"
    },
    "receiver": {
      "id": "USR_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "matchedProfileId": "PFD_abc123"
    },
    "status": "pending",
    "compatibilityScore": 0.72,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 4. Get Sent Requests

**`GET /api/matches/sent`**

Returns all connection requests **you** have sent (pending, accepted, and rejected). Shows who you've reached out to.

Response 200:

```json
[
  {
    "id": "CNR_def789",
    "sender": {
      "id": "USR_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "matchedProfileId": "PFD_abc123"
    },
    "receiver": {
      "id": "USR_ghi012",
      "firstName": "Mike",
      "lastName": "Chen",
      "email": "mike@example.com",
      "matchedProfileId": "PFD_ghi012"
    },
    "status": "accepted",
    "compatibilityScore": 0.81,
    "createdAt": "2024-01-14T09:15:00.000Z"
  }
]
```

### 5. Accept/Reject Connection Request

**`PATCH /api/matches/requests/:id/status`**

Only the **receiver** can accept or reject a request. The `status` field must be `"accepted"` or `"rejected"`. Requests that have already been responded to cannot be modified.

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
    "email": "jane@example.com",
    "matchedProfileId": "PFD_def456"
  },
  "receiver": {
    "id": "USR_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "matchedProfileId": "PFD_abc123"
  },
  "status": "accepted",
  "compatibilityScore": 0.68,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error cases:**
- `404` — Request not found
- `400` — Not the receiver (`"You can only respond to requests sent to you"`)
- `400` — Already responded (`"Cannot modify a request that is already accepted or rejected"`)

---

## 🔔 Notifications Endpoints

> **Note:** Notification responses are serialized through a DTO that omits internal fields. The `userId` foreign key is **not** included in the response — the frontend can assume the notifications belong to the authenticated user.

### 1. Get My Notifications

**`GET /api/notifications`**

Returns notifications for the authenticated user, ordered by creation date (newest first). Supports pagination via query parameters.

**Query Parameters:**

| Param    | Type   | Default | Description                             |
| -------- | ------ | ------- | --------------------------------------- |
| `offset` | number | `0`     | Number of records to skip               |
| `limit`  | number | `10`    | Max records to return (capped at `100`) |

Response 200:

```json
[
  {
    "id": "NTF_abc123",
    "message": "Match summary for Sarah Smith: Sarah and John make a strong co-founder pairing...",
    "isRead": false,
    "type": "match_summary",
    "referenceId": "PFD_def456",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Mark Notification as Read

**`PATCH /api/notifications/:id/read`**

Marks a single notification as read.

Response 200:

```json
{
  "id": "NTF_abc123",
  "message": "Match summary for Sarah Smith...",
  "isRead": true,
  "type": "match_summary",
  "referenceId": "PFD_def456",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. Mark All Notifications as Read

**`PATCH /api/notifications/read-all`**

Marks **all unread notifications** for the authenticated user as read in a single query. Returns the count of notifications that were updated.

Response 200:

```json
{
  "updated": 5
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

| Endpoint                                     | Returns                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| `GET /api/constants/industries`              | `["Fintech", "Healthtech", "E-commerce", ...]`       |
| `GET /api/constants/founder-statuses`        | `["First-time Founder", "Serial Entrepreneur", ...]` |
| `GET /api/constants/commitment-levels`       | `["Full-time", "Part-time", ...]`                    |
| `GET /api/constants/personality-traits`      | `["Visionary", "Analytical", ...]`                   |
| `GET /api/constants/skills`                  | `["Software Development", "Marketing", ...]`         |
| `GET /api/constants/financial-contributions` | `["Can invest >$100K personally", ...]`              |
| `GET /api/constants/locations`               | `["US - West Coast", "US - East Coast", ...]`        |

---

## 📱 Frontend Implementation Examples

### Registration Flow (OTP + Register)

```jsx
function RegisterPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email -> otp -> register

  const sendOtp = async () => {
    await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, isRegistering: true }),
    });
    setStep('otp');
  };

  const register = async (data) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const { accessToken, refreshToken } = await res.json();
    localStorage.setItem('accessToken', accessToken);
    // Store refreshToken in a secure HttpOnly cookie instead of localStorage
    // (HttpOnly flag prevents XSS access; Secure and SameSite prevent CSRF)
    document.cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
    // Note: HttpOnly flag must be set by the server in Set-Cookie response header
  };
}
```

### Connection Requests Manager

```jsx
function ConnectionRequests() {
  const [incoming, setIncoming] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch('/api/matches/incoming', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((r) => r.json())
      .then(setIncoming);
  }, []);

  const handleRequest = async (requestId, status) => {
    await fetch(`/api/matches/requests/${requestId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    setIncoming((prev) => prev.filter((r) => r.id !== requestId));
  };

  return (
    <div>
      {incoming.map((request) => (
        <div key={request.id}>
          <h3>
            {request.sender.firstName} {request.sender.lastName} wants to
            connect
          </h3>
          <p>{Math.round(request.compatibilityScore * 100)}% compatibility</p>
          <button onClick={() => handleRequest(request.id, 'accepted')}>
            Accept
          </button>
          <button onClick={() => handleRequest(request.id, 'rejected')}>
            Decline
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Rate Limit Handling

```jsx
import { useState } from 'react';

/**
 * Custom hook that wraps fetch with automatic 429 (rate limit) handling.
 * When blocked, it reads the Retry-After header and waits before retrying.
 */
function useApi() {
  const [rateLimited, setRateLimited] = useState(null); // { retryAfter, endpoint }

  const fetchWithRetry = async (url, options = {}) => {
    const MAX_RETRIES = 1; // Only retry once to avoid cascading blocks

    const attempt = async () => {
      const res = await fetch(url, options);

      if (res.status === 429) {
        const retryAfterMs = parseInt(res.headers.get('Retry-After') || '60000', 10);

        setRateLimited({ retryAfter: retryAfterMs, endpoint: url });
        console.warn(`Rate limited on ${url}. Retrying in ${retryAfterMs}ms.`);

        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
        setRateLimited(null);

        return await attempt(); // Single retry after waiting
      }

      return res;
    };

    return attempt();
  };

  return { fetchWithRetry, rateLimited };
}


// ── Usage with OTP endpoints ──────────────────────────────────────────

function OtpButton() {
  const { fetchWithRetry, rateLimited } = useApi();
  const [cooldown, setCooldown] = useState(0);

  const sendOtp = async () => {
    const res = await fetchWithRetry('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', isRegistering: false }),
    });

    if (res.ok) {
      // Start a 60-second client-side cooldown to stay well within the 5 req/min limit
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div>
      <button onClick={sendOtp} disabled={cooldown > 0 || rateLimited !== null}>
        {cooldown > 0
          ? `Resend in ${cooldown}s`
          : rateLimited
            ? `Rate limited — waiting...`
            : 'Send OTP'}
      </button>
      {rateLimited && (
        <p style={{ color: 'orange', fontSize: '0.875rem' }}>
          Too many requests. Retrying automatically after{' '}
          {Math.round(rateLimited.retryAfter / 1000)}s…
        </p>
      )}
    </div>
  );
}


// ── Building a rate-limit-aware API client ─────────────────────────────

/**
 * Reads rate limit headers from a response and warns the UI when
 * the remaining quota is running low.
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Read rate limit headers (supports suffixed names like X-RateLimit-Remaining-otp)
  const getHeader = (base) => {
    const exact = res.headers.get(base);
    if (exact) return exact;
    // Fallback: find any header starting with the base name
    for (const [key, val] of res.headers.entries()) {
      if (key.toLowerCase().startsWith(base.toLowerCase())) {
        return val;
      }
    }
    return null;
  };

  const remaining = parseInt(getHeader('X-RateLimit-Remaining') || '', 10);
  const limit = parseInt(getHeader('X-RateLimit-Limit') || '', 10);

  if (!isNaN(remaining) && !isNaN(limit) && remaining < limit * 0.2) {
    console.warn(
      `API rate limit running low: ${remaining}/${limit} remaining.`,
    );
  }

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') || '60000', 10);
    throw { code: 429, retryAfter, message: 'Rate limit exceeded' };
  }

  return res;
}
```

---

### Password Reset Flow

```jsx
function PasswordReset() {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  const sendOtp = async () => {
    await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, isRegistering: false }),
    });
  };

  const verifyOtp = async (otp) => {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setResetToken(data.reset_token);
  };

  const updatePassword = async (newPassword) => {
    await fetch('/api/auth/password/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + resetToken,
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
   └─ GET /matches  → AI-powered match suggestions (cached 15 minutes)

4. Connect
   ├─ POST /matches/request/:userId  → Send connection request
   ├─ GET /matches/incoming          → See who wants to connect
   ├─ GET /matches/sent              → Track sent requests
   └─ PATCH /matches/requests/:id/status  → Accept / Reject

5. Generate AI Match Summary
   └─ POST /profiles/me/match-summary/:profileId → AI-powered compatibility analysis

6. Manage Notifications
   ├─ GET /notifications                    → View recent notifications
   ├─ PATCH /notifications/:id/read         → Mark a single notification as read
   └─ PATCH /notifications/read-all         → Mark all notifications as read

7. Manage Profile & Preferences
   ├─ PATCH /profiles/me             → Update profile
   ├─ PATCH /profiles/me/preferences → Update co-founder preferences
   └─ GET /profiles/me               → View current profile
```

---

## 📊 Response Status Codes

| Code    | Meaning                                  |
| ------- | ---------------------------------------- |
| **200** | Success                                  |
| **201** | Created (resource created successfully)  |
| **204** | No Content (deletion success)            |
| **400** | Bad Request (validation error)           |
| **401** | Unauthorized (missing or invalid token)  |
| **404** | Not Found (resource doesn't exist)       |
| **409** | Conflict (duplicate / already exists)    |
| **429** | Too Many Requests (rate limit exceeded)  |
| **502** | Bad Gateway (e.g. email service failure) |
| **500** | Internal Server Error                    |

---

## 🎯 Key Features

✅ **AI-powered embeddings** — Profiles and preferences are vectorized via OpenRouter for semantic matching  
✅ **3-stage matching pipeline** — pgvector cosine similarity → field-level scoring → weighted ranking  
✅ **Directional compatibility** — Browse sees _your_ compatibility to others, not mutual  
✅ **Asymmetric requests** — Send connection requests to anyone, even without a mutual match  
✅ **Mutual consent** — Both sides must accept for a connection to be established  
✅ **Redis caching** — Two separate caches with different TTLs:

  | Cache | Endpoint | TTL | Invalidated when |
  | ----- | -------- | --- | ---------------- |
  | Match results | `GET /matches` | **15 minutes** | Profile or preferences updated |
  | Match summaries | `POST /profiles/me/match-summary/:id` | **1 hour** | Either profile in the pair is updated, deleted, or preferences changed |

  The match results cache is short-lived because compatibility scores depend on your preferences, which users tweak frequently during discovery. The match summary cache is longer-lived because the AI-generated text is a one-off analysis that only changes when the underlying profile data changes — and invalidation clears it immediately when that happens.  
✅ **OTP-protected password reset** — 6-digit email OTP with reset token flow  
✅ **Duplicate prevention** — Can't send multiple requests to the same user  
✅ **Admin endpoints** — Full CRUD for user and profile management
