# NadoumiShop

**Enterprise-Grade Full-Stack E-Commerce Solution**

NadoumiShop is a comprehensive, scalable e-commerce platform designed for high performance and reliability. Built with a modern microservices architecture, it features a robust backend, a responsive web frontend, and a cross-platform mobile application, all orchestrated with Kubernetes on Alibaba Cloud.

---

## 🚀 Technology Stack

### **Frontend (Web)**

- **Framework**: [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend (API)**

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Caching & Queues**: [Redis](https://redis.io/) (via [BullMQ](https://docs.bullmq.io/))
- **Event Streaming**: [Apache Kafka](https://kafka.apache.org/) - _Scalable Event Processing_
- **Authentication**: JWT, bcrypt

### **Mobile Application**

- **Framework**: [Flutter](https://flutter.dev/) (Dart)
- **Platform Support**: iOS, Android

### **Infrastructure & DevOps**

- **Containerization**: [Docker](https://www.docker.com/), Docker Compose
- **Orchestration**: [Kubernetes (K8s)](https://kubernetes.io/)
- **Cloud Provider**: [Alibaba Cloud](https://www.alibabacloud.com/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

---

## 📂 Project Structure

This project follows a monorepo structure:

```bash
nadoumishop/
├── backend/            # Express.js API Server
├── frontend/           # React Web Application
├── nadoumi/            # Flutter Mobile Application
├── docker-compose.yml  # Local development infrastructure
└── README.md           # Project documentation
```

---

## 🛠 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose**
- **Flutter SDK** (for mobile development)
- **Kubectl** (optional, for K8s management)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/nadoumishop.git
    cd nadoumishop
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    # Set up environment variables (.env)
    # npx prisma generate
    ```

3.  **Install Frontend Dependencies:**

    ```bash
    cd frontend
    npm install
    ```

4.  **Install Mobile Dependencies:**
    ```bash
    cd ../nadoumi
    flutter pub get
    ```

### Running the Application (Local Development)

1.  **Start Infrastructure Service (PostgreSQL, Redis, MailDev):**
    From the root directory:

    ```bash
    docker-compose up -d
    ```

2.  **Start the Backend Server:**

    ```bash
    cd backend
    npm run dev
    ```

    The server will start on `http://localhost:5000` (or your configured port).
    Swagger Documentation available at `/api-docs`.

3.  **Start the Frontend Application:**

    ```bash
    cd frontend
    npm run dev
    ```

    The web app will be available at `http://localhost:5173`.

4.  **Run the Mobile App:**
    ```bash
    cd nadoumi
    flutter run
    ```

---

## ✨ Key Features

- **Authentication & Authorization**: Secure user registration and login with Role-Based Access Control (RBAC).
- **Product Management**: Comprehensive catalog with categories, search, and filtering.
- **Shopping Cart & Checkout**: Seamless purchasing flow with order management.
- **Admin Dashboard**: Powerful tools for managing products, orders, and users.
- **User Dashboard**: Personalized area for order history, profile settings, and wishlists.
- **Real-time Notifications**: Powered by Redis/BullMQ and Kafka for event-driven updates.
- **Scalable Architecture**: Microservices-ready design deployed on Kubernetes.

---

## 🚢 CI/CD & Deployment

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment.

- **Build & Test**: Automated workflows run on every push to ensure code quality.
- **Deployment**: Validated builds are deployed to **Alibaba Cloud Kubernetes Service (ACK)**.

---

## 🤝 Contributing

Contributions are welcome! Please follow the standard pull request process.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**NadoumiShop** © 2026. All Rights Reserved.
