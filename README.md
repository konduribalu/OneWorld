# OneWorld – Global Social Media Platform

**OneWorld** is a cloud-native social media platform connecting people, ideas, and communities worldwide. It features **microservices, micro frontends, AI-generated users/posts, analytics**, and **scalable AWS EKS deployment**. Safe, interactive, and data-driven, OneWorld is built for modern social networking.

---

## Key Features

* **AI-Powered Content & Users**: Realistic demo users and multi-category posts (Movies, Tech, Science, Jobs, Politics, Lifestyle, Health, Art)
* **Microservices Architecture**: Auth, Post, Comment, Messaging, Feed, Media, AI services
* **Micro Frontends**: Angular shell with React and Angular MFEs for modular UI
* **Analytics & Insights**: Engagement metrics, trending content, AI-driven predictions
* **Cloud-Native & Scalable**: AWS EKS, Kubernetes, Helm, Istio, auto-scaling, load-tested
* **Observability & Monitoring**: Prometheus, Grafana, Jaeger, sidecar logging
* **Security**: OAuth2/JWT, RBAC, TLS, safe AI content moderation

---

## Tech Stack

* **Frontend:** Angular, React
* **Backend:** Spring Boot, Express.js
* **AI/ML:** Python / Node.js microservices
* **Database:** PostgreSQL, MongoDB, Redis
* **Messaging/Event Streaming:** Kafka
* **Cloud & DevOps:** AWS EKS, Docker, Helm, Istio, GitHub Actions
* **Monitoring:** Prometheus, Grafana, Jaeger

---

## Getting Started

```bash
git clone https://github.com/yourusername/OneWorld.git
```

1. Check requirements & architecture: `docs/OneWorld_SRS_v1.md`
2. Set up infrastructure: `infrastructure/` folder
3. Use feature branches for development referencing SRS

---

## Project Vision

OneWorld is a **global hub for knowledge, ideas, and safe social interaction**. Its modular, cloud-native architecture and AI-powered features create a **reusable foundation** for future content-driven projects.

---

## Folder Structure

```
frontend/         # Micro frontends (Angular shell + React/Angular MFEs)
backend/          # Microservices (Auth, Post, Comment, Messaging, Feed, Media, AI)
analytics/        # Event collection, dashboards, AI insights
infrastructure/   # Kubernetes manifests, Helm charts, EKS setup
scripts/          # AI user/post generation scripts
load-testing/     # k6/JMeter scripts and reports
docs/             # SRS and project documentation
```

---

## Documentation

* [Detailed Requirements (SRS)](docs/OneWorld_SRS_v1.md)

---

## Badges (Optional)

* Build: ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
* Coverage: ![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
* License: ![License](https://img.shields.io/badge/license-MIT-blue)
