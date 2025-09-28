// Unit tests for data quality functions
import { 
  performDataQualityChecks, 
  calculateHealthScore, 
  deduplicateRecords 
} from './dataQuality';

describe('Data Quality Functions', () => {
  const sampleData = [
    {
      invoice_id: 'INV001',
      account_id: 'ACC001',
      amount: 1500.00,
      load_ts: '2024-03-15T10:30:00Z'
    },
    {
      invoice_id: 'INV002',
      account_id: 'ACC002',
      amount: 2300.00,
      load_ts: '2024-03-15T10:32:00Z'
    }
  ];

  test('should perform data quality checks', () => {
    const checks = performDataQualityChecks(sampleData);
    
    expect(checks.total_records).toBe(2);
    expect(checks.null_violations).toBeInstanceOf(Array);
    expect(checks.duplicate_violations).toBeInstanceOf(Array);
    expect(checks.type_violations).toBeInstanceOf(Array);
    expect(checks.constraint_violations).toBeInstanceOf(Array);
    expect(checks.timestamp).toBeDefined();
  });

  test('should calculate health score correctly', () => {
    const mockChecks = {
      total_records: 100,
      null_violations: [],
      duplicate_violations: [],
      type_violations: [],
      constraint_violations: []
    };
    
    const healthScore = calculateHealthScore(mockChecks);
    expect(healthScore).toBe(100);
  });

  test('should handle data with violations', () => {
    const dataWithIssues = [
      {
        invoice_id: null, // null violation
        account_id: 'ACC001',
        amount: 1500.00,
        load_ts: '2024-03-15T10:30:00Z'
      },
      {
        invoice_id: 'INV002',
        account_id: 'ACC002',
        amount: -100, // constraint violation (negative amount)
        load_ts: '2024-03-15T10:32:00Z'
      }
    ];

    const checks = performDataQualityChecks(dataWithIssues);
    expect(checks.null_violations.length).toBeGreaterThan(0);
    expect(checks.constraint_violations.length).toBeGreaterThan(0);
  });

  test('should deduplicate records correctly', () => {
    const duplicateData = [
      {
        invoice_id: 'INV001',
        account_id: 'ACC001',
        amount: 1500.00,
        load_ts: '2024-03-15T10:30:00Z'
      },
      {
        invoice_id: 'INV001', // duplicate
        account_id: 'ACC001',
        amount: 1500.00,
        load_ts: '2024-03-15T10:35:00Z' // later timestamp
      }
    ];

    const deduplicated = deduplicateRecords(duplicateData);
    const keptRecords = deduplicated.filter(r => r.dedup_status === 'KEPT');
    
    expect(keptRecords.length).toBe(1);
    expect(keptRecords[0].load_ts).toBe('2024-03-15T10:35:00Z'); // Should keep the later one
  });

  test('should handle empty data gracefully', () => {
    const checks = performDataQualityChecks([]);
    expect(checks.total_records).toBe(0);
    
    const healthScore = calculateHealthScore(checks);
    expect(healthScore).toBe(0);
  });
});