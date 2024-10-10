// src/compo/page/PromotionMgt.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Zoom,
  DialogTitle,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import APIConnection from "../../config";
import axios from "axios";
const themeColor = {
  primary: "#444",
  primaryDark: "#666",
  success: "#4caf50",
  error: "#f44336",
  headerBg: "#444",
  headerTextColor: "#ffffff",
  borderColor: "#777",
  color: "#000000",
  rowHoverColor: "#ebebeb",
  rowAlternateColor: "#f5f5f5",
  rowHoverHighlight: "#e0f7fa",
  activeStatusColor: "#4caf50",
  inactiveStatusColor: "#f44336",
};

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "6px",
  padding: "6px 12px",
  textTransform: "none",
  fontWeight: "bold",
  height: "30px",
  minWidth: "80px",
  fontSize: "12px",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  cursor: "pointer",
  border: "none",
  boxShadow: `0 3px 6px rgba(0, 0, 0, 0.1)`,
  background: variant === "contained" ? themeColor.primary : "transparent",
  color:
    variant === "contained" ? theme.palette.common.white : themeColor.primary,
  border: variant === "outlined" ? `1px solid ${themeColor.primary}` : "none",
  "&:hover": {
    backgroundColor:
      variant === "contained"
        ? themeColor.primaryDark
        : "rgba(51, 51, 51, 0.05)",
    transform: "scale(1.03)",
  },
  "&:active": {
    transform: "scale(0.97)",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: "6px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  cursor: "pointer",
  color: theme.palette.common.white,
  backgroundColor: themeColor.success,
  boxShadow: `0 3px 6px rgba(0, 0, 0, 0.2)`,
  "&:hover": {
    backgroundColor: themeColor.primaryDark,
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "16px",
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: "6px 8px",
  textAlign: "left",
  backgroundColor: themeColor.rowAlternateColor,
  color: themeColor.color,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  height: "40px",
  transition: "background-color 0.3s ease",
  "&:nth-of-type(odd)": {
    backgroundColor: "#ffffff",
  },
  "&:hover": {
    backgroundColor: themeColor.rowHoverHighlight,
    boxShadow: `0px 2px 4px rgba(0,0,0,0.05)`,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: themeColor.primary,
  color: themeColor.headerTextColor,
  position: "sticky",
  top: 0,
  zIndex: 2,
  "& th": {
    fontSize: "13px",
    fontWeight: "bold",
    padding: "10px 12px",
    textAlign: "left",
    borderRight: `1px solid ${themeColor.borderColor}`,
    background: themeColor.primary,
    color: themeColor.headerTextColor,
    "&:last-child": {
      borderRight: "none",
    },
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: themeColor.headerTextColor,
  fontSize: "18px",
  marginBottom: theme.spacing(2),
  textAlign: "center",
  background: themeColor.headerBg,
  width: "50%",
  padding: "6px 0",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "6px",
  boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
  position: "sticky",
  top: 0,
  zIndex: 3,
}));

const DetailTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: themeColor.color,
  fontSize: "16px",
  marginBottom: theme.spacing(1.5),
  textAlign: "center",
}));

const DetailTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: "8px",
  fontSize: "12px",
  color: themeColor.color,
  "&:first-of-type": {
    fontWeight: "bold",
    color: themeColor.primaryDark,
  },
}));

const BlinkingDot = styled("span")({
  display: "inline-block",
  height: "8px",
  width: "8px",
  borderRadius: "50%",
  marginRight: "5px",
  animation: "blink-animation 0.5s infinite",
  "@keyframes blink-animation": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
});


