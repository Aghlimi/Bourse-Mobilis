
**Technical Test (3 days)** 

**Front-end + Back-end + Business Logic + Communication + Emailing** 

---

### **1. Test Objective**

Build a "mini but complete" version of **"Bourse Mobilis"**: a platform where moving missions are proposed, discussed, and assigned, featuring a validation workflow and transactional emails.

### **2. Context**

The platform is used by an internal team (Mobilis operators) and professional movers:

* Movers can create missions, but their publication must be validated by the Mobilis team.


* Movers respond to published missions with proposals (price + message).


* A messaging system allows exchanges before accepting or refusing a proposal.


* Emails are sent at key moments (publication, proposal, validation, messages...).



### **3. Profiles and Permissions**

Two roles are sufficient for this test:

* 
**Operator** (Mobilis team).


* 
**Mover**.



**Permissions Matrix (Minimum Expected):** 

| Action | Operator | Mover |
| --- | --- | --- |
| Create a mission | Yes | Yes |
| Submit mission for validation | Optional | Yes |
| Validate / reject a mission | Yes | No |
| Publish a mission | Yes | No |
| View published missions | Yes | Yes |
| View all missions | Yes | No (only their own + published) |
| Send a proposal | No | Yes |
| Accept/refuse a proposal | Yes | No |
| Messaging on a mission | Yes | Yes (on missions they proposed to) |

---

### **4. Statuses and Business Rules**

**4.1 Mission Statuses (Recommended)** 

`DRAFT` | `PENDING_VALIDATION` | `PUBLISHED` | `REJECTED` | `ASSIGNED` | `CLOSED` 

**4.2 Proposal Statuses** 

`PENDING` | `ACCEPTED` | `REFUSED` 

**4.3 Rules (Mandatory)** 

* A mover can only submit one proposal per mission (editing while `PENDING` is a bonus).


* If a proposal is `ACCEPTED`: the mission status becomes `ASSIGNED`, and all other proposals become `REFUSED`.


* A mission created by a mover is only publicly visible after validation by an operator.


* In case of a `REJECTED` status, a rejection reason (text) is recommended.



---

### **5. Expected Functionalities**

**5.1 Auth & Security** 

* Registration/Login (JWT or sessions).


* Simple RBAC: OPERATOR vs. MOVER.


* Backend validation (zod, class-validator, joi, etc.).



**5.2 Missions** 

* 
**Operator:** Create (draft), publish, list/filter/search, and validate/reject submitted missions.


* 
**Mover:** Create a mission, submit for validation, view their own missions + status, and view published missions.


* 
**Minimum Mission Fields:** ID, title, departure/arrival city, desired date/window, estimated volume, notes, status, and timestamps.



**5.3 Proposals (Price Offers)** 

* 
**Mover:** Create a proposal (price + comment) on a published mission.


* 
**Operator:** Consult proposals and accept or refuse them.



**5.4 Messaging (Communication)** 

* One conversation thread per mission.


* Visibility: Operator + concerned mover (the one who proposed).


* Text messages (attachments are a bonus).


* Chat-type UI with a mini timeline of events (publication, proposal, validation, acceptance...).



**5.5 Transactional Emailing** 

* Dev mode accepted: Mailhog/SMTP test/console logger.


* 
**Minimum Emails:** Mission submitted for validation, mission published, mission rejected (+ reason), new proposal received, and proposal accepted/refused.



---

### 6. 

Expected Frontend (Pages) 

* Login / Register.


* Mission Dashboard (Operator: all missions + filters).


* Mission Dashboard (Mover: published missions + "my missions").


* Mission Creation (Operator + Mover).


* "To Validate" Page (Operator): `PENDING_VALIDATION` missions.


* Mission Details: Info + status + proposals + messaging.


* 
**UI/UX:** Simple, clean, and responsive (Tailwind advised).



---

### 7. 

Recommended Planning 

* 
**Day 1: Solid Foundation:** Project setup, DB/migrations/seed, Auth/Roles, Mission listing/creation/validation status.


* 
**Day 2: Proposals & Business Logic:** Create/list proposals, accept/refuse rules, mission detail UI + actions.


* 
**Day 3: Messaging, Emails & Finishing:** Mission thread messaging, transactional emails (at least 3 scenarios), minimum tests, and full README.



---

### 8. 

Deliverables 

* Git Repo: `/frontend` and `/backend` folders.


* README: Installation, env variables, launch instructions (Docker Compose preferred).


* Demo accounts (1 operator + 1 mover).


* Migrations + seed data.


* Postman/Insomnia collection.



### 9. 

Evaluation Criteria 

| Criterion | Weight | Focus Areas |
| --- | --- | --- |
| **Architecture & Code Cleanliness** | 30% | Structure, readability, patterns, consistency, error handling |
| **Correct Business Logic** | 25% | Statuses, permissions, acceptance/refusal rules, validation |
| **Security & Validations** | 15% | RBAC, access control, input validation, clean errors |
| **Frontend UX & State** | 15% | Smooth flow, loading/error states, responsive design |
| **Emails & Asynchrony** | 10% | Correct triggers, queues (if needed), dev mocks |
| **Docs & Deliverable Quality** | 5% | Clear README, fast setup, demo data |

---

### 10. 

Bonus (If you have time) 

* In-app notifications.


* Chat attachments.


* Pagination, sorting, and advanced search.


* WebSockets for real-time updates.


* Clean email templates and i18n.



**Note:** The tech stack is free. Priority is given to quality, business logic, and a usable result.
