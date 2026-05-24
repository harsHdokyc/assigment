# Breathe ESG — Emissions Data Ingestion & Review Platform
## Product Requirements Document (PRD)

---

# 1. Overview

## Objective

Build a prototype enterprise-grade ESG data ingestion and review platform using:

- Django + Django REST Framework
- React + TypeScript
- PostgreSQL

The platform must ingest emissions-related data from multiple enterprise systems, normalize inconsistent formats into a standardized structure, surface validation issues, and provide an analyst review workflow before records are locked for audit purposes.

The core challenge is not carbon calculation.

The core challenge is:
- heterogeneous enterprise data ingestion
- normalization
- auditability
- source traceability
- analyst review workflows

---

# 2. Problem Statement

Enterprise sustainability data exists across disconnected systems:

| Source | Example |
|---|---|
| SAP | Fuel + procurement exports |
| Utility Providers | Electricity portal exports |
| Travel Platforms | Flight, hotel, ground transport |

Each source contains:
- inconsistent schemas
- different units
- missing fields
- invalid formats
- business-specific mappings
- non-standard naming conventions

The platform must:
1. ingest these datasets
2. preserve raw source truth
3. normalize into a common structure
4. validate and flag anomalies
5. allow analysts to review/edit/approve
6. lock approved records for audit compliance

---

# 3. Product Goals

## Primary Goals

### 1. Multi-source ingestion
Support ingestion from:
- SAP fuel/procurement exports
- Utility electricity exports
- Corporate travel exports

---

### 2. Data normalization
Convert inconsistent incoming formats into a canonical emissions structure.

Examples:
- gallons → liters
- MWh → kWh
- German headers → English canonical fields
- airport codes → estimated flight distances

---

### 3. Validation & anomaly detection
Automatically identify:
- invalid values
- missing units
- suspicious spikes
- malformed records
- impossible travel distances

---

### 4. Analyst review workflow
Allow analysts to:
- review records
- inspect raw source values
- edit normalized fields
- approve/reject rows
- audit all modifications

---

### 5. Audit readiness
Ensure:
- immutable raw records
- source traceability
- approval tracking
- audit locks
- change history

---

# 4. Non-Goals

The following are intentionally out of scope:

| Feature | Reason |
|---|---|
| Full ESG reporting suite | Too large for prototype |
| Real-time SAP integration | Enterprise auth complexity |
| OCR bill parsing | High complexity for 4-day scope |
| Advanced emissions engine | Not core assignment |
| Enterprise SSO/OAuth | Scope limitation |
| Complex RBAC system | Minimal permissions sufficient |
| Async distributed processing | Future enhancement |
| ML anomaly detection | Rule-based validation sufficient |

---

# 5. Selected Source Strategies

---

# SOURCE 1 — SAP Fuel & Procurement

## Selected Format
CSV Flat File Export

## Why
- realistic for enterprise exports
- easier to prototype
- commonly used operationally
- avoids SAP auth complexity

---

## Realistic SAP Characteristics

The parser should account for:

### Inconsistent headers
Examples:
- Menge
- Einheit
- Werk
- Buchungsdatum

### Plant codes
Examples:
- PLT100
- DE_FAC_01

### Unit inconsistency
Examples:
- liters
- gallons
- kg
- tonnes

### Date inconsistency
Examples:
- DD.MM.YYYY
- YYYY-MM-DD
- MM/DD/YYYY

---

## Example Canonical SAP Fields

| Raw | Canonical |
|---|---|
| Material | fuel_type |
| Menge | quantity |
| Einheit | unit |
| Werk | facility_code |
| Datum | activity_date |

---

# SOURCE 2 — Utility Electricity

## Selected Format
CSV Portal Export

## Why
- realistic facilities workflow
- avoids OCR complexity
- common utility export mechanism
- structured ingestion

---

## Realistic Utility Challenges

### Billing periods
Not aligned to calendar months.

### Unit inconsistency
Examples:
- kWh
- MWh

### Tariff structures
Peak/off-peak may exist.

### Meter identifiers
Need facility mapping.

---

## Example Utility Fields

| Field |
|---|
| meter_id |
| billing_start |
| billing_end |
| consumption |
| unit |
| tariff |
| total_cost |

---

# SOURCE 3 — Corporate Travel

## Selected Format
Concur/Navan-style CSV Export

---

## Realistic Travel Challenges

### Missing distances
Only airport codes available.

### Mixed transport categories
Examples:
- flights
- hotels
- taxi
- rail

### Incomplete data
Missing class, distance, or vendor.

---

## Example Travel Fields

| Field |
|---|
| employee_id |
| trip_type |
| origin_airport |
| destination_airport |
| hotel_nights |
| transport_mode |