const PromotionMgt = () => {
  const [promotionData, setPromotionData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [promotiontypeData, setPromotiontypeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [showAddPromotionPopup, setShowAddPromotionPopup] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    altDescription: "",
    details: "",
    uploadedDate: new Date().toISOString().split("T")[0],
    status: "",
    imageUrl: "",
    productid: "",
    expireDate: "",
    promotiontypeid: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // API endpoints
  const getPromoapi = APIConnection.getpromoapi;
  const getProductsapi = APIConnection.getproductsIdapi;
  const addPromoapi = APIConnection.addPromoapi;
  const updatePromoapi = APIConnection.updatePromoapi;
  const getpromotiontypeapi = APIConnection.getpromotiontypeapi;

  const backendUrl = APIConnection.backendUrl;



  // Fetch Promo
  const fetchPromotion = async () => {
    try {
      const response = await axios.get(getPromoapi, {
        withCredentials: true,
      });
      setPromotionData(response.data);
    } catch (error) {
      console.error("Error loading Promotions:", error);
    }
  };

  // Fetch Promo
  const fetchPromotiontypes = async () => {
    try {
      const response = await axios.get(getpromotiontypeapi, {
        withCredentials: true,
      });
      setPromotiontypeData(response.data);
    } catch (error) {
      console.error("Error loading Promotion Types:", error);
    }
  };

  // Fetch Products
  const fetchProducNames = async () => {
    try {
      const response = await axios.get(getProductsapi, {
        withCredentials: true,
      });
      setProductData(response.data);
    } catch (error) {
      console.error("Error loading Promotions:", error);
    }
  };

  useEffect(() => {
    fetchPromotion();
    fetchProducNames();
    fetchPromotiontypes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRowClick = (promotion) => {
    setSelectedPromotion(promotion);
    setShowPromotionPopup(true);
  };

  const handleClosePromotionPopup = () => {
    setShowPromotionPopup(false);
    setSelectedPromotion(null);
  };

  const handleCloseAddPromotionPopup = () => {
    setShowAddPromotionPopup(false);
    setNewPromotion({
      altDescription: "",
      details: "",
      uploadedDate: "",
      status: "inactive",
      imageUrl: "",
      productid: "",
    });
  };

  const handleStatusChange = (e) => {
    setSelectedPromotion({ ...selectedPromotion, status: e.target.value });
  };

  const handleAddPromotionStatusChange = (e) => {
    setNewPromotion({ ...newPromotion, status: e.target.value });
  };
  // handleAddPromotionProductChange

  const handleAddPromotionProductChange = (e) => {
    setNewPromotion({ ...newPromotion, status: e.target.value });
  };



  const handleUpdate = async () => {
    // Find the promotion in filteredPromotionData with the same id as selectedPromotion
    const matchedPromotion = filteredPromotionData.find(
      (promotion) => promotion.id === selectedPromotion.id
    );

    if (matchedPromotion) {
      // Compare the status_id of selectedPromotion and matchedPromotion
      if (selectedPromotion.status_id !== matchedPromotion.status_id) {
        setShowPromotionPopup(false);
        Swal.fire({
          icon: "info",
          title: "Status Changed",
          text: `Status has changed for promotion ID ${selectedPromotion.id}. Proceeding with update...`,
          confirmButtonColor: themeColor.success,
        });

        setIsProcessing(true);

        try {
          // Prepare the payload with the id and status_id only
          const payload = {
            id: selectedPromotion.id,
            status_id: selectedPromotion.status_id,
          };

          // Make the PUT request to update the promotion on the server
          const response = await axios.put(updatePromoapi, payload, {
            withCredentials: true,
          });

          if (response.status === 200) {
            // Update the promotion data in the state
            const updatedData = promotionData.map((promotion) =>
              promotion.id === selectedPromotion.id ? { ...promotion, status_id: selectedPromotion.status_id } : promotion
            );
            setPromotionData(updatedData);

            setShowPromotionPopup(false);
            Swal.fire({
              icon: "success",
              title: "Promotion Updated!",
              text: "The promotion status has been successfully updated.",
              confirmButtonColor: themeColor.success,
              confirmButtonText: "OK",
            });
          } else {
            setShowPromotionPopup(false);
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: "There was an error updating the promotion. Please try again.",
              confirmButtonColor: themeColor.error,
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error updating promotion:", error);
          setShowPromotionPopup(false);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was an error updating the promotion. Please try again.",
            confirmButtonColor: themeColor.error,
            confirmButtonText: "OK",
          });
        } finally {
          setIsProcessing(false);
        }
      } else {
        setShowPromotionPopup(false);
        Swal.fire({
          icon: "warning",
          title: "No Changes Detected",
          text: "No changes in status. Update not required.",
          confirmButtonColor: themeColor.warning,
        });
      }
    } else {
      setShowPromotionPopup(false);
      Swal.fire({
        icon: "error",
        title: "Promotion Not Found",
        text: "Promotion not found in filtered data.",
        confirmButtonColor: themeColor.error,
      });
    }
  };




  const handleAddPromotion = async () => {
    if (newPromotion.altDescription && newPromotion.details && newPromotion.uploadedDate && newPromotion.productid && newPromotion.status && newPromotion.promotiontypeid && newPromotion.imageFile) {
      setIsProcessing(true);

      const formData = new FormData();
      formData.append('altDescription', newPromotion.altDescription);
      formData.append('details', newPromotion.details);
      formData.append('uploadedDate', newPromotion.uploadedDate);
      formData.append('expireDate', newPromotion.expireDate);
      formData.append('status', newPromotion.status === "Enable" ? 1 : 2);
      formData.append('productid', newPromotion.productid);
      formData.append('promotiontypeid', newPromotion.promotiontypeid);
      formData.append('image', newPromotion.imageFile);  // Include the image file in FormData

      try {
        const response = await axios.post(addPromoapi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setShowAddPromotionPopup(false);
          fetchPromotion();
          Swal.fire({
            icon: "success",
            title: "Promotion Added!",
            text: "The new promotion has been successfully added.",
            confirmButtonColor: themeColor.success,
            confirmButtonText: "OK",
          });

          // Reset the newPromotion state
          setNewPromotion({
            altDescription: "",
            details: "",
            uploadedDate: "",
            status: "",
            imageUrl: "",
            productid: "",
            expireDate: "",
            promotiontypeid: "",
            imageFile: null
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Add Failed",
            text: "There was an error adding the promotion. Please try again.",
            confirmButtonColor: themeColor.error,
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error adding promotion:", error);
        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text: "There was an error adding the promotion. Please try again.",
          confirmButtonColor: themeColor.error,
          confirmButtonText: "OK",
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields and select an image.",
        confirmButtonColor: themeColor.error,
        confirmButtonText: "OK",
      });
    }
  };



  const filteredPromotionData = promotionData.filter((promotion) =>

    promotion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the File object directly in the state
      setNewPromotion(prevState => ({
        ...prevState,
        imageFile: file  // Store the file object
      }));
    }
  };


  const calculateAging = (uploadedDate) => {
    const currentDate = dayjs();
    const uploaded = dayjs(uploadedDate);
    return currentDate.diff(uploaded, "day");
  };





  return (
    <Box sx={{ padding: 2, overflowY: "hidden", position: "relative" }}>
      <TitleTypography variant="h5">Promotion Management</TitleTypography>
      <AddButton
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setShowAddPromotionPopup(true)}
      >
        Add New Promotion
      </AddButton>
      <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Search Promotions"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflow: "auto",
          height: "430px",
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Details</StyledTableCell>
              <StyledTableCell>Uploaded Date</StyledTableCell>
              <StyledTableCell>Expire Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Aging</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredPromotionData.map((promotion, index) => (
              <StyledTableRow
                key={promotion.id}
                onClick={() => handleRowClick(promotion)}
              >
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{promotion.title}</StyledTableCell>
                <StyledTableCell>{promotion.details}</StyledTableCell>
                <StyledTableCell>{promotion.upload_date}</StyledTableCell>
                <StyledTableCell>{promotion.expire_date}</StyledTableCell>
                <StyledTableCell>
                  {promotion.status_id === 1 ? (
                    <Typography
                      sx={{
                        color: themeColor.activeStatusColor,
                        fontWeight: "bold",
                      }}
                    >
                      <BlinkingDot
                        style={{
                          backgroundColor: themeColor.activeStatusColor,
                        }}
                      />
                      Enable
                    </Typography>
                  ) : (
                    <Typography sx={{ color: themeColor.inactiveStatusColor }}>
                      <BlinkingDot
                        style={{
                          backgroundColor: themeColor.inactiveStatusColor,
                        }}
                      />
                      Disable
                    </Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {calculateAging(promotion.upload_date)} days
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Promotion Detail Popup */}
      <Dialog
        open={showPromotionPopup}
        onClose={handleClosePromotionPopup}
        PaperProps={{
          style: {
            overflow: "hidden",
            width: "500px",
            borderRadius: "8px",
            boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle>Promotion</DialogTitle>
        <DialogContent>
          {selectedPromotion && (
            <>
              {selectedPromotion.proimage && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "15px",
                  }}
                >
                  <img
                    src={`${backendUrl}${selectedPromotion.proimage}`}
                    alt={selectedPromotion.altDescription}
                    style={{
                      height: "auto",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* <TextField
            label="ALT Description"
            variant="outlined"
            fullWidth
            value={selectedPromotion.altDescription}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                altDescription: e.target.value,
              })
            }
          /> */}
                <TextField
                  label="Details"
                  variant="outlined"
                  fullWidth
                  multiline
                  value={selectedPromotion.details}
                // onChange={(e) =>
                //   setSelectedPromotion({
                //     ...selectedPromotion,
                //     details: e.target.value,
                //   })
                // }
                />

                {/* Expire Date Field */}
                <TextField
                  label="Expire Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={selectedPromotion.expire_date || ""}
                // onChange={(e) =>
                //   setSelectedPromotion({
                //     ...selectedPromotion,
                //     expire_date: e.target.value,
                //   })
                // }
                />

                {/* Uploaded Date Field */}
                <TextField
                  label="Uploaded Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={selectedPromotion.upload_date || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />

                {/* Status Selector with FormControl and InputLabel */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={selectedPromotion.status_id === 1 ? "Enable" : "Disable"}
                    onChange={(e) =>
                      setSelectedPromotion({
                        ...selectedPromotion,
                        status_id: e.target.value === "Enable" ? 1 : 2,
                      })
                    }
                    fullWidth
                  >
                    <MenuItem value="Enable">Enable</MenuItem>
                    <MenuItem value="Disable">Disable</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleClosePromotionPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton
            variant="contained"
            onClick={handleUpdate}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={20} /> : "Update"}
          </PremiumButton>
        </DialogActions>
      </Dialog>






      {/* Add New Promotion Popup */}
      <Dialog
        open={showAddPromotionPopup}
        onClose={handleCloseAddPromotionPopup}
        PaperProps={{
          style: {
            overflow: "hidden",
            width: "500px",
            borderRadius: "8px",
            boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle>Add New Promotion</DialogTitle>
        <DialogContent>
          {/* Product Selector */}
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px", marginTop: "12px" }}>
            <InputLabel>Select Product</InputLabel>
            <Select
              value={newPromotion.productid || ""}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, productid: e.target.value })
              }
              displayEmpty
              label="Select Product"
            >
              {productData.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={newPromotion.altDescription}
            onChange={(e) =>
              setNewPromotion({
                ...newPromotion,
                altDescription: e.target.value,
              })
            }
            sx={{ marginBottom: "12px" }}
          />

          <TextField
            label="Details"
            variant="outlined"
            fullWidth
            multiline
            value={newPromotion.details}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, details: e.target.value })
            }
            sx={{ marginBottom: "12px" }}
          />

          {/* Uploaded Date Field - Set to today's date and read-only */}
          <TextField
            label="Uploaded Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={new Date().toISOString().split('T')[0]} // Sets today's date in 'YYYY-MM-DD' format
            InputProps={{ readOnly: true }}
            sx={{ marginBottom: "12px" }}
          />

          {/* Expire Date Field */}
          <TextField
            label="Expire Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newPromotion.expireDate || ""}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, expireDate: e.target.value })
            }
            sx={{ marginBottom: "12px" }}
          />

          {/* Promotion type Selector */}
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px", marginTop: "12px" }}>
            <InputLabel>Select Promotion Type</InputLabel>
            <Select
              value={newPromotion.promotiontypeid || ""}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, promotiontypeid: e.target.value })
              }
              displayEmpty
              label="Promotion Type"
            >
              {promotiontypeData.map((promotiontype) => (
                <MenuItem key={promotiontype.id} value={promotiontype.id}>
                  {promotiontype.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Selector with Label */}
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newPromotion.status || ""}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, status: e.target.value })
              }
              displayEmpty
              label="Status"
            >

              <MenuItem value="Enable">Enable</MenuItem>
              <MenuItem value="Disable">Disable</MenuItem>
            </Select>
          </FormControl>

          {/* Image Upload */}
          <InputLabel>Upload Image ( Less than 1.5MB )</InputLabel>
          <input
            type="file"
            accept="image/*"
            onChange={
              (e) =>
                handleImageUpload(e, (imageUrl) =>
                  setNewPromotion({ ...newPromotion, imageUrl })
                )
            }
            style={{ marginBottom: "12px" }}
          />
          {/* Image Preview in Add New Promotion Popup */}
          {newPromotion.imageFile && (
            <img
              src={URL.createObjectURL(newPromotion.imageFile)}
              alt="Promotion"
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "15px"
              }}
            />
          )}

        </DialogContent>

        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseAddPromotionPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleAddPromotion}>
            Add Promotion
          </PremiumButton>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default PromotionMgt;
