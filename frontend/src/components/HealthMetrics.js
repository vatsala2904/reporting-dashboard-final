import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

const HealthMetrics = ({ data, isLoading }) => {
  const getHealthColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getHealthIcon = (score) => {
    if (score >= 90) return <CheckCircle color="success" />;
    if (score >= 70) return <Warning color="warning" />;
    return <Error color="error" />;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Health Metrics
        </Typography>
        <Skeleton variant="rectangular" height={400} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Data Health Metrics
      </Typography>
      
      {data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No data available for selected filters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try selecting different account or month combinations
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account ID</TableCell>
                <TableCell>Health Score</TableCell>
                <TableCell align="right">Total Records</TableCell>
                <TableCell align="right">Null Issues</TableCell>
                <TableCell align="right">Duplicates</TableCell>
                <TableCell align="right">Type Mismatches</TableCell>
                <TableCell align="right">Constraint Violations</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {row.account_id}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={row.health_score} 
                          color={getHealthColor(row.health_score)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {row.health_score}%
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(row.total_records)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Chip
                      label={row.null_count}
                      size="small"
                      color={row.null_count > 20 ? 'error' : row.null_count > 10 ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Chip
                      label={row.duplicate_count}
                      size="small"
                      color={row.duplicate_count > 15 ? 'error' : row.duplicate_count > 10 ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Chip
                      label={row.type_mismatch_count}
                      size="small"
                      color={row.type_mismatch_count > 10 ? 'error' : row.type_mismatch_count > 5 ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Chip
                      label={row.constraint_violations}
                      size="small"
                      color={row.constraint_violations > 5 ? 'error' : row.constraint_violations > 2 ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getHealthIcon(row.health_score)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {row.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatTimestamp(row.load_timestamp)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Summary Statistics */}
      {data.length > 0 && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Summary Statistics
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Average Health Score
              </Typography>
              <Typography variant="h6">
                {Math.round(data.reduce((sum, row) => sum + row.health_score, 0) / data.length)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Records Processed
              </Typography>
              <Typography variant="h6">
                {formatNumber(data.reduce((sum, row) => sum + row.total_records, 0))}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Issues Found
              </Typography>
              <Typography variant="h6">
                {formatNumber(data.reduce((sum, row) => 
                  sum + row.null_count + row.duplicate_count + 
                  row.type_mismatch_count + row.constraint_violations, 0))}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Data Quality Trend
              </Typography>
              <Typography variant="h6" color="success.main">
                ↗ Improving
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Deduplication Info */}
      <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Deduplication Logic:</strong> QUALIFY ROW_NUMBER() OVER (PARTITION BY invoice_id ORDER BY load_ts DESC) = 1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>BigQuery Optimization:</strong> Tables partitioned by report_month, clustered by account_id
        </Typography>
      </Box>
    </Paper>
  );
};

export default HealthMetrics;