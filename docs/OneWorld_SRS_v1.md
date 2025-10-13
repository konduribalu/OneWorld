# OneWorld - Requirements Specification (SRS v1.0)

## 1. Project Overview

**OneWorld** is a cloud-native social media platform connecting people, ideas, and communities globally. It integrates **AI-generated content, analytics, microservices architecture, micro frontends, and scalable cloud deployment** for a modern, interactive social experience.

## 2. High-Level Architecture

* **Frontend:** Angular shell + React/Angular micro frontends
* **Backend:** Spring Boot, Node.js/Express
* **AI Layer:** Python/Node.js microservices for content generation and moderation
* **Databases:** PostgreSQL, MongoDB, Redis
* **Messaging/Event Streaming:** Kafka
* **Cloud & Deployment:** AWS EKS, Kubernetes, Helm, Istio, Sidecar logging, HPA, Cluster Autoscaler

## 3. Functional Requirements (User-Centric)

### 3.1 User Management

- Users can easily sign up and create their profiles.
- Users can securely log in and reset their password if needed.
- Users can view and update their profile information.
- Users can follow or unfollow other users to curate their network.
- Users see a variety of demo users and categories to help discover new connections.

### 3.2 Posting & Sharing

- Users can create and share posts in categories like Movies, Tech, Science, Jobs, Politics, Lifestyle, Health, and Art.
- Users can like or unlike posts to show appreciation or interest.
- Users can view trending and recommended posts tailored to their interests.
- Users are protected from unsafe or abusive content through automatic moderation.

### 3.3 Commenting & Discussion

- Users can add, edit, and delete comments on posts.
- Users can reply to comments, creating threaded discussions.
- Users are protected from spam through fair usage limits.

### 3.4 Messaging & Chat

- Users can chat in real time, both one-on-one and in groups.
- Users can see when someone is typing and when their messages are delivered or read.
- Users can continue conversations seamlessly, even if briefly offline.

### 3.5 Personalized Feed

- Users have a personalized feed that shows posts from people they follow and recommended content.
- The feed is organized by engagement, freshness, and relevance to the user.
- Users enjoy a smooth browsing experience with quick updates.

### 3.6 Search & Discovery

- Users can search for posts, other users, and hashtags using keywords.
- Users receive smart suggestions and autocomplete as they type.
- Users can discover relevant content using advanced search capabilities.

### 3.7 Media Uploads

- Users can upload photos and videos to their posts.
- Users see optimized previews and thumbnails of their media.
- Users’ media is safely stored and managed.

### 3.8 AI-Powered Content & Moderation

- Users see diverse and relevant content generated and moderated by AI, ensuring a safe and enjoyable experience.
- Users benefit from scheduled posts and content moderation that prevents spam and abuse.

### 3.9 Analytics & Insights

- Users can view statistics about their activity, such as likes, comments, shares, and followers.
- Users can explore trends, top creators, and engagement metrics through easy-to-understand dashboards.

## 4. Non-Functional Requirements

* **Scalability:** Auto-scaling pods and cluster nodes
* **Availability:** 99.9% uptime, multi-AZ deployment
* **Resilience:** Rolling deployments, circuit breakers, self-healing pods
* **Performance:** API latency <200ms under 10k concurrent users
* **Security:** OAuth2, JWT, RBAC, TLS, safe AI content
* **Observability:** Metrics, logs, distributed tracing (Prometheus, Grafana, Jaeger)
* **Maintainability:** Modular microservices, reusable AI & analytics modules
* **Data Consistency:** Eventual consistency via Kafka
* **Extensibility:** Modular architecture to easily add new features

## 5. Deployment & Infrastructure

* AWS EKS cluster with dev/staging/prod namespaces
* Helm charts for each service
* Secrets in AWS Secrets Manager
* Istio ingress gateway
* Sidecar logging with Fluent Bit
* HPA and Cluster Autoscaler for dynamic scaling
* Persistent volumes for databases and cache as required

## 6. Load Testing & Autoscaling

* AI-generated users/posts simulate real traffic
* Test scenarios:

  * Feed retrieval with 10k concurrent users
  * 500 concurrent post creations
  * Rapid-fire commenting
  * Sustained WebSocket chat
  * Login flood scenarios
* Visualize autoscaling behavior and pod lifecycle using Grafana
* k6 or JMeter for load testing

## 7. State Management

| Context            | Approach                         |
| ------------------ | -------------------------------- |
| User sessions      | Redis cluster                    |
| Uploads            | AWS S3                           |
| Event queues       | Kafka                            |
| Cache              | Redis                            |
| DB connections     | HikariCP (Java), pg-pool (Node)  |
| WebSocket messages | Sticky sessions + Kafka fallback |

## 8. Security Requirements

* OAuth2 for third-party login
* JWT for API authentication
* Role-based access control (RBAC)
* TLS for external communication
* Secrets stored in AWS Secrets Manager
* AI content moderation
* Network policies for namespace isolation

## 9. CI/CD & DevOps

* GitHub Actions for build, test, deploy pipelines
* Build Docker images for all services
* Unit and integration tests
* Deploy to staging namespace in EKS
* Run load testing with AI-generated traffic
* Promote to main branch after verification

## 10. Phase Plan

| Phase   | Objective                                          |
| ------- | -------------------------------------------------- |
| Phase 1 | AWS EKS setup, CI/CD, Helm charts                  |
| Phase 2 | Auth + Comment services                            |
| Phase 3 | Post + Feed services + Kafka integration           |
| Phase 4 | Micro Frontend shell + MFEs integration            |
| Phase 5 | AI-generated users/posts + moderation service      |
| Phase 6 | Analytics layer, dashboards, insights              |
| Phase 7 | Load testing and scaling visualization             |
| Phase 8 | Security hardening, canary deployments, monitoring |

## 11. Folder Structure Overview

```
frontend/         # Micro frontends (Angular shell + React/Angular MFEs)
backend/          # Microservices (Auth, Post, Comment, Messaging, Feed, Media, AI)
analytics/        # Event collection, dashboards, AI insights
infrastructure/   # Kubernetes manifests, Helm charts, EKS setup
scripts/          # AI user/post generation scripts
load-testing/     # k6/JMeter scripts and reports
docs/             # SRS and project documentation
```

## 12. References

* README.md
* Infrastructure docs
* CI/CD workflows
* AI scripts for content generation