---

# 6. High-Level System Architecture

```txt
Client Upload/API Input
        ↓
Ingestion Layer
        ↓
Raw Data Storage
        ↓
Normalization Engine
        ↓
Validation Engine
        ↓
Analyst Review Queue
        ↓
Approval + Audit Lock
```

---

# 7. Core Functional Requirements

---

# 7.1 Multi-Tenant Support

The platform must support multiple organizations.

Each record must belong to:
- organization
- datasource
- uploader

No cross-tenant visibility.

---

# 7.2 Data Ingestion

The system must support:
- CSV uploads
- source-type selection
- ingestion tracking

---

## Upload Workflow

### User Flow
1. Analyst selects source type
2. Uploads CSV
3. System parses file
4. Rows processed
5. Validation performed
6. Records categorized:
   - success
   - failed
   - flagged

---

# 7.3 Raw Data Preservation

The platform must preserve:
- original uploaded values
- original headers
- original row structure

Raw data must never be overwritten.

Purpose:
- audit traceability
- reprocessing capability
- debugging normalization logic

---

# 7.4 Normalization Engine

The normalization engine converts heterogeneous source data into a unified schema.

---

## Normalization Requirements

### Unit Conversion
Examples:
- gallons → liters
- MWh → kWh

### Header Mapping
Examples:
- Menge → quantity
- Einheit → unit

### Date Standardization
All dates normalized to ISO format.

### Scope Categorization

| Type | Scope |
|---|---|
| Fuel combustion | Scope 1 |
| Purchased electricity | Scope 2 |
| Business travel | Scope 3 |

---

# 7.5 Validation Engine

The platform must detect invalid or suspicious records.

---

## Validation Rules

### Hard Failures
Record cannot proceed.

Examples:
- missing required field
- invalid date
- unsupported unit
- negative consumption

---

### Soft Flags
Record review required.

Examples:
- unusually high electricity usage
- impossible travel distance
- unknown plant code
- missing emission factor

---

## Record Statuses

| Status | Meaning |
|---|---|
| PENDING | Awaiting review |
| FLAGGED | Suspicious data |
| FAILED | Invalid ingestion |
| APPROVED | Analyst approved |
| REJECTED | Analyst rejected |

---

# 7.6 Analyst Review Dashboard

Analysts must be able to:
- inspect imported rows
- review normalization
- inspect validation issues
- edit normalized values
- approve/reject records

---

## Dashboard Sections

### 1. Upload Summary
Shows:
- source
- upload date
- rows processed
- failed count
- flagged count

---

### 2. Review Queue
Filterable by:
- status
- source
- organization
- scope

---

### 3. Record Detail Panel

Must display:
- raw source row
- normalized data
- validation issues
- edit history
- approval actions

---

# 7.7 Audit Trail

Every analyst modification must be tracked.

---

## Audit Log Requirements

Track:
- who changed field
- previous value
- new value
- timestamp

---

# 7.8 Audit Locking

Approved records become immutable.

Once locked:
- no further edits allowed
- approval metadata stored
- record considered audit-ready

---

# 8. Database Design

---

# Organization

```txt
Organization
- id
- name
- created_at
```

---

# DataSource

```txt
DataSource
- id
- organization_id
- source_type
- ingestion_method
- filename
- uploaded_by
- uploaded_at
- processing_status
```

---

# RawRecord

```txt
RawRecord
- id
- datasource_id
- row_number
- raw_payload (JSONB)
- processing_status
- error_message
- created_at
```

---

# NormalizedEmissionRecord

```txt
NormalizedEmissionRecord
- id
- organization_id
- raw_record_id

- category
- scope

- activity_date

- activity_value
- activity_unit

- normalized_value
- normalized_unit

- emission_factor
- calculated_emissions

- facility
- vendor
- employee

- status

- reviewed_by
- reviewed_at

- locked_for_audit

- created_at
```

---

# AuditLog

```txt
AuditLog
- id
- record_id
- field_name
- old_value
- new_value
- changed_by
- changed_at
```

---

# 9. API Requirements

---

# Upload APIs

## POST /api/uploads/

Upload dataset.

Payload:
- file
- source_type
- organization_id

---

# Record APIs

## GET /api/records/

Supports:
- filtering
- pagination
- status filters

---

## GET /api/records/:id/

Detailed record view.

---

## PATCH /api/records/:id/

Edit normalized values.

---

## POST /api/records/:id/approve/

Approve + lock record.

---

## POST /api/records/:id/reject/

Reject record.

---

# Audit APIs

## GET /api/audit/:record_id/

Returns audit history.

---

# 10. Frontend Requirements

---

# Frontend Stack

- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- TanStack Table
- Axios
- Zustand
- React Hook Form
- Zod

