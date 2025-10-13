# OneWorld - Requirements Specification (SRS v1.0)

## 1. Project Overview

**OneWorld** is a cloud-native social media platform connecting people, ideas, and communities globally. It integrates **AI-generated content, analytics, microservices architecture, micro frontends, and scalable cloud deployment** for a modern, interactive social experience.

## 2. High-Level Architecture

* **Frontend:** Angular shell + React/Angular/View micro frontends
* **Backend:** Spring Boot, Node.js/Express
* **AI Layer:** Python/Node.js microservices for content generation and moderation
* **Databases:** PostgreSQL, MongoDB, Redis
* **Messaging/Event Streaming:** Kafka
* **Cloud & Deployment:** AWS EKS, Kubernetes, Helm, Istio, Sidecar logging, HPA, Cluster Autoscaler

## 3. Functional Requirements

### 3.1 User Management

* Registration & login (JWT + OAuth2)
* Profile management
* Follow/unfollow functionality
* AI-generated demo users (100) with categories and dummy email accounts
* Password reset via email

### 3.2 Post Service

* Multi-category posts: Movies, Tech, Science, Jobs, Politics (non-controversial), Lifestyle, Health, Art
* Like/unlike posts
* Trending & recommended posts API
* AI moderation to ensure safe content

### 3.3 Comment Service

* Add, edit, delete comments
* Nested comment threading
* Rate limiting to prevent spam

### 3.4 Messaging Service

* Real-time 1:1 and group chat using WebSockets
* Persist messages in MongoDB
* Typing indicators & message receipts
* Offline message queue via Kafka

### 3.5 Feed Service

* Aggregated feed from followed users (AI + real)
* Ranked by engagement, recency, AI personalization
* Cached using Redis for performance

### 3.6 Search Service

* Search posts, users, and hashtags
* Semantic search with embeddings/vector database
* Autocomplete & suggestions

### 3.7 Media Service

* Upload, compression, thumbnail generation
* Store media in AWS S3
* Metadata in PostgreSQL

### 3.8 AI Generation Service

* Generate safe AI users and posts
* Diverse content per category
* Timestamped post scheduling
* Content moderation to prevent spam, abusive, or adult content

### 3.9 Analytics Service

* Track engagement metrics: likes, comments, shares, follows
* Post reach, trending content, DAU/MAU metrics
* Retention and churn rates
* AI-driven insights for trending content, top creators
* Visual dashboards using Grafana/Superset

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

