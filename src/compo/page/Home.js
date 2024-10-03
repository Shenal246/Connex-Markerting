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
  useTheme,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PasswordIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';

// Define initial data for the table
const initialData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', department: 'IT', activationKey: 'XYZ123', system: 'Windows', bisRegId: 'BR123', companyName: 'TechCorp', online: true },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', department: 'HR', activationKey: 'ABC456', system: 'MacOS', bisRegId: 'BR456', companyName: 'BizWorld', online: false },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', department: 'Finance', activationKey: 'LMN789', system: 'Linux', bisRegId: 'BR789', companyName: 'FinTech', online: true },
  { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', department: 'Marketing', activationKey: 'PQR012', system: 'Windows', bisRegId: 'BR012', companyName: 'MarketX', online: false },
  { id: 5, name: 'Charlie Davis', email: 'charlie.davis@example.com', department: 'Sales', activationKey: 'STU345', system: 'MacOS', bisRegId: 'BR345', companyName: 'SalesCo', online: true },
];

const themeColor = {
  primary: '#0e4780',
  primaryDark: '#0a3a6e',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#0e4780',
  headerTextColor: '#ffffff',
  borderColor: '#0e4780',
  color: '#000000',
};

// Define styled components
const PremiumIconButton = styled('div')(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.1)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 'bold',
  height: '30px',
  minWidth: '80px',
  fontSize: '12px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  border: 'none',
  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
  background: variant === 'contained' ? themeColor.primary : 'transparent',
  color: variant === 'contained' ? theme.palette.common.white : themeColor.primary,
  border: variant === 'outlined' ? `2px solid ${themeColor.primary}` : 'none',
  '&:hover': {
    backgroundColor: variant === 'contained' ? themeColor.primaryDark : 'rgba(51, 51, 51, 0.1)',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  height: '30px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: themeColor.headerBg,
  color: themeColor.headerTextColor,
  position: 'sticky',
  top: 0,
  zIndex: 1,
  '& th': {
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '12px 16px',
    textAlign: 'left',
    borderRight: `1px solid ${themeColor.borderColor}`,
    background: themeColor.headerBg,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    color: themeColor.headerTextColor,
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#333',
  fontSize: '20px',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
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

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setNewStatus(user.online ? 'Active' : 'Inactive');
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
      const updatedData = data.map((user) =>
        user.id === selectedUser.id ? { ...user, online: newStatus === 'Active' } : user
      );
      setData(updatedData);
      setFilteredData(updatedData);
      setShowPasswordPopup(false);
      handleCloseViewPopup();
      Swal.fire('Success!', 'Status updated successfully!', 'success');
    } else {
      Swal.fire('Error!', 'Incorrect password. Please try again.', 'error');
    }
  };

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

  return (
    <Box sx={{ padding: 3 }}>
      <TitleTypography variant="h4">
        Admin Management
      </TitleTypography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, height: '50px' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
          value={search}
          sx={{ maxWidth: 400, height: '35px' }} // Adjusted height and width
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search by REG ID or Company Name" // Placeholder text
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
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
              <StyledTableCell>Actions</StyledTableCell>
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
                <StyledTableCell>
                  <PremiumIconButton onClick={() => handleRowClick(user)}>
                    <VisibilityIcon color="primary" />
                  </PremiumIconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* View User Popup */}
      <Dialog open={showViewPopup} onClose={handleCloseViewPopup} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6">User Details</Typography>
            <Typography variant="body1">Name: {selectedUser?.name}</Typography>
            <Typography variant="body1">Email: {selectedUser?.email}</Typography>
            <Typography variant="body1">Department: {selectedUser?.department}</Typography>
            <Typography variant="body1">Activation Key: {selectedUser?.activationKey}</Typography>
            <Typography variant="body1">System: {selectedUser?.system}</Typography>
            <Typography variant="body1">BIS REG ID: {selectedUser?.bisRegId}</Typography>
            <Typography variant="body1">Company Name: {selectedUser?.companyName}</Typography>
            <FormControl fullWidth margin="normal">
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleRequestUpdate}
              fullWidth
              sx={{ mt: 2 }}
            >
              Update Status
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Password Confirmation Popup */}
      <Dialog open={showPasswordPopup} onClose={handleClosePasswordPopup} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6">Password Confirmation</Typography>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PasswordIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmUpdate}
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirm
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordPopup} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagement;
