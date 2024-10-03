import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Zoom,
  Slide,
} from '@mui/material';
import { styled } from '@mui/system';
import PasswordIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import APIConnection from '../../config.js';
import axios from 'axios';

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  warning: '#FFA500',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#ebebeb',
  rowAlternateColor: '#f5f5f5',
  rowHoverHighlight: '#e0f7fa',
};

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
  fontSize: '12px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '6px 8px',
  textAlign: 'center',
  backgroundColor: themeColor.rowAlternateColor,
  color: themeColor.color,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  height: '40px',
  transition: 'background-color 0.3s ease',
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffffff',
  },
  '&:hover': {
    backgroundColor: themeColor.rowHoverHighlight,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: themeColor.primary,
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
    background: themeColor.primary,
    color: themeColor.headerTextColor,
    '&:last-child': {
      borderRight: 'none',
    },
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.headerTextColor,
  fontSize: '18px',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  background: themeColor.headerBg,
  width: '50%',
  padding: '6px 0',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '6px',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 3,
}));

const DetailTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.color,
  fontSize: '16px',
  marginBottom: theme.spacing(1.5),
  textAlign: 'center',
}));

const DetailTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  fontSize: '12px',
  color: themeColor.color,
  '&:first-of-type': {
    fontWeight: 'bold',
    color: themeColor.primaryDark,
  },
}));

