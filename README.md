
# SurakshaPay – AI Income Shield for Gig Workers

## Tagline

A fully automated parametric insurance platform that protects gig workers’ income in real time — without requiring any manual claims.

---

## Overview

SurakshaPay is an AI-powered parametric insurance system designed to safeguard gig delivery workers from income loss caused by uncontrollable external disruptions such as weather conditions, pollution, and local restrictions.

Unlike traditional insurance models, SurakshaPay eliminates the need for claim filing. The system continuously monitors real-world conditions and automatically triggers payouts when predefined thresholds are met.

The platform is built specifically for gig workers who rely on daily earnings and need instant financial protection.

---

## Problem Statement

Gig delivery workers face unpredictable income instability due to:

* Heavy rainfall and floods
* Extreme heat conditions
* High pollution levels
* Curfews, strikes, and local disruptions

These factors can reduce working hours and lead to 20–30% weekly income loss.

Existing insurance systems do not cover such income disruptions and rely heavily on manual claim processes, making them ineffective for gig workers.

---

## Solution

SurakshaPay introduces a real-time parametric insurance model that:

* Continuously monitors environmental and operational conditions
* Uses AI-driven risk scoring to assess disruption probability
* Dynamically calculates weekly insurance premiums
* Automatically triggers claims based on predefined parameters
* Processes instant payout simulations

This ensures seamless income protection without user intervention.

---

## Target Users

* Swiggy, Zomato delivery partners
* Amazon and Zepto delivery workers
* Gig economy workers dependent on daily income

---

## Persona-Based Scenario

Ravi, a 24-year-old Swiggy delivery partner in Raipur, depends entirely on daily deliveries for his income.

During heavy rainfall:

* Delivery demand drops significantly
* His working hours are reduced
* His weekly income decreases

With SurakshaPay:

* Ravi subscribes to a weekly policy
* The system continuously monitors weather conditions
* Heavy rainfall and delivery drop are detected
* A claim is automatically triggered
* Ravi receives a payout instantly

No manual claim process is required.

---

## System Workflow

1. User registers and selects delivery platform
2. Location is captured via Geolocation API
3. Risk score is calculated using environmental data
4. Weekly premium is generated
5. System continuously monitors disruptions
6. Parametric trigger conditions are evaluated
7. Claim is automatically triggered
8. Payout is processed instantly

---

## Weekly Premium Model

Premium is calculated dynamically using:

Premium = Base Price × Risk Factor

Where Risk Factor is derived from:

* Weather severity
* AQI levels
* Temperature extremes
* Historical disruption frequency

This ensures fair, location-based pricing.

---

## Parametric Triggers

Claims are triggered automatically when:

* Rainfall exceeds a defined threshold
* AQI crosses unsafe limits
* Temperature exceeds extreme levels
* Delivery activity drops below a predefined percentage

These triggers eliminate the need for manual claims.

---

## AI/ML Integration Strategy

The platform uses a lightweight AI-inspired model:

* Risk Prediction:
  Risk = a function that combines weather conditions, AQI levels, temperature, and location to produce a risk score

* Premium Calculation:
  Dynamic adjustment based on risk score

* Fraud Detection:

  * GPS consistency validation
  * Duplicate claim detection
  * Behavioral anomaly detection

The focus is on real-time decision-making rather than heavy model training.

---

## Platform Justification

A web-based platform is selected because:

* It is accessible across devices without installation
* Enables rapid deployment and iteration
* Reduces development overhead during hackathon
* Can later be extended into mobile applications

---

## Tech Stack

**Frontend**

* Next.js
* Tailwind CSS
* ShadCN UI
* Recharts
* Leaflet / Mapbox

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Mongoose)

**APIs**

* OpenWeather API
* AQI API
* Geolocation API

**Payments**

* Razorpay (test mode)

**Deployment**

* Vercel (Frontend)
* Render / Railway (Backend)
* MongoDB Atlas (Database)

---

## System Architecture (High-Level)

Frontend (Next.js) → Backend (Node.js) → External APIs (Weather, AQI) → Database (MongoDB)

The backend processes environmental data, calculates risk, and triggers claims automatically.

---

## Implementation Strategy

### Phase 1: Foundation

* System design and architecture
* README and planning
* Risk and premium model definition

### Phase 2: Core System

* User onboarding
* Policy management
* Dynamic premium engine
* Claim automation system
* API integration for real-time data

### Phase 3: Advanced Features

* Fraud detection system
* Instant payout simulation
* Worker and admin dashboards
* Performance optimization

---

## Adversarial Defense & Anti-Spoofing Strategy

To address advanced fraud scenarios such as GPS spoofing and coordinated attacks, SurakshaPay incorporates a multi-layered defense system that goes beyond basic location verification.

### 1. Differentiation Strategy

