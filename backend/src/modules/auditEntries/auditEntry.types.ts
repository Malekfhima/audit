// ==============================================
// MODULE: AUDIT ENTRIES - TYPE DEFINITIONS
// ==============================================

export type ConformityStatus =
  | 'CONFORM'
  | 'NON_CONFORM'
  | 'NOT_APPLICABLE'
  | 'OBSERVATION'
  | 'OPPORTUNITY';

// DTO pour créer une entrée d’audit
export interface CreateAuditEntryDto {
  auditId: string;
  clauseId: string;
  question: string;
  evidence?: string;
  finding?: string;
  conformityStatus: ConformityStatus;
  verifiedById?: string; // facultatif lors de la création
  attachments?: string[];
}

// DTO pour mettre à jour une entrée d’audit
export interface UpdateAuditEntryDto {
  question?: string;
  evidence?: string;
  finding?: string;
  conformityStatus?: ConformityStatus;
  verifiedById?: string;
  verifiedAt?: Date;
  attachments?: string[];
}

// Réponse standard pour une entrée d’audit
export interface AuditEntryResponse {
  id: string;
  audit: {
    id: string;
    name?: string;
    status?: string;
  };
  clause: {
    id: string;
    title?: string;
  };
  question: string;
  evidence?: string;
  finding?: string;
  conformityStatus: ConformityStatus;
  verifiedBy?: {
    id: string;
    name?: string;
  };
  attachments?: string[];
  nonConformityId?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Filtrage optionnel pour les listes
export interface AuditEntryFilter {
  conformityStatus?: ConformityStatus;
}
