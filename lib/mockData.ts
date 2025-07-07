import { Analytics, Paste } from "@/types";

export const mockPastes: Paste[] = [
  {
    id: "1",
    title: "React Component with Hooks",
    content: `import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;`,
    language: "typescript",
    isPublic: true,
    createdAt: new Date(2024, 0, 15),
    views: 1247,
    author: "John Doe",
    authorId: "user1",
  },
  {
    id: "2",
    title: "Python Data Analysis",
    content: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load and analyze data
data = pd.read_csv('sales_data.csv')
data['date'] = pd.to_datetime(data['date'])

# Calculate monthly sales
monthly_sales = data.groupby(data['date'].dt.to_period('M'))['sales'].sum()

# Create visualization
plt.figure(figsize=(12, 6))
monthly_sales.plot(kind='line', marker='o')
plt.title('Monthly Sales Trend')
plt.xlabel('Month')
plt.ylabel('Sales ($)')
plt.grid(True, alpha=0.3)
plt.show()`,
    language: "python",
    isPublic: false,
    createdAt: new Date(2024, 0, 12),
    views: 834,
    author: "John Doe",
    authorId: "user1",
  },
  {
    id: "3",
    title: "Go HTTP Server",
    content: `package main

import (
    "encoding/json"
    "log"
    "net/http"
    "github.com/gorilla/mux"
)

type User struct {
    ID    string \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    userID := vars["id"]
    
    // Mock user data
    user := User{
        ID:    userID,
        Name:  "John Doe",
        Email: "john@example.com",
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/users/{id}", getUserHandler).Methods("GET")
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}`,
    language: "go",
    isPublic: true,
    createdAt: new Date(2024, 0, 10),
    views: 567,
    author: "John Doe",
    authorId: "user1",
  },
];

export const mockAnalytics: Analytics = {
  totalPastes: 3,
  totalViews: 2648,
  popularLanguages: [
    { language: "TypeScript", count: 1 },
    { language: "Python", count: 1 },
    { language: "Go", count: 1 },
  ],
  viewsOverTime: [
    { date: "2024-01-01", views: 120 },
    { date: "2024-01-02", views: 150 },
    { date: "2024-01-03", views: 200 },
    { date: "2024-01-04", views: 180 },
    { date: "2024-01-05", views: 250 },
    { date: "2024-01-06", views: 300 },
    { date: "2024-01-07", views: 280 },
  ],
};