The system does not rely solely on GPS data. Instead, it uses **multi-signal validation** to differentiate between genuine users and spoofed behavior.

Key approach:

* Cross-verification of environmental data (weather, AQI) with user activity
* Behavioral consistency checks over time
* Detection of synchronized patterns across multiple users

This ensures that even if GPS is spoofed, inconsistencies in other signals can expose fraudulent activity.

---

### 2. Data Signals Used for Fraud Detection

Beyond GPS coordinates, the system analyzes:

* **Delivery Activity Patterns**

  * Number of deliveries completed
  * Sudden drop in activity vs historical trends

* **Device and Session Data**

  * Device ID consistency
  * Session frequency and anomalies

* **Network Signals**

  * IP address clustering
  * Multiple users operating from identical network patterns

* **Temporal Patterns**

  * Simultaneous claims from multiple users
  * Repeated triggering at identical timestamps

* **Environmental Correlation**

  * Matching user location with real weather API data
  * Verifying if disruption actually exists in that region

These combined signals help detect coordinated fraud rings.

---

### 3. Coordinated Fraud Detection

The system identifies large-scale attacks by:

* Detecting clusters of users triggering claims simultaneously
* Identifying identical behavior patterns across multiple accounts
* Flagging abnormal spikes in claims within a short time window

This prevents mass payout exploitation.

---

### 4. Risk-Based Claim Validation

Each claim is assigned a **Fraud Risk Score**:

* Low Risk → Auto-approved
* Medium Risk → Delayed verification
* High Risk → Flagged for review / blocked

This ensures system security without slowing down genuine users.

---

### 5. UX Balance (Fairness to Honest Users)

To ensure genuine users are not penalized:

* Claims are not immediately rejected — they are **risk-scored first**
* Users in genuine low-connectivity or network-drop scenarios are allowed **grace tolerance**
* Only highly suspicious patterns trigger strict actions

This maintains a balance between fraud prevention and user experience.

---

### 6. System Resilience

The platform is designed to:

* Prevent mass fraudulent payouts
* Maintain liquidity stability
* Adapt to evolving fraud patterns

This ensures long-term reliability of the insurance system.

---

---

## Worker-Level Acceptance Criteria

We don’t just detect fraud at claim time — we continuously evaluate worker behavior throughout the policy lifecycle.

To ensure fairness, prevent fraud, and maintain system integrity, the following conditions must be satisfied for a worker to be eligible for policy coverage and payouts:

### 1. Valid Location Verification

* The worker’s location must match real-world environmental data (weather, AQI)
* Sudden unrealistic location changes are flagged
* Continuous location consistency is required during active policy period

---

### 2. Activity-Based Validation

* The worker must show **normal delivery activity patterns**
* Claims cannot be triggered if:

  * No recent delivery activity is recorded
  * Activity drops without corresponding environmental disruption

---

### 3. Policy Authenticity

* A valid, active weekly policy must exist before disruption occurs
* Policies created **after disruption begins** are not eligible for claims

---

### 4. One Claim per Event Rule

* A worker can only receive **one payout per disruption event**
* Multiple claims for the same event are automatically rejected

---

### 5. Device and Session Integrity

* Claims must originate from a consistent device/session
* Frequent device switching or suspicious login patterns are flagged

---

### 6. Network and Behavior Consistency

* Users operating from identical IP clusters with synchronized activity are flagged
* Abnormal patterns such as multiple users triggering claims simultaneously are monitored

---

### 7. Environmental Correlation Requirement

* A claim is valid only if:

  * Verified disruption exists in the worker’s area
  * External API data confirms the event

---

### 8. Fraud Risk Threshold

* Each worker is assigned a fraud risk score:

  * Low Risk → Claim approved
  * Medium Risk → Delayed verification
  * High Risk → Claim blocked or flagged

---

### 9. Grace Handling for Genuine Users

* Temporary network drops or GPS inaccuracies are tolerated within limits
* Genuine users are not penalized unless repeated suspicious patterns are detected

---

### 10. Continuous Monitoring

* Worker behavior is monitored throughout the policy period
* Repeated suspicious actions may result in:

  * Policy suspension
  * Claim rejection
  * Account flagging

---


---

## Unique Value Proposition

* Fully automated parametric insurance model
* Zero manual claim process
* Real-time risk-based pricing
* Instant payout simulation
* Designed specifically for gig economy workers

---

## Limitations

* Uses simulated payout system
* Relies on third-party APIs for environmental data
* Rule-based AI instead of trained ML model

---

## Future Scope

* Integration of advanced ML models
* Real payment gateway implementation
* Multilingual support
* Voice-based interface
* Offline capabilities

---

## Conclusion

SurakshaPay redefines insurance for gig workers by making it proactive, automated, and data-driven.

It ensures income protection at the moment disruption occurs, without requiring any manual action.

---