---

# Core Pages

---

## 1. Upload Page

Features:
- source selector
- CSV upload
- upload progress
- ingestion summary

---

## 2. Dashboard

Features:
- upload summaries
- stats cards
- review queue
- filters

---

## 3. Record Detail Page

Features:
- raw vs normalized comparison
- validation warnings
- edit capability
- approve/reject actions
- audit history

---

# 11. Suggested UI Structure

```txt
Sidebar
 ├── Dashboard
 ├── Upload Data
 ├── Review Queue
 ├── Audit Logs
```

---

# 12. Sample Validation Scenarios

---

## SAP

| Scenario | Action |
|---|---|
| Unknown unit | FAIL |
| German header detected | MAP |
| Invalid plant code | FLAG |

---

## Utility

| Scenario | Action |
|---|---|
| Negative kWh | FAIL |
| Extremely high usage | FLAG |

---

## Travel

| Scenario | Action |
|---|---|
| Missing airport code | FAIL |
| Unrealistic distance | FLAG |

---

# 13. Security Considerations

Minimal prototype security:
- authenticated users only
- organization isolation
- file upload validation
- JWT authentication

---

# 14. Performance Expectations

Prototype-scale expectations:
- process CSV files up to ~5,000 rows
- paginated tables
- indexed database queries

---

# 15. Deployment Requirements

Deployment is mandatory.

---

## Recommended Deployment

### Frontend
Vercel

### Backend
Railway

### Database
PostgreSQL (Railway or Neon)

---

# 16. Required Documentation

---

# MODEL.md

Must explain:
- layered ingestion architecture
- normalization strategy
- auditability
- multi-tenancy
- source traceability

---

# DECISIONS.md

Must explain:
- source format choices
- assumptions
- ambiguities resolved
- PM questions

---

# TRADEOFFS.md

Must explain:
- features intentionally omitted
- why they were skipped

---

# SOURCES.md

Must explain:
- real-world research performed
- SAP export references
- utility export structure
- travel export structure
- fabricated sample data reasoning

---

# 17. Recommended Folder Structure

```txt
backend/
 ├── apps/
 │    ├── organizations/
 │    ├── ingestion/
 │    ├── normalization/
 │    ├── validation/
 │    ├── records/
 │    └── audit/
 │
 ├── config/
 └── manage.py

frontend/
 ├── src/
 │    ├── components/
 │    ├── pages/
 │    ├── services/
 │    ├── hooks/
 │    ├── store/
 │    ├── tables/
 │    ├── types/
 │    └── utils/
```

---

# 18. Recommended Development Timeline

---

# Day 1
- research
- architecture
- database schema
- Django setup
- React setup

---

# Day 2
- ingestion engine
- CSV parsing
- normalization pipeline
- validation engine

---

# Day 3
- dashboard
- review workflows
- audit logs
- approval system

---

# Day 4
- polish
- deployment
- testing
- documentation

---

# 19. Technology Stack

---

# Frontend Technologies

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| Vite | Fast development/build tooling |
| TypeScript | Type safety and maintainability |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible dashboard UI components |
| TanStack Table | Enterprise-style data tables |
| Axios | API communication |
| Zustand | Lightweight global state management |
| React Hook Form | Form handling |
| Zod | Form/schema validation |

---

# Backend Technologies

| Technology | Purpose |
|---|---|
| Django | Backend framework |
| Django REST Framework | REST API development |
| PostgreSQL | Relational database |
| JSONB | Raw payload storage |
| Pandas | CSV parsing and normalization |
| SimpleJWT | Authentication |

---

# Infrastructure & Deployment

| Technology | Purpose |
|---|---|
| Railway | Backend deployment |
| Vercel | Frontend deployment |
| PostgreSQL Hosting | Persistent relational storage |

---

# Architectural Reasoning

The stack prioritizes:
- rapid prototyping
- enterprise-grade data modeling
- maintainability
- strong developer experience
- realistic production architecture

The system intentionally avoids:
- microservices
- GraphQL
- distributed systems
- OCR pipelines
- overly complex infrastructure

because the assignment focuses on:
- ingestion architecture
- normalization logic
- auditability
- engineering judgment
rather than infrastructure scale.

---

# 20. Success Criteria

The prototype succeeds if it demonstrates:
- realistic enterprise ingestion handling
- clean data architecture
- strong normalization strategy
- analyst usability
- audit traceability
- thoughtful engineering tradeoffs

The goal is not feature quantity.

The goal is demonstrating engineering judgment and system design maturity.





Alright, I want you to start the implementation, but make sure you don't write very complex code, you keep it very simple, straightforward, effective, but at the same time like a senior dev working, secure, scalable.