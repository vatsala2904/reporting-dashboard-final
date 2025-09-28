// Data Quality Utility Functions
// These functions simulate the data quality checks mentioned in the resume

/**
 * Deduplication logic using ROW_NUMBER() OVER (PARTITION BY invoice_id ORDER BY load_ts DESC) = 1
 * This simulates the BigQuery SQL logic mentioned in the resume
 */
export const deduplicateRecords = (records) => {
  const deduplicated = [];
  const seenIds = new Map();
  
  // Sort by load_ts DESC (most recent first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.load_ts) - new Date(a.load_ts)
  );
  
  // Keep only the most recent record for each invoice_id
  sortedRecords.forEach(record => {
    if (!seenIds.has(record.invoice_id)) {
      seenIds.set(record.invoice_id, true);
      deduplicated.push({
        ...record,
        row_number: 1,
        dedup_status: 'KEPT'
      });
    } else {
      // Mark as duplicate for logging
      deduplicated.push({
        ...record,
        row_number: 2,
        dedup_status: 'DUPLICATE_REMOVED'
      });
    }
  });
  
  return deduplicated;
};

/**
 * Data quality checks: nulls, duplicates, type/constraint mismatches
 */
export const performDataQualityChecks = (data) => {
  const checks = {
    total_records: data.length,
    null_violations: [],
    duplicate_violations: [],
    type_violations: [],
    constraint_violations: [],
    timestamp: new Date().toISOString()
  };
  
  const requiredFields = ['invoice_id', 'account_id', 'amount'];
  const seenIds = new Set();
  
  data.forEach((record, index) => {
    // Check for nulls
    requiredFields.forEach(field => {
      if (!record[field] || record[field] === null || record[field] === '') {
        checks.null_violations.push({
          record_index: index,
          field: field,
          value: record[field],
          severity: 'HIGH'
        });
      }
    });
    
    // Check for duplicates
    if (record.invoice_id) {
      if (seenIds.has(record.invoice_id)) {
        checks.duplicate_violations.push({
          record_index: index,
          invoice_id: record.invoice_id,
          severity: 'MEDIUM'
        });
      } else {
        seenIds.add(record.invoice_id);
      }
    }
    
    // Check data types
    if (record.amount && isNaN(parseFloat(record.amount))) {
      checks.type_violations.push({
        record_index: index,
        field: 'amount',
        value: record.amount,
        expected_type: 'NUMERIC',
        actual_type: typeof record.amount,
        severity: 'HIGH'
      });
    }
    
    // Check constraints (amount should be positive)
    if (record.amount && parseFloat(record.amount) <= 0) {
      checks.constraint_violations.push({
        record_index: index,
        field: 'amount',
        value: record.amount,
        constraint: 'POSITIVE_VALUE',
        severity: 'HIGH'
      });
    }
  });
  
  return checks;
};

/**
 * Calculate health score based on data quality metrics
 */
export const calculateHealthScore = (qualityChecks) => {
  const { total_records, null_violations, duplicate_violations, type_violations, constraint_violations } = qualityChecks;
  
  if (total_records === 0) return 0;
  
  // Weight different violation types
  const weights = {
    null: 0.4,
    duplicate: 0.2,
    type: 0.3,
    constraint: 0.1
  };
  
  const totalViolations = 
    (null_violations.length * weights.null) +
    (duplicate_violations.length * weights.duplicate) +
    (type_violations.length * weights.type) +
    (constraint_violations.length * weights.constraint);
  
  // Calculate score (100 - violation percentage)
  const violationRate = (totalViolations / total_records) * 100;
  const healthScore = Math.max(0, Math.round(100 - violationRate));
  
  return healthScore;
};

/**
 * Generate metrics table entry (simulating logging to BigQuery metrics table)
 */
