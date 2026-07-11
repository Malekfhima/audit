export interface DashboardStats {
  audits: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
    thisMonth: number;
  };
  nonConformities: {
    total: number;
    open: number;
    closed: number;
    bySeverity: {
      major: number;
      minor: number;
      observation: number;
    };
  };
  correctiveActions: {
    total: number;
    pending: number;
    overdue: number;
    completed: number;
  };
  risks: {
    total: number;
    byLevel: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  compliance: {
    compliant: number;
    nonCompliant: number;
    pending: number;
  };
}

export interface DashboardFilters {
  siteId?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}
