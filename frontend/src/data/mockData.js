// This file simulates BigQuery responses for our dashboard
// In production, this data would come from actual BigQuery queries

// Simulated monthly reporting data with health scores
export const monthlyReports = [
  {
    report_month: '2024-01',
    account_id: 'ACC001',
    health_score: 95,
    total_records: 15420,
    null_count: 23,
    duplicate_count: 12,
    type_mismatch_count: 5,
    constraint_violations: 2,
    load_timestamp: '2024-01-15T10:30:00Z',
    status: 'COMPLETED'
  },
  {
    report_month: '2024-01',
    account_id: 'ACC002',
    health_score: 87,
    total_records: 8930,
    null_count: 45,
    duplicate_count: 23,
    type_mismatch_count: 12,
    constraint_violations: 8,
    load_timestamp: '2024-01-15T10:35:00Z',
    status: 'COMPLETED'
  },
  {
    report_month: '2024-02',
    account_id: 'ACC001',
    health_score: 92,
    total_records: 16780,
    null_count: 34,
    duplicate_count: 18,
    type_mismatch_count: 8,
    constraint_violations: 4,
    load_timestamp: '2024-02-15T09:15:00Z',
    status: 'COMPLETED'
  },
  {
    report_month: '2024-02',
    account_id: 'ACC002',
    health_score: 91,
    total_records: 9340,
    null_count: 28,
    duplicate_count: 15,
    type_mismatch_count: 6,
    constraint_violations: 3,
    load_timestamp: '2024-02-15T09:22:00Z',
    status: 'COMPLETED'
  },
  {
    report_month: '2024-03',
    account_id: 'ACC001',
    health_score: 98,
    total_records: 17230,
    null_count: 12,
    duplicate_count: 8,
    type_mismatch_count: 3,
    constraint_violations: 1,
    load_timestamp: '2024-03-15T11:45:00Z',
    status: 'COMPLETED'
  },
  {
    report_month: '2024-03',
    account_id: 'ACC002',
    health_score: 94,
    total_records: 9820,
    null_count: 18,
    duplicate_count: 11,
    type_mismatch_count: 4,
    constraint_violations: 2,
    load_timestamp: '2024-03-15T11:52:00Z',
    status: 'COMPLETED'
  }
];

// Error trends over time for charts
export const errorTrends = [
  { month: 'Jan 2024', nulls: 68, duplicates: 35, type_mismatches: 17, total_errors: 120 },
  { month: 'Feb 2024', nulls: 62, duplicates: 33, type_mismatches: 14, total_errors: 109 },
  { month: 'Mar 2024', nulls: 30, duplicates: 19, type_mismatches: 7, total_errors: 56 },
  { month: 'Apr 2024', nulls: 25, duplicates: 15, type_mismatches: 5, total_errors: 45 },
  { month: 'May 2024', nulls: 22, duplicates: 12, type_mismatches: 4, total_errors: 38 }
];

// Health score trends
export const healthTrends = [
  { month: 'Jan 2024', avg_health_score: 91, accounts_processed: 2 },
  { month: 'Feb 2024', avg_health_score: 91.5, accounts_processed: 2 },
  { month: 'Mar 2024', avg_health_score: 96, accounts_processed: 2 },
  { month: 'Apr 2024', avg_health_score: 97, accounts_processed: 2 },
  { month: 'May 2024', avg_health_score: 98, accounts_processed: 2 }
];

// Simulated real-time data quality metrics
export const currentMetrics = {
  total_accounts: 15,
  active_reports: 8,
  avg_health_score: 94.2,
  critical_issues: 3,
  last_updated: new Date().toISOString(),
  data_freshness: 'Real-time',
  pipeline_status: 'RUNNING'
};

// Sample raw data for demonstrating deduplication logic
export const sampleInvoiceData = [
  {
    invoice_id: 'INV001',
    account_id: 'ACC001',
    amount: 1500.00,
    load_ts: '2024-03-15T10:30:00Z'
  },
  {
    invoice_id: 'INV001', // Duplicate
    account_id: 'ACC001',
    amount: 1500.00,
    load_ts: '2024-03-15T10:35:00Z' // Later timestamp - should be kept
  },
  {
    invoice_id: 'INV002',
    account_id: 'ACC002',
    amount: 2300.00,
    load_ts: '2024-03-15T10:32:00Z'
  }
];

// BigQuery partition and cluster information
export const tableMetadata = {
  partitioning: {
    field: 'report_month',
    type: 'MONTH',
    description: 'Partitioned by report month to reduce scanned bytes'
  },
  clustering: {
    fields: ['account_id'],
    description: 'Clustered by account_id for faster lookups'
  },
  row_level_security: {
    enabled: true,
    authorized_views: ['analyst_view', 'approver_view'],
    description: 'Role-based access control implemented'
  }
};