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
  DialogTitle,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/system';
import PasswordIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import APIConnection from '../../config.js';
import axios from 'axios';
import { Grid } from 'antd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
  fontSize: "15px",
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: "6px 8px",
  textAlign: "left",
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



// File upload component
const FileUploadField = ({ handleFileChange, fileName, label, name }) => (
  <>
    <Button
      variant="contained"
      component="label"
      startIcon={<UploadFileIcon />}
      sx={{ mt: 1, mr: 2 }}
    >
      Upload {label}
      <input type="file" hidden onChange={(event) => handleFileChange(event, name)} />
    </Button>
    {fileName && (
      <Typography variant="body2" sx={{ mt: 1 }}>
        {fileName}
      </Typography>
    )}
  </>
);

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


  // State variables for each file
  const [brFile, setBrFile] = useState(null);
  const [vatFile, setVatFile] = useState(null);
  const [form20File, setForm20File] = useState(null);

  const [brFileName, setBrFileName] = useState('');
  const [vatFileName, setVatFileName] = useState('');
  const [form20FileName, setForm20FileName] = useState('');

  // State variables to hold BR and VAT numbers
  const [brNumber, setBrNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');


  //partner category 

  const [partnerCategory, setPartnerCategory] = useState('');

  //api
  const getPartnerApplicationsapi = APIConnection.getPartnerApplicationsapi;
  const rejectPartnerApi = APIConnection.rejectPartnerApi;
  const validatePartnerApi = APIConnection.validatePartnerApi;
  const updatePartnerDataApi = APIConnection.updatePartnerRq;
  const backendUrl = APIConnection.backendUrl;


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

  const handleSubmitValidate = async () => {

    if (!partnerCategory) {
      setShowPasswordPopup(false);
      setShowDetailPopup(false);
      Swal.fire({
        icon: 'warning',
        title: 'Partner Category Required',
        text: 'Please select a partner category before validating.',
        confirmButtonColor: themeColor.warning,
        confirmButtonText: 'OK',
      });
      return; // Exit the function if category is not selected
    }
    setIsProcessing(true);
    try {
      const response = await axios.post(validatePartnerApi, {
        id: selectedPartner.id,
        password,
       category:partnerCategory
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
      statusFilter === 'All' || partner?.becomeStatusName === statusFilter;

    return matchesSearch && matchesStatus;
  });




  //File UPloading
  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      switch (fileType) {
        case 'brFile':
          setBrFile(file); // Update the state with the file object
          setBrFileName(file.name); // Set a separate state for file name
          break;
        case 'vatFile':
          setVatFile(file); // Update the state with the file object
          setVatFileName(file.name); // Set a separate state for file name
          break;
        case 'form20File':
          setForm20File(file); // Update the state with the file object
          setForm20FileName(file.name); // Set a separate state for file name
          break;
        default:
          break;
      }
    }
  };


  const handleUpdateClick = async () => {
    if (!selectedPartner) return;

    try {
      // Step 1: Create FormData object
      const formData = new FormData();

      // Step 2: Conditionally append the fields to FormData if they exist or have been modified
      formData.append('id', selectedPartner.id); // Always include the ID

      if (brNumber && brNumber !== selectedPartner.brNumber) {
        formData.append('brNumber', brNumber); // Append BR Number only if it's changed
      }

      if (vatNumber && vatNumber !== selectedPartner.vatNumber) {
        formData.append('vatNumber', vatNumber); // Append VAT Number only if it's changed
      }

      // Step 3: Append file fields only if they exist
      if (brFile) formData.append('brFile', brFile);
      if (vatFile) formData.append('vatFile', vatFile);
      if (form20File) formData.append('form20File', form20File);



      // Step 4: Send the form data to the backend using axios
      const response = await axios.put(updatePartnerDataApi, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Required if your server needs credentials (cookies)
      });

      // Step 5: Handle response
      if (response.status === 200) {
        handleCloseDetailPopup();
        fetchPartnerApplications();
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: response.data.message || 'The partner information was updated successfully!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else {
        throw new Error('Failed to update partner');
      }
    } catch (error) {
      // Step 6: Handle error
      console.error('Error updating partner:', error);
      handleCloseDetailPopup();
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the partner information. Please try again.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };




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
      {/* Detail view */}
      <Dialog
        open={showDetailPopup}
        onClose={handleCloseDetailPopup}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '600px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}

      >
        {/* <DialogTitle> Company Information</DialogTitle> */}
        <DialogContent>
          {selectedPartner && (
            <>
              {/* Form Filler Details Section */}
              <Typography variant="h5" sx={{ mb: 2, color: '#1F2937' }}>
                Form Filler Details
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={selectedPartner.personalName}
                sx={{ marginBottom: '12px', marginTop: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={selectedPartner.personalEmail}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Designation"
                variant="outlined"
                fullWidth
                value={selectedPartner.designation}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Mobile No"
                variant="outlined"
                fullWidth
                value={selectedPartner.personalMobile}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Department"
                variant="outlined"
                fullWidth
                value={selectedPartner.department}
                sx={{ marginBottom: '24px' }}
                InputProps={{ readOnly: true }}
              />

              {/* Company Information Section */}
              <Typography variant="h5" sx={{ mb: 2, color: '#1F2937' }}>
                Company Information
              </Typography>
              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                value={selectedPartner.companyName}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                value={selectedPartner.companyAddress}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                value={selectedPartner.companyCity}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Website Link"
                variant="outlined"
                fullWidth
                value={selectedPartner.companyWebsite}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={selectedPartner.companyEmail}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Mobile No"
                variant="outlined"
                fullWidth
                value={selectedPartner.companyMobile}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="WhatsApp No"
                variant="outlined"
                fullWidth
                value={selectedPartner.whatsappBusiness}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={selectedPartner.countryName}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="BR No"
                variant="outlined"
                fullWidth
                value={selectedPartner.brNumber}
                sx={{ marginBottom: '12px' }}
                InputProps={{
                  readOnly: selectedPartner.brNumber !== null,
                   // If empty, make it editable
                }}
                onChange={(e) => setBrNumber(e.target.value)}
              />

              {/* VAT No Field */}
              <TextField
                label="VAT No"
                variant="outlined"
                fullWidth
                value={selectedPartner.vatNumber}
                sx={{ marginBottom: '24px' }}
                InputProps={{
                  readOnly: selectedPartner.vatNumber !== null, // If empty, make it editable
                }}
                onChange={(e) => setVatNumber(e.target.value)}
              />

              {selectedPartner && (
                <>
                  <Typography variant="h5" sx={{ mb: 2, color: '#1F2937' }}>
                    Documents
                  </Typography>
                  {/* BR File Section */}
                  {selectedPartner.brFile ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ marginBottom: '12px' }}
                      onClick={() => window.open(`${backendUrl}/${sanitizeFilePath(selectedPartner.brFile)}`, '_blank')}
                      disabled={!selectedPartner.brFile}
                    >
                      View BR PDF
                    </Button>
                  ) : (
                    <FileUploadField handleFileChange={handleFileUpload} fileName={brFileName} label={<>BR Certificate <strong style={{ color: '#7a2300' }}>(Optional, PDF Only)</strong></>} name="brFile" />
                  )}

                  {/* VAT File Section */}
                  {selectedPartner.vatFile ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ marginBottom: '12px' }}
                      onClick={() => window.open(`${backendUrl}/${sanitizeFilePath(selectedPartner.vatFile)}`, '_blank')}
                      disabled={!selectedPartner.vatFile}
                    >
                      View VAT PDF
                    </Button>
                  ) : (
                    <FileUploadField handleFileChange={handleFileUpload} fileName={vatFileName} label={<>VAT Certificate <strong style={{ color: '#7a2300' }}>(Optional, PDF Only)</strong></>} name="vatFile" />
                  )}

                  {/* Form 20 File Section */}
                  {selectedPartner.form20File ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ marginBottom: '24px' }}
                      onClick={() => window.open(`${backendUrl}/${sanitizeFilePath(selectedPartner.form20File)}`, '_blank')}
                      disabled={!selectedPartner.form20File}
                    >
                      View Form 20 PDF
                    </Button>
                  ) : (
                    <FileUploadField handleFileChange={handleFileUpload} fileName={form20FileName} label={<>Form 20 Certificate <strong style={{ color: '#7a2300' }}>(Optional, PDF Only)</strong></>} name="form20File" />

                  )}
                </>
              )}

              {/* Director Information Section */}
              <Typography variant="h5" sx={{ mb: 2, color: '#1F2937', marginTop: '20px' }}>
                Director Information
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={selectedPartner.directorName}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={selectedPartner.directorEmail}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Mobile No"
                variant="outlined"
                fullWidth
                value={selectedPartner.directorMobile}
                sx={{ marginBottom: '12px' }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="WhatsApp No"
                variant="outlined"
                fullWidth
                value={selectedPartner.directorWhatsapp}
                sx={{ marginBottom: '24px' }}
                InputProps={{ readOnly: true }}
              />


              <Typography variant="h5" sx={{ mb: 2, color: '#1F2937' }}>
                Referred By
              </Typography>

              <TextField
                label="Channel Member"
                variant="outlined"
                fullWidth
                value={selectedPartner.referred_by}
                sx={{ marginBottom: '24px' }}
                InputProps={{ readOnly: true }}
              />
            </>
          )}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px 24px' }}>
          {selectedPartner && selectedPartner.becomeStatusName === 'Pending' && selectedPartner.brFile !== null && (
            <>
              <Button variant="outlined" color="error" onClick={handleRejectClick} sx={{ textTransform: 'none' }}>
                Reject
              </Button>
              <Button variant="contained" color="primary" onClick={handleValidateClick} sx={{ textTransform: 'none' }}>
                Validate
              </Button>
            </>
          )}

          <Button variant="contained" color="secondary" onClick={handleUpdateClick} sx={{ textTransform: 'none' }}>
            Update
          </Button>


          {/* {selectedPartner && selectedPartner.becomeStatusName === 'Reject'  && (
            <Button variant="contained" onClick={`handleReconsiderClick`} sx={{ textTransform: 'none' }}>
              Reconsider
            </Button>
          )} */}
          <Button variant="outlined" color="error" onClick={handleCloseDetailPopup} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
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

          {/* New Dropdown Field for Partner Category */}
          <FormControl fullWidth sx={{ marginBottom: '12px' }}>
            <InputLabel>Partner Category</InputLabel>
            <Select
              value={partnerCategory}
              onChange={(event) => setPartnerCategory(event.target.value)}
              label="Partner Category"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="1">Distributor</MenuItem>
              <MenuItem value="2">Reseller</MenuItem>
              <MenuItem value="3">Consultant</MenuItem>
            </Select>
          </FormControl>
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