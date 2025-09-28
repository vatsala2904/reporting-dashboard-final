import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CheckCircle,
  Warning,
  Error,
  CloudUpload,
  Assessment
} from '@mui/icons-material';
import HealthMetrics from './HealthMetrics';
import ErrorTrends from './ErrorTrends';
import { 
  monthlyReports, 
  currentMetrics, 
  sampleInvoiceData 
} from '../data/mockData';
import { 
  performDataQualityChecks, 
  calculateHealthScore,
  deduplicateRecords,
  logMetricsToTable
} from '../utils/dataQuality';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(currentMetrics);
  const [selectedAccount, setSelectedAccount] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [dataQualityResults, setDataQualityResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate data quality check run
  const runDataQualityCheck = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const qualityChecks = performDataQualityChecks(sampleInvoiceData);
      const healthScore = calculateHealthScore(qualityChecks);
      const metricsLog = logMetricsToTable(qualityChecks, healthScore);
      
      setDataQualityResults({
        checks: qualityChecks,
        healthScore: healthScore,
        metricsLog: metricsLog
      });
      
      setLastRefresh(new Date());
      setIsLoading(false);
    }, 1500);
  };

  // Simulate deduplication process
  const runDeduplication = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const deduplicatedData = deduplicateRecords(sampleInvoiceData);
      const duplicatesRemoved = deduplicatedData.filter(r => r.dedup_status === 'DUPLICATE_REMOVED').length;
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        last_updated: new Date().toISOString(),
        duplicates_removed: duplicatesRemoved
      }));
      
      setLastRefresh(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Filter data based on selections
  const filteredReports = monthlyReports.filter(report => {
    const accountMatch = selectedAccount === 'ALL' || report.account_id === selectedAccount;
    const monthMatch = report.report_month === selectedMonth;
    return accountMatch && monthMatch;
  });


  const getStatusIcon = (score) => {
    if (score >= 90) return <CheckCircle />;
    if (score >= 70) return <Warning />;
    return <Error />;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DashboardIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Reporting & Data Health Dashboard
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          BigQuery Data Quality Monitoring with Real-time Analytics
        </Typography>
        <Chip 
          label={`Last Updated: ${lastRefresh.toLocaleTimeString()}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {/* Control Panel */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Control Panel
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Account</InputLabel>
              <Select
                value={selectedAccount}
                label="Account"
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <MenuItem value="ALL">All Accounts</MenuItem>
                <MenuItem value="ACC001">ACC001</MenuItem>
                <MenuItem value="ACC002">ACC002</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Report Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="2024-01">January 2024</MenuItem>
                <MenuItem value="2024-02">February 2024</MenuItem>
                <MenuItem value="2024-03">March 2024</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              onClick={runDataQualityCheck}
              disabled={isLoading}
              fullWidth
            >
              Run Quality Check
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={runDeduplication}
              disabled={isLoading}
              fullWidth
            >
              Run Deduplication
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Total Accounts
                  </Typography>
                  <Typography variant="h4">
                    {metrics.total_accounts}
                  </Typography>
                </div>
                <Assessment color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Active Reports
                  </Typography>
                  <Typography variant="h4">
                    {metrics.active_reports}
                  </Typography>
                </div>
                <DashboardIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Health Score
                  </Typography>
                  <Typography variant="h4">
                    {metrics.avg_health_score}%
                  </Typography>
                </div>
                {getStatusIcon(metrics.avg_health_score)}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Critical Issues
                  </Typography>
                  <Typography variant="h4" color="error">
                    {metrics.critical_issues}
                  </Typography>
                </div>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Quality Results */}
      {dataQualityResults && (
        <Alert severity={dataQualityResults.healthScore >= 90 ? 'success' : 'warning'} sx={{ mb: 4 }}>
          <Typography variant="h6">
            Data Quality Check Complete
          </Typography>
          <Typography>
            Health Score: {dataQualityResults.healthScore}% | 
            Total Records: {dataQualityResults.checks.total_records} | 
            Issues Found: {
              dataQualityResults.checks.null_violations.length + 
              dataQualityResults.checks.duplicate_violations.length + 
              dataQualityResults.checks.type_violations.length + 
              dataQualityResults.checks.constraint_violations.length
            }
          </Typography>
        </Alert>
      )}

      {/* Main Dashboard Components */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <HealthMetrics 
            data={filteredReports} 
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ErrorTrends />
        </Grid>
      </Grid>

      {/* BigQuery Information Panel */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          BigQuery Configuration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Partitioning:</strong> Tables partitioned by report_month to reduce scanned bytes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Clustering:</strong> Clustered by account_id for faster lookups
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Row-Level Security:</strong> Implemented via authorized views
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Data Pipeline:</strong> {metrics.pipeline_status}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* System Status */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Pipeline Status: {metrics.pipeline_status} | 
          Data Freshness: {metrics.data_freshness} | 
          Last Updated: {new Date(metrics.last_updated).toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
