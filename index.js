const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(express.urlencoded());

function generateSecureHex(length) {
  return crypto.randomBytes(length / 2).toString("hex");
}

function formatDate(humanDate) {
  const d = new Date(humanDate);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

let usersDatabaseMock = [];

let exercisesDatabaseMock = [];

app.post("/api/users", (req, res) => {
  const user = {
    username: req.body.username,
    _id: generateSecureHex(24),
  };

  usersDatabaseMock.push(user);

  res.json(user);
});

app.get("/api/users", (req, res) => {
  const users = usersDatabaseMock;

  res.json(users);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  const exercise = {
    _id: userId,
    username:
      usersDatabaseMock.find((u) => u._id === userId)?.username ||
      "Unknown User",
    description,
    duration,
    date: date || new Date().toISOString(),
  };

  exercisesDatabaseMock.push(exercise);

  const userWithExercise = {
    _id: userId,
    username: exercise.username,
    description: exercise.description,
    duration: parseInt(exercise.duration, 10),
    date: new Date(exercise.date).toDateString(),
  };

  res.json(userWithExercise);
});

app.get("/api/users/:_id/logs", (req, res) => {
  const userId = req.params._id;
  const user = usersDatabaseMock.find((u) => u._id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const userExercises = exercisesDatabaseMock.filter(
    (exercise) => exercise._id === userId
  );

  const log = userExercises.map((exercise) => ({
    description: exercise.description,
    duration: parseInt(exercise.duration, 10),
    date: new Date(exercise.date).toDateString(),
  }));

  const { from, to, limit } = req.query;

  const fromTimestamp = from ? Date.parse(from) : null;
  const toTimestamp = to ? Date.parse(to) : null;

  let filteredLogs = log.filter((entry) => {
    const logTimestamp = Date.parse(formatDate(entry.date));

    if (fromTimestamp && logTimestamp < fromTimestamp) return false;

    if (toTimestamp && logTimestamp > toTimestamp) return false;
    return true;
  });

  if (limit) {
    filteredLogs = filteredLogs.slice(0, parseInt(limit, 10));
  }

  const userLog = {
    ...user,
    count: filteredLogs.length,
    log: filteredLogs,
  };

  res.json(userLog);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
