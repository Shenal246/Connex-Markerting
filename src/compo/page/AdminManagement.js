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
  IconButton,
  useTheme,
  Zoom,
  Slide,
} from '@mui/material';
import { styled } from '@mui/system';
import PasswordIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';

// Define initial data for the table
const initialData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'IT',
    activationKey: '12345',
    system: 'Windows',
    bisRegId: 'BIS123456',
    companyName: 'TechCorp',
    online: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@corporation.com',
    department: 'Finance',
    activationKey: '67890',
    system: 'Linux',
    bisRegId: 'BIS789012',
    companyName: 'FinCorp',
    online: false,
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.johnson@webservices.com',
    department: 'Development',
    activationKey: 'A1B2C3',
    system: 'macOS',
    bisRegId: 'BIS345678',
    companyName: 'WebServices Inc',
    online: true,
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@marketinghub.com',
    department: 'Marketing',
    activationKey: 'X5Y6Z7',
    system: 'Windows',
    bisRegId: 'BIS901234',
    companyName: 'Marketing Hub',
    online: true,
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.brown@fintech.com',
    department: 'Finance',
    activationKey: 'LMN456',
    system: 'Linux',
    bisRegId: 'BIS567890',
    companyName: 'FinTech Solutions',
    online: false,
  },
  {
    id: 6,
    name: 'Sophia Martinez',
    email: 'sophia.martinez@designstudio.com',
    department: 'Design',
    activationKey: 'DEF123',
    system: 'Windows',
    bisRegId: 'BIS012345',
    companyName: 'Creative Design Studio',
    online: true,
  },
  {
    id: 7,
    name: 'James Wilson',
    email: 'james.wilson@healthcare.org',
    department: 'Healthcare',
    activationKey: 'UVW789',
    system: 'Linux',
    bisRegId: 'BIS678901',
    companyName: 'Healthcare Solutions',
    online: false,
  },
  {
    id: 8,
    name: 'Oliver Garcia',
    email: 'oliver.garcia@retailmarket.com',
    department: 'Retail',
    activationKey: 'NOP456',
    system: 'Windows',
    bisRegId: 'BIS234567',
    companyName: 'Retail Market Corp',
    online: true,
  },
  {
    id: 9,
    name: 'Isabella Rodriguez',
    email: 'isabella.rodriguez@consultinggroup.com',
    department: 'Consulting',
    activationKey: 'RST890',
    system: 'macOS',
    bisRegId: 'BIS890123',
    companyName: 'Consulting Group',
    online: false,
  },
  {
    id: 10,
    name: 'William Johnson',
    email: 'william.johnson@startupworld.com',
    department: 'Entrepreneurship',
    activationKey: 'XYZ123',
    system: 'Linux',
    bisRegId: 'BIS345012',
    companyName: 'Startup World Inc',
    online: true,
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
  scrollbarThumbColor: '#888',
};

// Styled components for consistent UI
const PremiumButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '6px',
  padding: '6px 12px',
  textTransform: 'none',
  fontWeight: 'bold',
  height: '30px',
  minWidth: '80px',
  fontSize: '12px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  border: 'none',
  boxShadow: `0 3px 6px rgba(0, 0, 0, 0.1)`,
  background: variant === 'contained' ? themeColor.primary : 'transparent',
  color: variant === 'contained' ? theme.palette.common.white : themeColor.primary,
  border: variant === 'outlined' ? `1px solid ${themeColor.primary}` : 'none',
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

const DialogTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  textAlign: 'left', // Align text to the left
  color: themeColor.color,
}));

const AdminManagement = () => {
  const theme = useTheme();
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  // Handle row click to display user details
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setNewStatus(user.online ? 'Active' : 'Inactive'); // Set initial status
    setShowViewPopup(true);
  };

  // Close the user detail view popup
  const handleCloseViewPopup = () => {
    setShowViewPopup(false);
    setSelectedUser(null);
  };

  // Open password confirmation dialog
  const handleRequestUpdate = () => {
    setShowPasswordPopup(true);
  };

  // Close password confirmation dialog
  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
  };

  // Handle password input change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Confirm and update user status
  const handleConfirmUpdate = () => {
    if (password === 'your-secure-password') { // Replace this with your actual password validation
      // Update the user status in your data
      const updatedData = data.map((user) =>
        user.id === selectedUser.id ? { ...user, online: newStatus === 'Active' } : user
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

  // Handle search input change and filter data
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
    const filtered = data.filter((user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.bisRegId.toLowerCase().includes(searchTerm) ||
      user.companyName.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      <TitleTypography variant="h5">Admin Management</TitleTypography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 2,
          height: '40px', // Reduced height for search bar
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
          value={search}
          sx={{
            maxWidth: 400,
            height: '40px', // Reduced height for a more compact appearance
            '& .MuiOutlinedInput-root': {
              height: '40px', // Set the inner height for input
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
          placeholder="Search by Name, Email, REG ID or Company Name" // Placeholder text
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'auto',
          maxHeight: '400px',
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
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Activation Key</StyledTableCell>
              <StyledTableCell>System</StyledTableCell>
              <StyledTableCell>BIS REG ID</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredData.map((user) => (
              <StyledTableRow key={user.id} onClick={() => handleRowClick(user)}>
                <StyledTableCell>{user.name}</StyledTableCell>
                <StyledTableCell>{user.email}</StyledTableCell>
                <StyledTableCell>{user.department}</StyledTableCell>
                <StyledTableCell>{user.activationKey}</StyledTableCell>
                <StyledTableCell>{user.system}</StyledTableCell>
                <StyledTableCell>{user.bisRegId}</StyledTableCell>
                <StyledTableCell>{user.companyName}</StyledTableCell>
                <StyledTableCell>{user.online ? 'Active' : 'Inactive'}</StyledTableCell>
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
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
            User Details
          </Typography>
          {selectedUser && (
            <>
              <Table>
                <TableBody>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Name:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.name}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Email:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.email}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Department:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.department}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Activation Key:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.activationKey}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>System:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.system}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>BIS REG ID:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.bisRegId}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Company Name:</strong>
                    </DialogTableCell>
                    <DialogTableCell>{selectedUser.companyName}</DialogTableCell>
                  </TableRow>
                  <TableRow>
                    <DialogTableCell component="th" scope="row">
                      <strong>Status:</strong>
                    </DialogTableCell>
                    <DialogTableCell>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </DialogTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <PremiumButton onClick={handleRequestUpdate} variant="contained">
            Update Status
          </PremiumButton>
          <PremiumButton onClick={handleCloseViewPopup} variant="outlined">
            Close
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Password Popup */}
      <Dialog
        open={showPasswordPopup}
        onClose={handleClosePasswordPopup}
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Confirm Update
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Password"
            type={passwordVisible ? 'text' : 'password'}
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
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

export default AdminManagement;
