import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Assessment,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { errorTrends, healthTrends } from '../data/mockData';

const ErrorTrends = () => {
  const [viewType, setViewType] = useState('trends');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewType(newView);
    }
  };

  // Calculate current month data for pie chart
  const currentMonthData = errorTrends[errorTrends.length - 1];
  const pieData = [
    { name: 'Null Values', value: currentMonthData.nulls, color: '#FF6B6B' },
    { name: 'Duplicates', value: currentMonthData.duplicates, color: '#4ECDC4' },
    { name: 'Type Mismatches', value: currentMonthData.type_mismatches, color: '#45B7D1' }
  ];

  const renderTrendsView = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={errorTrends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="nulls" 
          stroke="#FF6B6B" 
          strokeWidth={3}
          name="Null Values"
          dot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="duplicates" 
          stroke="#4ECDC4" 
          strokeWidth={3}
          name="Duplicates"
          dot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="type_mismatches" 
          stroke="#45B7D1" 
          strokeWidth={3}
          name="Type Mismatches"
          dot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="total_errors" 
          stroke="#9B59B6" 
          strokeWidth={3}
          name="Total Errors"
          dot={{ r: 6 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarView = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={errorTrends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="nulls" fill="#FF6B6B" name="Null Values" />
        <Bar dataKey="duplicates" fill="#4ECDC4" name="Duplicates" />
        <Bar dataKey="type_mismatches" fill="#45B7D1" name="Type Mismatches" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieView = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center">
        Current Month Error Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  // Calculate improvement metrics
  const calculateImprovement = () => {
    const firstMonth = errorTrends[0];
    const lastMonth = errorTrends[errorTrends.length - 1];
    
    const improvement = ((firstMonth.total_errors - lastMonth.total_errors) / firstMonth.total_errors * 100).toFixed(1);
    const healthImprovement = ((healthTrends[healthTrends.length - 1].avg_health_score - healthTrends[0].avg_health_score)).toFixed(1);
    
    return { improvement, healthImprovement };
  };

  const { improvement, healthImprovement } = calculateImprovement();

  return (
    <Box>
      {/* Error Trends Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Error Trends Analysis
          </Typography>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="trends">
              <TrendingUp sx={{ mr: 1 }} />
              Trends
            </ToggleButton>
            <ToggleButton value="bar">
              <Assessment sx={{ mr: 1 }} />
              Compare
            </ToggleButton>
            <ToggleButton value="pie">
              <PieChartIcon sx={{ mr: 1 }} />
              Breakdown
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {viewType === 'trends' && renderTrendsView()}
        {viewType === 'bar' && renderBarView()}
        {viewType === 'pie' && renderPieView()}
      </Paper>

      {/* Health Score Trend */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Health Score Trend
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={healthTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f5f5f5', 
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="avg_health_score" 
              stroke="#00C851" 
              strokeWidth={4}
              name="Health Score %"
              dot={{ r: 8, fill: '#00C851' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Key Insights Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {improvement}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Error Reduction
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary.main">
                      +{healthImprovement}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Health Score Improvement
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Quality Rules Summary */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active Data Quality Rules
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            🔍 <strong>Null Check:</strong> Required fields cannot be empty (invoice_id, account_id, amount)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🔄 <strong>Duplicate Detection:</strong> QUALIFY ROW_NUMBER() logic removes duplicate invoice_ids
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🔢 <strong>Type Validation:</strong> Amount field must be numeric, dates must be valid timestamps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ <strong>Constraint Checks:</strong> Amount must be positive, account_ids must follow pattern
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📊 <strong>Automated Scheduling:</strong> Quality checks run daily via Cloud Scheduler
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorTrends;