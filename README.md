# Exercise Tracker

This is the boilerplate for the Exercise Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker


## API Endpoints

### 1. Create a New User

**POST** `/api/users`

- **Body:** `username` (string)
- **Response:**  
  ```json
  {
    "username": "john",
    "_id": "generatedUserId"
  }
  ```
**Example:**
```bash
curl -X POST -d "username=john" https://your-app-url/api/users
```

---

### 2. Get All Users

**GET** `/api/users`

- **Response:**  
  ```json
  [
    { "username": "john", "_id": "generatedUserId" },
    { "username": "jane", "_id": "anotherId" }
  ]
  ```
**Example:**
```bash
curl https://your-app-url/api/users
```

---

### 3. Add Exercise for a User

**POST** `/api/users/:_id/exercises`

- **Params:** `_id` (User ID)
- **Body:**  
  - `description` (string, required)
  - `duration` (number, required)
  - `date` (string, optional, format: YYYY-MM-DD)
- **Response:**  
  ```json
  {
    "_id": "userId",
    "username": "john",
    "description": "Running",
    "duration": 30,
    "date": "Mon Aug 03 2025"
  }
  ```
**Example:**
```bash
curl -X POST -d "description=Running&duration=30&date=2025-08-03" https://your-app-url/api/users/userId/exercises
```

---

### 4. Get User's Exercise Log

**GET** `/api/users/:_id/logs`

- **Params:** `_id` (User ID)
- **Query Parameters (optional):**
  - `from` (date: YYYY-MM-DD) – Return logs after this date
  - `to` (date: YYYY-MM-DD) – Return logs before this date
  - `limit` (number) – Limit number of logs
- **Response:**  
  ```json
  {
    "username": "john",
    "_id": "userId",
    "count": 2,
    "log": [
      {
        "description": "Running",
        "duration": 30,
        "date": "Mon Aug 03 2025"
      },
      {
        "description": "Swimming",
        "duration": 45,
        "date": "Tue Aug 04 2025"
      }
    ]
  }
  ```
**Example:**
```bash
curl "https://your-app-url/api/users/userId/logs?from=2025-08-01&to=2025-08-10&limit=2"
```

---

## Notes

- All dates in responses are formatted as readable strings (e.g., `Mon Aug 03 2025`).
- If `date` is not provided when adding an exercise, the current date is used.
- Replace `your-app-url` and `userId` with your actual deployed URL

