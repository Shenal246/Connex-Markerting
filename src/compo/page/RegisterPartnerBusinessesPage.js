// src/compo/page/RegisterPartnerBusinessesPage.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Zoom,
  Slide,
} from '@mui/material';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PasswordIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';

// Define initial data
const initialData = [
  {
    id: 1,
    companyName: 'Tech Innovations',
    contactName: 'Jane Doe',
    contactEmail: 'jane.doe@techinnovations.com',
    contactPhone: '+1234567890',
    address: '123 Tech Lane, Silicon Valley, CA',
    website: 'techinnovations.com',
    registrationNumber: 'REG12345',
    vatNumber: 'VAT67890',
  },
  {
    id: 2,
    companyName: 'Future Corp',
    contactName: 'John Smith',
    contactEmail: 'john.smith@futurecorp.com',
    contactPhone: '+1987654321',
    address: '456 Future Blvd, New York, NY',
    website: 'futurecorp.com',
    registrationNumber: 'REG98765',
    vatNumber: 'VAT43210',
  },
  // Add more sample data if needed
];

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#e0f7fa', // Light cyan for row hover
  scrollbarThumbColor: '#888', // Color for scrollbar
};

// Define styled components
const PremiumButton = styled(Button)(({ variant }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 'bold',
  height: '35px',
  minWidth: '90px',
  fontSize: '13px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  border: 'none',
  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
  background: variant === 'contained' ? themeColor.primary : 'transparent',
  color: variant === 'contained' ? '#fff' : themeColor.primary,
  border: variant === 'outlined' ? `2px solid ${themeColor.primary}` : 'none',
  '&:hover': {
    backgroundColor:
      variant === 'contained'
        ? themeColor.primaryDark
        : 'rgba(51, 51, 51, 0.1)',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: '12px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#ffffff', // Default white background for cells
  color: themeColor.color,
}));

const StyledTableRow = styled(TableRow)(() => ({
  cursor: 'pointer',
  height: '40px',
  transition: 'background-color 0.3s ease',
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9', // Light gray for alternate rows
  },
  '&:hover': {
    backgroundColor: themeColor.rowHoverColor, // Distinct hover color
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Shadow on hover
  },
}));

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: themeColor.headerBg,
  color: themeColor.headerTextColor,
  position: 'sticky',
  top: 0,
  zIndex: 2,
  '& th': {
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '10px 12px',
    textAlign: 'center',
    borderRight: `1px solid ${themeColor.borderColor}`,
    background: themeColor.headerBg,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    color: themeColor.headerTextColor,
    '&:last-child': {
      borderRight: 'none', // No border on the last header cell
    },
  },
}));

const TitleTypography = styled(Typography)(() => ({
  fontWeight: 'bold',
  color: themeColor.headerTextColor,
  fontSize: '18px',
  marginBottom: 2,
  textAlign: 'center',
  background: themeColor.headerBg,
  width: '50%',
  padding: '8px 0',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '8px',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
  position: 'sticky',
  top: 0,
  zIndex: 3,
}));

const DialogTableCell = styled(TableCell)(() => ({
  fontSize: '13px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  textAlign: 'left', // Align text to the left
  color: themeColor.color,
}));

const RegisterPartnerBusinessesPage = () => {
  const [data, setData] = useState(initialData);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  const handleRowClick = (business) => {
    setSelectedBusiness(business);
    setShowDetailPopup(true);
  };

  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedBusiness(null);
  };

  return (
    <Box sx={{ padding: 2, overflowY: 'hidden' }}>
      <TitleTypography variant="h5">
        Register Partner Businesses
      </TitleTypography>
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'auto',
          height: '400px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: themeColor.scrollbarThumbColor,
            borderRadius: '4px',
          },
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Contact Name</StyledTableCell>
              <StyledTableCell>Contact Email</StyledTableCell>
              <StyledTableCell>Contact Phone</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Website</StyledTableCell>
              <StyledTableCell>Registration Number</StyledTableCell>
              <StyledTableCell>VAT Number</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {data.map((business) => (
              <StyledTableRow
                key={business.id}
                onClick={() => handleRowClick(business)}
              >
                <StyledTableCell>{business.companyName}</StyledTableCell>
                <StyledTableCell>{business.contactName}</StyledTableCell>
                <StyledTableCell>{business.contactEmail}</StyledTableCell>
                <StyledTableCell>{business.contactPhone}</StyledTableCell>
                <StyledTableCell>{business.address}</StyledTableCell>
                <StyledTableCell>{business.website}</StyledTableCell>
                <StyledTableCell>{business.registrationNumber}</StyledTableCell>
                <StyledTableCell>{business.vatNumber}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Popup */}
      <Dialog
        open={showDetailPopup}
        onClose={handleCloseDetailPopup}
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          {selectedBusiness && (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                {selectedBusiness.companyName}
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Contact Name:</strong>
                    </DialogTableCell>
                    <DialogTableCell>
                      {selectedBusiness.contactName}
                    </DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Contact Email:</strong>
                    </DialogTableCell>
                    <DialogTableCell>
                      {selectedBusiness.contactEmail}
                    </DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Contact Phone:</strong>
                    </DialogTableCell>
                    <DialogTableCell>
                      {selectedBusiness.contactPhone}
                    </DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Address:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedBusiness.address}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Website:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedBusiness.website}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Registration Number:</strong>
                    </DialogTableCell>
                    <DialogTableCell>
                      {selectedBusiness.registrationNumber}
                    </DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>VAT Number:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedBusiness.vatNumber}</DialogTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseDetailPopup}
          >
            Close
          </PremiumButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegisterPartnerBusinessesPage;
