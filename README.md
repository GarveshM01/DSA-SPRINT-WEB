# 🚀 90-Day DSA Sprint Tracker

A self-contained, zero-dependency 90-Day Data Structures & Algorithms (DSA) Sprint Tracker designed specifically for tier-3 college students targeting software engineering roles at **TCS (NQT / Digital / Prime)**, **Infosys (InfyTQ / Specialist Programmer)**, and **HashedIn**.

![DSA Tracker Banner](https://img.shields.io/badge/DSA--Sprint-90--Days-brightgreen?style=for-the-badge)
![Target Companies](https://img.shields.io/badge/Target-TCS%20%7C%20Infosys%20%7C%20HashedIn-blue?style=for-the-badge)
![Zero Build](https://img.shields.io/badge/Build-Single--File--HTML-orange?style=for-the-badge)

---

## 🎯 Key Features

- ⚡ **Zero Setup & Zero Build**: ONE self-contained `index.html` file. Works by simply double-clicking!
- 📊 **Live Dashboard**:
  - Overall progress bar (% solved out of 270 questions).
  - Days completed tracker (turns green automatically when all 3 questions of a day are ticked).
  - Streak tracker (Current Streak 🔥 and Best Streak ⚡).
  - Easy, Medium, and Hard solved counters + Revisit ⭐ total.
- 📆 **90-Day Structured Roadmap**:
  - **Days 1-7**: Java Refresher, Control Flow, Patterns & Basic Math.
  - **Days 8-20**: Arrays (Two Pointers, Prefix Sum, Kadane's) & Strings.
  - **Days 21-30**: Hashing (HashMap/HashSet), Sliding Window & Binary Search Intro.
  - **Days 31-40**: Advanced Binary Search, Recursion, Backtracking & Bit Manipulation.
  - **Days 41-50**: Linked List, Stack, Queue & Monotonic Stack.
  - **Days 51-62**: Binary Trees, BST & Heaps / Priority Queue.
  - **Days 63-72**: Graphs (BFS, DFS, Grid Problems, Topo Sort) & Greedy.
  - **Days 73-82**: Dynamic Programming (1D, 2D Grid, Knapsack, LCS/LIS).
  - **Days 83-90**: Company-focused revision sets & timed mock days (3 questions in 60 mins).
  - **Consolidation Days**: Every 7th day (7, 14, 21, 28...) is a lighter revision day.
- 🧩 **270 High-Yield Questions**:
  - 113 Easy (~42%), 132 Medium (~49%), 25 Hard (~9%).
  - Direct links to LeetCode and GeeksforGeeks.
  - Curated Hinglish YouTube tutorial links for every question & daily concept videos.
- 🔍 **Advanced Filtering & Search**:
  - Search box for title, topic, or personal notes.
  - Filter by Difficulty (Easy, Medium, Hard).
  - Filter by Status (Completed, Pending, Starred/Revisit).
  - Filter by Roadmap Phase (Phases 1-9).
  - **Jump to Today (🎯)**: Set your start date once to highlight and auto-scroll to your current day.
- 💾 **Data Persistence & Backups**:
  - All progress, notes, and stars saved automatically in `localStorage`.
  - **Export JSON** and **Import JSON** buttons for backups.
  - Theme switcher (Dark / Light mode).

---

## 🚀 How to Use

1. Clone or download this repository.
2. Double-click `index.html` to open it in any modern web browser.
3. Click **📅 Set Start Date** to align the sprint with your calendar.
4. Start solving 3 questions daily!

---

## 🛠️ Data Structure

All question data lives in a single array `SPRINT_DATA` at the top of the `<script>` tag in `index.html`:

```javascript
const SPRINT_DATA = [
  {
    day: 1,
    topic: "Java Refresher - Basics, I/O & Control Flow",
    conceptVideo: "https://www.youtube.com/watch?v=lus16ff6c14",
    questions: [
      {
        title: "User Input / Output in Java & Data Types",
        difficulty: "Easy",
        platform: "GeeksforGeeks",
        link: "https://www.geeksforgeeks.org/problems/java-input-output1341/1",
        video: "https://www.youtube.com/watch?v=lus16ff6c14"
      },
      ...
    ]
  },
  ...
];
```

---

## 📄 License

MIT License - feel free to use, share, and customize for your preparation!
