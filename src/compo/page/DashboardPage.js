import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { styled } from '@mui/system';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Swal from "sweetalert2";
import axios from "axios";
import APIConnection from "../../config";
import { Link } from 'react-router-dom';
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Color theme
const themeColor = {
  primary: '#1565C0',
  secondary: '#FF4081',
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#29b6f6',
};



// Sample new partner request data
const newPartnerRequests = [
  { id: 1, name: 'Tech Innovators', status: 'Pending', date: '2023-09-21' },
  { id: 2, name: 'Digital Solutions', status: 'Approved', date: '2023-09-19' },
  { id: 3, name: 'Alpha Networks', status: 'Rejected', date: '2023-09-17' },
];

// Styled Paper component
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  background: themeColor.cardBackground,
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
}));

// Styling for cards
const StatCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: bgcolor,
  color: '#fff',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
}));



// APIConnection
const getPromoapi = APIConnection.marketingDashboatPrCountpi;
const partnerRqapi = APIConnection.partnerRq;



const DashboardPage = () => {

  const [dashboardDetails,setDashboardDetails]=useState({});

  const [PartnerRq,setPartnerRq]=useState(0);


  const partnerRequestData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Partner Requests',
        data: [dashboardDetails.partnerRequestStatus?.pending, dashboardDetails.partnerRequestStatus?.approved, dashboardDetails.partnerRequestStatus?.rejected], // Sample data for partner request counts
        backgroundColor: ['#FFB74D', '#4CAF50', '#F44336'],
        hoverOffset: 4,
      },
    ],
  };



  const fetchPartnercount = async () => {
    try {
      const response = await axios.get(getPromoapi, {
        withCredentials: true,
      });
      setDashboardDetails(response.data);
    } catch (error) {
      console.error("Error loading partnercount:", error);
    }
  };


  const fetchPartnerRq= async () => {
    try {
      const response = await axios.get(partnerRqapi, {
        withCredentials: true,
      });
      setPartnerRq(response.data);
    } catch (error) {
      console.error("Error loading partnercount:", error);
    }
  };

  useEffect(() => {
    fetchPartnercount();
    fetchPartnerRq();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginBottom: '50px' }}>
      {/* Dashboard Title */}
      <Typography gutterBottom style={{ fontWeight: 700, marginBottom: '20px', fontSize: '25px' }}>
        Welcome to the Marketing Dashboard!
      </Typography>

      <Grid container spacing={4}>
        {/* Donut Chart on the Left */}
        <Grid item xs={12} md={5}>
              <StatCard style={{  marginBottom: '10px'}}>
                <Typography style={{  color:'Black', fontSize: '20px'}}>Hi {dashboardDetails?.userName}! 👋</Typography>
              </StatCard>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Partner Request Status
            </Typography>
            {/* Reduced size of the Donut Chart */}
            <Box sx={{ maxWidth: '85%', margin: 'auto' }}>
              <Doughnut data={partnerRequestData} />
            </Box>
          </StyledPaper>
        </Grid>

        {/* Cards and Table Section on the Right */}
        <Grid item xs={12} md={7}>
          {/* Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StatCard bgcolor={themeColor.primary}>
                <Typography variant="h5">{dashboardDetails?.totalPartners}</Typography>
                <Typography variant="subtitle1">Total Partners</Typography>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StatCard bgcolor={themeColor.secondary}>
                <Typography variant="h5">{dashboardDetails?.totalVendors}</Typography>
                <Typography variant="subtitle1">Total Vendors</Typography>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StatCard bgcolor={themeColor.success}>
                <Typography variant="h5">{dashboardDetails?.totalCompanies}</Typography>
                <Typography variant="subtitle1">Total Companies</Typography>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StatCard bgcolor={themeColor.warning}>
                <Typography variant="h5">{dashboardDetails?.totalProducts}</Typography>
                <Typography variant="subtitle1">Total Products</Typography>
              </StatCard>
            </Grid>
          </Grid>

          {/* New Partner Requests Table */}
          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              New Partner Requests
            </Typography>
            {/* View Button next to the title */}
          <Link to={'/vnmgt'}>
          
          <Button variant="contained" color="primary" size="small">
              View
            </Button></Link>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Partner Name</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Request Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PartnerRq && PartnerRq.map((request ,index) => (
                  <TableRow key={index}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{request.company_name}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
