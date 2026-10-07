# 🏥 OPD Mini Module

A small, functional **Outpatient Department (OPD) Management Module** designed to manage patient registration, appointment booking, and doctor consultation summaries.

The application provides a simple workflow for hospital or clinic staff to register patients, schedule appointments, record consultation details, and view patient consultation history.

---

## 🚀 Features

### 👤 Patient Registration

- Register new patients
- Store patient information:
  - Patient Name
  - Gender
  - Age
  - Phone Number
- View all registered patients
- Search patients by name or phone number
- View individual patient consultation history

### 📅 Appointment Booking

- Book appointments for registered patients
- Select doctor
- Select appointment date and time
- View today's appointments
- Track appointment status

### 🩺 Consultation Summary

- Open consultation from an appointment
- Record patient vitals
- Add consultation notes
- Mark consultation as completed
- View completed consultation history for a patient

### 📊 Dashboard

- View total registered patients
- View today's appointment count
- Quick navigation to major OPD modules
- Simple and responsive interface

---

## 🛠️ Tech Stack

### Frontend

- **Next.js** – App Router
- **React.js**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### Backend

- **Next.js Route Handlers**
- REST-style API endpoints
- **Mongoose**

### Database

- **MongoDB Atlas**

### Validation

- **Zod**

### Deployment

- **Vercel**

---

## 🏗️ Architecture

The project follows a simple full-stack architecture using Next.js App Router.

```text
┌───────────────────────────┐
│        Next.js UI         │
│   React + TypeScript      │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     API Route Handlers    │
│       REST APIs           │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│         Mongoose          │
│      Data / Models        │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│       MongoDB Atlas       │
└───────────────────────────┘
