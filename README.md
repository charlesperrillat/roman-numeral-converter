# Roman Numeral Converter
 
The goal of this project is to convert an integer (0 to 100) into Roman numerals.

---

## 🚀 Branches

- **`cp-dev-step-1`**:  
  Classic conversion using an AJAX request (frontend → backend).

- **`cp-dev-step-2`**:  
  Conversion result sent via **Server-Sent Events (SSE)**.

---

## 📂 Project structure

roman-numeral-converter/
backend/ # Node.js + TypeScript API
frontend/ # React + TypeScript + Tailwind app

---

## ▶️ How to run the project

### Backend
1. Go to the **backend** folder:
   ```bash
   cd backend
2. Start the server:
   ```bash
   npm run dev
3. The backend runs by default on http://localhost:3000

### Frontend
1. Go to the **frontend** folder:
   ```bash
   cd frontend
2. Start the app:
   ```bash
   npm run dev
3. The frontend is available at http://localhost:5173 (or the port displayed by Vite).

---

## 🛠️ Tech stack

- **Backend**: Node.js, TypeScript, Express
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Core logic**: Integer (0–100) to Roman numeral conversion

## 📌 Notes

- The conversion algorithm is shared across both steps.
- The logic can be found in backend/src/utils/romanConverter.ts.
- The branches only differ by the communication method (AJAX vs SSE).
