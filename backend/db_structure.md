# Full MongoDB Database Schema

## 1. Users & Roles

### Users Collection (`users`)

* `_id`: ObjectId
* `organizationId`: ObjectId (nullable)
* `email`: string (unique)
* `passwordHash`: string
* `firstName`: string
* `lastName`: string
* `roleId`: ObjectId → roles
* `isActive`: boolean
* `createdAt`: Date
* `updatedAt`: Date

### Roles Collection (`roles`)

* `_id`: ObjectId
* `name`: string (SUPER_ADMIN, ADMIN_QUALITE, AUDITEUR, etc.)
* `permissions`: [string]
* `createdAt`: Date
* `updatedAt`: Date

## 2. Norms & Checklist

### Norms (`norms`)

* `_id`: ObjectId
* `code`: string (ISO 9001, ISO 14001, etc.)
* `version`: string
* `title`: string
* `isActive`: boolean
* `createdAt`: Date
* `updatedAt`: Date

### Norm Clauses (`clauses`)

* `_id`: ObjectId
* `normId`: ObjectId → norms
* `code`: string (e.g., "7.2")
* `title`: string
* `description`: string
* `createdAt`: Date
* `updatedAt`: Date

### Checklist Questions (`checklist_questions`)

* `_id`: ObjectId
* `normId`: ObjectId
* `clauseId`: ObjectId
* `text`: string
* `type`: string (YES_NO_NA, SCORE)
* `criticality`: string (LOW, MEDIUM, HIGH)
* `isActive`: boolean
* `createdAt`: Date
* `updatedAt`: Date

## 3. Sites & Processes

### Sites (`sites`)

* `_id`: ObjectId
* `organizationId`: ObjectId
* `name`: string
* `address`: string
* `city`: string
* `country`: string
* `createdAt`: Date
* `updatedAt`: Date

### Processes (`processes`)

* `_id`: ObjectId
* `siteId`: ObjectId → sites
* `name`: string
* `ownerUserId`: ObjectId → users
* `description`: string
* `createdAt`: Date
* `updatedAt`: Date

## 4. Audits

### Audits (`audits`)

* `_id`: ObjectId
* `ref`: string
* `organizationId`: ObjectId
* `type`: string (INTERNAL, EXTERNAL, CERTIFICATION)
* `normId`: ObjectId
* `siteId`: ObjectId
* `processId`: ObjectId (nullable)
* `status`: string (PLANNED, IN_PROGRESS, PENDING_ACTIONS, CLOSED)
* `objective`: string
* `scope`: string
* `plannedStartDate`: Date
* `plannedEndDate`: Date
* `actualStartDate`: Date
* `actualEndDate`: Date
* `leadAuditorId`: ObjectId → users
* `createdById`: ObjectId → users
* `createdAt`: Date
* `updatedAt`: Date

### Audit Entries (`audit_entries`)

* `_id`: ObjectId
* `auditId`: ObjectId
* `checklistQuestionId`: ObjectId
* `status`: string (CONFORM, NON_CONFORM, NA)
* `comment`: string
* `score`: number
* `evidence`: [string] (file URLs)
* `createdAt`: Date
* `updatedAt`: Date

## 5. Non-Conformities & Actions

### Non-Conformities (`non_conformities`)

* `_id`: ObjectId
* `ref`: string
* `auditId`: ObjectId
* `auditEntryId`: ObjectId
* `normId`: ObjectId
* `clauseId`: ObjectId
* `title`: string
* `description`: string
* `cause`: string
* `severity`: string (LOW, MEDIUM, HIGH, CRITICAL)
* `status`: string (OPEN, IN_PROGRESS, TO_VERIFY, CLOSED)
* `responsibleId`: ObjectId → users
* `detectionDate`: Date
* `dueDate`: Date
* `closureDate`: Date
* `createdAt`: Date
* `updatedAt`: Date

### Corrective Actions (`corrective_actions`)

* `_id`: ObjectId
* `nonConformityId`: ObjectId
* `title`: string
* `description`: string
* `status`: string (PLANNED, IN_PROGRESS, DONE, VERIFIED, CLOSED)
* `responsibleId`: ObjectId
* `dueDate`: Date
* `completionDate`: Date
* `createdAt`: Date
* `updatedAt`: Date

## 6. Risks

### Risks (`risks`)

* `_id`: ObjectId
* `organizationId`: ObjectId
* `code`: string
* `description`: string
* `processId`: ObjectId
* `cause`: string
* `consequence`: string
* `probability`: number (1–5)
* `impact`: number (1–5)
* `criticality`: number (computed)
* `status`: string (IDENTIFIED, MITIGATED, CLOSED)
* `existingControls`: string
* `createdAt`: Date
* `updatedAt`: Date

### Risk Links (`risk_links`)

* `_id`: ObjectId
* `riskId`: ObjectId
* `nonConformityId`: ObjectId
* `auditId`: ObjectId
* `correctiveActionId`: ObjectId
* `createdAt`: Date

## 7. Legal Compliance

### Legal Requirements (`legal_requirements`)

* `_id`: ObjectId
* `ref`: string
* `title`: string
* `source`: string
* `summary`: string
* `url`: string
* `normId`: ObjectId
* `clauseId`: ObjectId
* `effectiveDate`: Date
* `revisionDate`: Date
* `status`: string (APPLICABLE, NOT_APPLICABLE)
* `createdAt`: Date
* `updatedAt`: Date

### Legal Compliance (`legal_compliances`)

* `_id`: ObjectId
* `legalRequirementId`: ObjectId
* `siteId`: ObjectId
* `responsibleId`: ObjectId
* `status`: string (CONFORM, NON_CONFORM, NA)
* `comment`: string
* `lastReviewDate`: Date
* `createdAt`: Date
* `updatedAt`: Date

## 8. Reports & Notifications

### Reports (`reports`)

* `_id`: ObjectId
* `type`: string (AUDIT, SUMMARY)
* `auditId`: ObjectId
* `periodStart`: Date
* `periodEnd`: Date
* `fileUrl`: string
* `generatedById`: ObjectId
* `generatedAt`: Date

### Notifications (`notifications`)

* `_id`: ObjectId
* `userId`: ObjectId
* `type`: string
* `title`: string
* `message`: string
* `link`: string
* `read`: boolean
* `createdAt`: Date

## 9. Audit Logs

### Audit Log (`audit_logs`)

* `_id`: ObjectId
* `userId`: ObjectId
* `entityType`: string
* `entityId`: ObjectId
* `actionType`: string
* `oldValue`: any
* `newValue`: any
* `timestamp`: Date
* `ipAddress`: string