export const logMetricsToTable = (qualityChecks, healthScore) => {
  return {
    check_timestamp: qualityChecks.timestamp,
    total_records: qualityChecks.total_records,
    null_count: qualityChecks.null_violations.length,
    duplicate_count: qualityChecks.duplicate_violations.length,
    type_mismatch_count: qualityChecks.type_violations.length,
    constraint_violation_count: qualityChecks.constraint_violations.length,
    health_score: healthScore,
    status: healthScore >= 90 ? 'HEALTHY' : healthScore >= 70 ? 'WARNING' : 'CRITICAL',
    table_name: 'invoice_data',
    partition_date: new Date().toISOString().split('T')[0],
    cluster_field: 'account_id'
  };
};

/**
 * Simulate BigQuery partitioning optimization
 */
export const optimizeQueryPerformance = (query, reportMonth, accountId) => {
  const optimizations = {
    original_query: query,
    optimized_query: query,
    partition_pruning: false,
    cluster_optimization: false,
    estimated_bytes_scanned: 'Unknown'
  };
  
  // Check if query uses partition field
  if (query.includes('report_month') && reportMonth) {
    optimizations.partition_pruning = true;
    optimizations.optimized_query += `\n-- Partition pruning: WHERE report_month = '${reportMonth}'`;
    optimizations.estimated_bytes_scanned = '~50MB (90% reduction)';
  }
  
  // Check if query uses cluster field
  if (query.includes('account_id') && accountId) {
    optimizations.cluster_optimization = true;
    optimizations.optimized_query += `\n-- Cluster optimization: account_id filtering applied`;
  }
  
  return optimizations;
};

/**
 * Simulate row-level security check
 */
export const checkRowLevelSecurity = (userRole, requestedData) => {
  const securityPolicy = {
    'analyst': {
      allowed_accounts: ['ACC001', 'ACC002'],
      allowed_fields: ['account_id', 'health_score', 'error_counts'],
      sensitive_fields: ['invoice_details', 'customer_pii']
    },
    'approver': {
      allowed_accounts: ['ACC001', 'ACC002', 'ACC003', 'ACC004'],
      allowed_fields: ['*'],
      sensitive_fields: []
    }
  };
  
  const policy = securityPolicy[userRole] || securityPolicy['analyst'];
  
  return {
    user_role: userRole,
    access_granted: true,
    allowed_accounts: policy.allowed_accounts,
    filtered_data: requestedData.filter(record => 
      policy.allowed_accounts.includes(record.account_id)
    ),
    audit_log: {
      timestamp: new Date().toISOString(),
      user_role: userRole,
      records_accessed: requestedData.length,
      security_policy_applied: true
    }
  };
};

/**
 * Generate sample SQL transforms (as mentioned in resume)
 */
export const generateSQLTransforms = () => {
  return {
    deduplication_query: `
-- Deduplication logic as mentioned in resume
SELECT * EXCEPT(row_num)
FROM (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY invoice_id 
      ORDER BY load_ts DESC
    ) as row_num
  FROM invoice_data
)
WHERE row_num = 1`,
    
    partitioning_ddl: `
-- Table creation with partitioning and clustering
CREATE OR REPLACE TABLE reporting.invoice_data
PARTITION BY DATE(report_month)
CLUSTER BY account_id
AS SELECT * FROM source_data`,
    
    data_quality_check: `
-- Data quality validation query
SELECT 
  report_month,
  account_id,
  COUNT(*) as total_records,
  SUM(CASE WHEN invoice_id IS NULL THEN 1 ELSE 0 END) as null_count,
  COUNT(*) - COUNT(DISTINCT invoice_id) as duplicate_count,
  SUM(CASE WHEN SAFE_CAST(amount AS FLOAT64) IS NULL THEN 1 ELSE 0 END) as type_mismatch_count
FROM invoice_data
GROUP BY report_month, account_id`,
    
    authorized_view: `
-- Row-level security via authorized views
CREATE OR REPLACE VIEW reporting.analyst_view
OPTIONS(description="Analyst access view with row-level security")
AS
SELECT * FROM reporting.invoice_data 
WHERE account_id IN (
  SELECT account_id FROM access_control.analyst_permissions 
  WHERE user_email = SESSION_USER()
)`
  };
};