const PartnerMgt = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showReconsiderPopup, setShowReconsiderPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState('');


  //api
  const getPartnerApplicationsapi = APIConnection.getPartnerApplicationsapi;
  const rejectPartnerApi = APIConnection.rejectPartnerApi;
  const validatePartnerApi = APIConnection.validatePartnerApi;
  // const backendUrl = 'http://192.168.13.218:3000'; // Your backend's base URL
  const backendUrl = APIConnection.backendUrl; // Your backend's base URL

  const sanitizeFilePath = (filePath) => {
    if (!filePath) return '';
    return filePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
  };

  const fetchPartnerApplications = async () => {
    try {
      const response = await axios.get(getPartnerApplicationsapi, { withCredentials: true });
      setData(response.data);
      
    } catch (error) {
      console.error('Error fetching partner applications:', error);
    }
  };

  useEffect(() => {
    fetchPartnerApplications();
  }, []);

  const handleRowClick = (partner) => {
    setSelectedPartner(partner);
    setShowDetailPopup(true);
  };

  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedPartner(null);
  };

  const handleRejectClick = () => {
    setCurrentAction('reject');
    setShowReconsiderPopup(true);
  };

  const handleValidateClick = () => {
    setCurrentAction('validate');
    setShowPasswordPopup(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmitReject = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(rejectPartnerApi, {
        id: selectedPartner.id,
        password,
        note
      },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowReconsiderPopup(false);
        setShowDetailPopup(false);
        fetchPartnerApplications();
        Swal.fire({
          icon: 'success',
          title: 'Partner Rejected',
          text: 'The partner was successfully rejected.',
          confirmButtonColor: themeColor.success,
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reject the partner.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    } finally {
      setIsProcessing(false);
      setPassword('');
      setNote('');
    }
  };

  const
    handleSubmitValidate = async () => {
      setIsProcessing(true);
      try {
        const response = await axios.post(validatePartnerApi, {
          id: selectedPartner.id,
          password,
        },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setShowPasswordPopup(false);
          setShowDetailPopup(false);
          Swal.fire({
            icon: 'success',
            title: response.data.message,
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });
          fetchPartnerApplications();
        }

        if (response.status === 210) {
          setShowPasswordPopup(false);
          setShowDetailPopup(false);
          Swal.fire({
            icon: 'error',
            title: 'Already Exists Director details',
            text: response.message,
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        setIsProcessing(false);
        setPassword('');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to validate the partner.',
          confirmButtonColor: themeColor.error,
          confirmButtonText: 'OK',
        });
      } finally {
        setIsProcessing(false);
        setPassword('');
      }
    };

  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
    setPassword('');
  };

  const handleCloseReconsiderPopup = () => {
    setShowReconsiderPopup(false);
    setPassword('');
    setNote('');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredData = data.filter((partner) => {

    const matchesSearch =
      partner.companyName.toLowerCase().includes(searchQuery) ||
      partner.companyEmail.toLowerCase().includes(searchQuery) ||
      partner.companyMobile.includes(searchQuery) ||
      partner.directorName.toLowerCase().includes(searchQuery);

    const matchesStatus =
      statusFilter === 'All' || partner?.becomeStatusName == statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ padding: 2, overflowY: 'hidden' }}>
      <TitleTypography variant="h5">Partner Management</TitleTypography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '40%' }}
        />
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{ width: '20%' }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'auto',
          height: '450px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile No</StyledTableCell>
              <StyledTableCell>BR NO</StyledTableCell>
              <StyledTableCell>VAT NO</StyledTableCell>
              <StyledTableCell>Director Name</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredData.map((partner, index) => (
              <StyledTableRow
                key={partner.id}
                onClick={() => handleRowClick(partner)}
              >
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{partner.companyName}</StyledTableCell>
                <StyledTableCell>{partner.companyAddress}</StyledTableCell>
                <StyledTableCell>{partner.companyEmail}</StyledTableCell>
                <StyledTableCell>{partner.companyMobile}</StyledTableCell>
                <StyledTableCell>{partner.brNumber}</StyledTableCell>
                <StyledTableCell>{partner.vatNumber}</StyledTableCell>
                <StyledTableCell>{partner.directorName}</StyledTableCell>
                <StyledTableCell
                  sx={{
                    color:
                      partner.becomeStatusId === 2
                        ? themeColor.success
                        : partner.becomeStatusId === 3
                          ? themeColor.error
                          : partner.becomeStatusId === 1
                            ? themeColor.warning
                            : themeColor.color,
                    fontWeight: partner.becomeStatusId === 1 ? 'bold' : 'normal',
                  }}
                >
                  {partner.becomeStatusName}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={showDetailPopup}
        onClose={handleCloseDetailPopup}
        PaperProps={{
          style: {
            width: '600px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          {selectedPartner && (
            <>
              <DetailTypography variant="h6">
                Form Filler Details
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.personalName}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Email:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.personalEmail}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Designation:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.designation}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Mobile No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.personalMobile}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Department:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.department}
                    </DetailTableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <DetailTypography variant="h6">
                Company Information
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Company Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.companyName}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Address:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.companyAddress}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>City:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.companyCity}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Website Link:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.companyWebsite}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Email:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.companyEmail}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Mobile No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.companyMobile}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>WhatsApp No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.whatsappBusiness}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Country:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.countryName}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>BR No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.brNumber}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>VAT No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.vatNumber}
                    </DetailTableCell>
                  </TableRow>

                  <TableRow>
                    <DetailTableCell>Company BR PDF:</DetailTableCell>
                    <DetailTableCell>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          window.open(`${backendUrl}/${sanitizeFilePath(selectedPartner.brFile)}`, '_blank')
                        }
                        disabled={!selectedPartner.brFile} // Disable button if no file is available
                      >
                        View BR PDF
                      </Button>
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Company VAT PDF:</DetailTableCell>
                    <DetailTableCell>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          window.open(`${backendUrl}/${sanitizeFilePath(selectedPartner.vatFile)}`, '_blank')}
                        disabled={!selectedPartner.vatFile}
                      >
                        View VAT PDF
                      </Button>
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Form 20 PDF:</DetailTableCell>
                    <DetailTableCell>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          window.open(`${backendUrl}/${sanitizeFilePath(selectedPartner.form20File)}`, '_blank')}
                        disabled={!selectedPartner.form20File}
                      >
                        View Form 20 PDF
                      </Button>
                    </DetailTableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <DetailTypography variant="h6">
                Director Information
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.directorName}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Email:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.directorEmail}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Mobile No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.directorMobile}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>WhatsApp No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedPartner.directorWhatsapp}
                    </DetailTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedPartner && selectedPartner.becomeStatusName === 'Pending' && (
            <>
              <PremiumButton
                variant="outlined"
                color="error"
                onClick={handleRejectClick}
              >
                Reject
              </PremiumButton>
              <PremiumButton
                variant="contained"
                onClick={handleValidateClick}
              >
                Validate
              </PremiumButton>
            </>
          )}
          {selectedPartner && selectedPartner.status === 'Reject' && (
            <PremiumButton
              variant="contained"
            // onClick={handleReconsiderClick}
            >
              Reconsider
            </PremiumButton>
          )}
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseDetailPopup}
          >
            Cancel
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Password and Note Popup for Reject */}
      <Dialog
        open={showReconsiderPopup && currentAction === 'reject'}
        onClose={handleCloseReconsiderPopup}
        PaperProps={{
          style: {
            width: '400px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
      >
        <DialogContent>
          <DetailTypography variant="h6">Reject Partner</DetailTypography>
          <TextField
            autoFocus
            fullWidth
            label="Password"
            type={passwordVisible ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{ marginBottom: '12px' }}
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
          <TextField
            fullWidth
            label="Note"
            variant="outlined"
            value={note}
            onChange={handleNoteChange}
            sx={{ marginBottom: '12px' }}
            multiline
            rows={3}
          />
          {isProcessing && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseReconsiderPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleSubmitReject}>
            Submit
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Password Popup for Validate */}
      <Dialog
        open={showPasswordPopup && currentAction === 'validate'}
        onClose={handleClosePasswordPopup}
        PaperProps={{
          style: {
            width: '300px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
      >
        <DialogContent>
          <DetailTypography variant="h6">Validate Partner</DetailTypography>
          <TextField
            autoFocus
            fullWidth
            label="Password"
            type={passwordVisible ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{ marginBottom: '12px' }}
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
          {isProcessing && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleClosePasswordPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleSubmitValidate}>
            Submit
          </PremiumButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerMgt;