// src/compo/page/ControlUserAccounts.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  Grid,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PasswordIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';

// Define initial data for the table
const initialData = [
  {
    id: 1,
    name: 'John Doe',
    fullName: 'Johnathan Doe',
    email: 'john.doe@example.com',
    empId: 'EMP001',
    status: 'Active',
    online: true,
    department: 'IT',
  },
  {
    id: 2,
    name: 'Jane Smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    empId: 'EMP002',
    status: 'Inactive',
    online: false,
    department: 'HR',
  },
  // Add more data as needed
];

// Theme colors
const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#f5f5f5', // Light hover color for rows
  scrollbarThumbColor: '#888', // Custom scrollbar color
};

// Styled components for consistent UI
const PremiumButton = styled(Button)(({ theme, variant }) => ({
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
  color: variant === 'contained' ? theme.palette.common.white : themeColor.primary,
  border: variant === 'outlined' ? `2px solid ${themeColor.primary}` : 'none',
  '&:hover': {
    backgroundColor: variant === 'contained' ? themeColor.primaryDark : 'rgba(51, 51, 51, 0.05)',
    transform: 'scale(1.03)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#ffffff', // Default white background for cells
  color: themeColor.color,
  transition: 'background-color 0.3s ease',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  height: '40px',
  transition: 'background-color 0.3s ease',
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9', // Light gray for alternate rows
  },
  '&:hover': {
    backgroundColor: themeColor.rowHoverColor, // Distinct hover color
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
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

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.headerTextColor,
  fontSize: '18px',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  background: themeColor.headerBg,
  width: '40%',
  padding: '8px 0',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '8px',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
  position: 'sticky',
  top: 0,
  zIndex: 3,
}));

const DialogTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  textAlign: 'left', // Align text to the left
  color: themeColor.color,
}));

const ControlUserAccounts = () => {
  const theme = useTheme();
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setShowViewPopup(true);
  };

  const handleCloseViewPopup = () => {
    setShowViewPopup(false);
    setSelectedUser(null);
  };

  const handleRequestUpdate = () => {
    setShowPasswordPopup(true);
  };

  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmUpdate = () => {
    if (password === 'your-secure-password') {
      // Replace this with your actual password validation
      // Update the user status in your data
      const updatedData = data.map((user) =>
        user.id === selectedUser.id ? { ...user, status: newStatus } : user
      );
      setData(updatedData);
      setFilteredData(updatedData); // Update the filtered data as well
      setShowPasswordPopup(false);
      handleCloseViewPopup();
      Swal.fire('Success!', 'Status updated successfully!', 'success'); // Show success message
    } else {
      Swal.fire('Error!', 'Incorrect password. Please try again.', 'error'); // Show error message
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
    const filtered = data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.empId.toLowerCase().includes(searchTerm) ||
        user.fullName.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
    const filtered = initialData.filter((user) => user.department === department || department === '');
    setFilteredData(filtered);
  };

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      <TitleTypography variant="h5">Control User Accounts</TitleTypography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 2,
          height: '35px', // Reduced height for search bar and select
        }}
      >
        <FormControl
          variant="outlined"
          sx={{
            minWidth: 150,
            marginRight: 2,
            height: '35px', // Match height with search bar
            '& .MuiOutlinedInput-root': {
              height: '35px', // Set the inner height for select
              fontSize: '0.875rem', // Adjust font size for a more compact look
              '& fieldset': {
                borderColor: themeColor.borderColor,
              },
              '&:hover fieldset': {
                borderColor: themeColor.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: themeColor.primaryDark,
              },
            },
          }}
        >
          <InputLabel>Department</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            label="Department"
          >
            <MenuItem value="">
              <em>All Departments</em>
            </MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
          value={search}
          sx={{
            maxWidth: 400,
            height: '35px', // Reduced height for a more compact appearance
            '& .MuiOutlinedInput-root': {
              height: '35px', // Set the inner height for input
              fontSize: '0.875rem', // Adjust font size for a more compact look
              '& fieldset': {
                borderColor: themeColor.borderColor,
              },
              '&:hover fieldset': {
                borderColor: themeColor.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: themeColor.primaryDark,
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search by Name, Email or EMP ID"
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'auto',
          maxHeight: '450px',
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
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Emp ID</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Online</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredData.map((user) => (
              <StyledTableRow
                key={user.id}
                onClick={() => handleRowClick(user)}
              >
                <StyledTableCell>{user.name}</StyledTableCell>
                <StyledTableCell>{user.fullName}</StyledTableCell>
                <StyledTableCell>{user.email}</StyledTableCell>
                <StyledTableCell>{user.empId}</StyledTableCell>
                <StyledTableCell>{user.status}</StyledTableCell>
                <StyledTableCell>
                  {user.online ? 'Online' : 'Offline'}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Popup */}
      <Dialog
        open={showViewPopup}
        onClose={handleCloseViewPopup}
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease-out', // Smooth animation for dialog opening
            transform: showViewPopup ? 'scale(1)' : 'scale(0.9)',
            width: '500px', // Set a fixed width for the dialog
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Username:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{selectedUser?.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Full Name:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{selectedUser?.fullName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Email:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{selectedUser?.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Emp ID:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{selectedUser?.empId}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Status:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Status"
                  sx={{
                    height: '35px',
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-root': {
                      height: '35px',
                      '& fieldset': {
                        borderColor: themeColor.borderColor,
                      },
                      '&:hover fieldset': {
                        borderColor: themeColor.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: themeColor.primaryDark,
                      },
                    },
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <PremiumButton variant="outlined" onClick={handleCloseViewPopup}>
            Close
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleRequestUpdate}>
            Update Status
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Password Confirmation Popup */}
      <Dialog
        open={showPasswordPopup}
        onClose={handleClosePasswordPopup}
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease-out', // Smooth animation for dialog opening
            transform: showPasswordPopup ? 'scale(1)' : 'scale(0.9)',
            width: '400px', // Set a fixed width for the dialog
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Confirm Update
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Password"
            type="password"
            fullWidth
            variant="outlined"
            onChange={handlePasswordChange}
            value={password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              height: '35px',
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-root': {
                height: '35px',
                '& fieldset': {
                  borderColor: themeColor.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: themeColor.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: themeColor.primaryDark,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <PremiumButton variant="outlined" onClick={handleClosePasswordPopup}>
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleConfirmUpdate}>
            Confirm
          </PremiumButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlUserAccounts;
