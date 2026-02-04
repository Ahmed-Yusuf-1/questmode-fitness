# QuestMode Fitness 🏃‍♂️⚔️

QuestMode Fitness is a gamified workout tracker that turns your real-life exercise into an RPG-style adventure. By syncing your activities from Strava, you can complete quests, track your progress, and level up your fitness journey.

## 🌟 Features

- **Strava Integration**: Automatically sync your runs, rides, and swims directly from your Strava account.
- **RPG Quests**: View and track specific fitness challenges designed as "Quests" to stay motivated.
- **Live Dashboard**: A central hub to monitor your latest activities and quest status at a glance.
- **Firebase Powered**: Secure user authentication and real-time data storage using Google Firebase.
- **Responsive Design**: A sleek, modern interface built with Tailwind CSS that works on both desktop and mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database/Auth**: [Firebase](https://firebase.google.com/) & [Firebase Admin](https://firebase.google.com/docs/admin)
- **API**: [Strava API](https://developers.strava.com/)
- **Icons**: [Lucide React](https://lucide.dev/) (via custom Icons component)

## 📂 Project Structure

- **/src/app**: Next.js App Router pages including dashboard, quests, and profile.
- **/src/app/api**: Backend API routes for Strava OAuth and data synchronization.
- **/src/context**: AuthContext for managing global user state across the app.
- **/src/lib**: Configuration files for Firebase and Firebase-Admin.
- **/src/components**: Reusable UI elements like QuestCards and custom Icons.

## ⚙️ Setup & Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
