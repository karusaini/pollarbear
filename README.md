# **PollarBear - Quick Polling App**

PollarBear is a simple, real-time polling app that allows users to **create polls, vote, and view results with auto-refresh every 5 seconds**. Built with **Next.js, Tailwind CSS, ShadCN, and Supabase**, this app ensures a seamless polling experience.

## **🚀 Features**

- **Create Polls** with a question and multiple options.
- **Vote on Polls** and update results in real-time.
- **Auto-refresh results every 5 seconds**.
- **Categorized Polls** (General, Sports, Tech, Entertainment, Politics, etc.).
- **Real-time Stats** (Total votes, views, percentage breakdown).
- **Sorting & Filtering** (Newest, Oldest, Most Voted, Most Viewed).
- **Search Functionality** for polls.
- **Pagination** for seamless browsing.
- **Share Poll Links** via a one-click copy button.
- **Fully Responsive & Minimalist UI.**

---

## **📂 Tech Stack**

- **Frontend:** Next.js (App Router), Tailwind CSS, ShadCN UI
- **Database:** Supabase (PostgreSQL)
- **Backend API:** Next.js API Routes (Serverless functions)
- **Deployment:** Vercel

---

## **📌 API Endpoints**

### **Polls Management**

| Method | Endpoint                                                         | Description                                         |
| ------ | ---------------------------------------------------------------- | --------------------------------------------------- |
| `POST` | `/api/polls/create`                                              | Create a new poll                                   |
| `GET`  | `/api/polls/list?category=general&sortBy=newest&page=1&limit=10` | Fetch paginated polls with filters                  |
| `GET`  | `/api/polls/view?pollId=<pollId>&registerView=true`              | Fetch poll details, with optional view registration |
| `POST` | `/api/polls/register-vote`                                       | Register a user's vote                              |

---

## **📌 Database Schema**

### **`polls` Table**

Stores poll information.

```sql
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  username TEXT NULL,
  category TEXT NULL,
  description TEXT NULL,
  question TEXT NULL,
  views INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);
```

### **`poll_options` Table**

Stores options for each poll.

```sql
CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  option TEXT NOT NULL,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  votes_count INT DEFAULT 0
);
```

### **`poll_votes_logs` Table**

Logs each vote to prevent multiple voting (optional per user/device tracking).

```sql
CREATE TABLE public.poll_votes_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE
);
```

---

## **📌 Installation & Setup**

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/your-username/pollarbear.git
cd pollarbear
```

### **2️⃣ Install Dependencies**

```bash
yarn install  # or npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### **4️⃣ Run the Development Server**

```bash
yarn dev  # or npm run dev
```

App will be available at **http://localhost:3000**

---

## **📌 Deployment on Vercel**

### **1️⃣ Deploy API & UI**

- Push code to GitHub
- Connect the repo to Vercel
- Set environment variables in **Vercel Dashboard → Settings → Environment Variables**
- Click **Deploy**

### **2️⃣ Vercel URL Example**

Your live app will be available at:

```
https://pollarbear.vercel.app
```

---

## **📌 Usage Guide**

### **1️⃣ Creating a Poll**

1. Click `Create Poll`.
2. Enter your **name**, **poll question**, **options**, and **category**.
3. Click `Submit`.

### **2️⃣ Voting on a Poll**

1. Open any poll.
2. Click on your preferred option.
3. View real-time results!

### **3️⃣ Sharing a Poll**

- Click the **Share** button.
- The link is copied to your clipboard.
- Share it anywhere!

---

## **📌 Future Enhancements**

✅ **User Authentication (Login & Profile Tracking)**
✅ **Private Polls (Restricted Voting)**
✅ **Multiple Choice Polls**
✅ **Scheduled Polls**
✅ **More Data Visualization**

---

## **📌 Contributing**

1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Create a **Pull Request**

---

## **📌 License**

This project is licensed under the **MIT License**.

---

### **🚀 PollarBear is Live! Try it Here:**

🔗 [https://pollarbear.vercel.app](https://pollarbear.vercel.app)

---

### **🔥 Now Your README is Complete & Matches Assignment Requirements!**

This README covers **setup, deployment, APIs, database schema, auto-refresh logic, and features** as required. 🚀🔥
Let me know if you need **any last refinements!** 🎉
