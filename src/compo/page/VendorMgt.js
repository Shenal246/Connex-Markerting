// src/compo/page/VendorMgt.js

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



const VendorMgt = () => {
    const [vendorData, setVendorData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [status, setStatus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showVendorPopup, setShowVendorPopup] = useState(false);
    const [showAddVendorPopup, setShowAddVendorPopup] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: "",
        status: "",
        imageUrl: ""
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // API endpoints
    const getPromoapi = APIConnection.getpromoapi;
    const getProductsapi = APIConnection.getproductsapi;
    const addVendorapi = APIConnection.addVendorapi;
    const updateVendorapi = APIConnection.updateVendorapi;

    const getstatusapi = APIConnection.getstatusapi;
    const getVendorsapi = APIConnection.getVendorsapi;
    const backendUrl = APIConnection.backendUrl;

    // Fetch Promo
    const fetchVendor = async () => {
        try {
            const response = await axios.get(getVendorsapi, {
                withCredentials: true,
            });
            setVendorData(response.data);
        } catch (error) {
            console.error("Error loading Vendors:", error);
        }
    };

    // Fetch Promo
    const fetchStatus = async () => {
        try {
            const response = await axios.get(getstatusapi, {
                withCredentials: true,
            });
            setStatus(response.data);

        } catch (error) {
            console.error("Error loading Vendor Types:", error);
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
            console.error("Error loading Vendors:", error);
        }
    };

    useEffect(() => {
        fetchVendor();
        fetchProducNames();
        fetchStatus();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRowClick = (vendor) => {
        setSelectedVendor(vendor);
        setShowVendorPopup(true);
    };

    const handleCloseVendorPopup = () => {
        setShowVendorPopup(false);
        setSelectedVendor(null);
    };

    const handleCloseAddVendorPopup = () => {
        setShowAddVendorPopup(false);
        setNewVendor({
            name: "",
            status: "",
            imageUrl: ""
        });
    };

    const handleStatusChange = (e) => {
        setSelectedVendor({ ...selectedVendor, status: e.target.value });
    };



    const handleUpdate = async () => {
        // Find the vendor in filteredVendorData with the same id as selectedVendor
        const matchedVendor = filteredVendorData.find(
            (vendor) => vendor.id === selectedVendor.id
        );

        if (matchedVendor) {
            // Compare the status_id of selectedVendor and matchedVendor
            if (selectedVendor.status_id !== matchedVendor.status_id) {
                setShowVendorPopup(false);
                Swal.fire({
                    icon: "info",
                    title: "Status Changed",
                    text: `Status has changed for vendor ID ${selectedVendor.id}. Proceeding with update...`,
                    confirmButtonColor: themeColor.success,
                });

                setIsProcessing(true);

                try {
                    // Prepare the payload with the id and status_id only
                    const payload = {
                        id: selectedVendor.id,
                        status_id: selectedVendor.status_id,
                    };

                    // Make the PUT request to update the vendor on the server
                    const response = await axios.put(updateVendorapi, payload, {
                        withCredentials: true,
                    });

                    if (response.status === 200) {
                        // Update the vendor data in the state
                        const updatedData = vendorData.map((vendor) =>
                            vendor.id === selectedVendor.id ? { ...vendor, status_id: selectedVendor.status_id } : vendor
                        );
                        setVendorData(updatedData);

                        setShowVendorPopup(false);
                        Swal.fire({
                            icon: "success",
                            title: "Vendor Updated!",
                            text: "The vendor status has been successfully updated.",
                            confirmButtonColor: themeColor.success,
                            confirmButtonText: "OK",
                        });
                    } else {
                        setShowVendorPopup(false);
                        Swal.fire({
                            icon: "error",
                            title: "Update Failed",
                            text: "There was an error updating the vendor. Please try again.",
                            confirmButtonColor: themeColor.error,
                            confirmButtonText: "OK",
                        });
                    }
                } catch (error) {
                    console.error("Error updating vendor:", error);
                    setShowVendorPopup(false);
                    Swal.fire({
                        icon: "error",
                        title: "Update Failed",
                        text: "There was an error updating the vendor. Please try again.",
                        confirmButtonColor: themeColor.error,
                        confirmButtonText: "OK",
                    });
                } finally {
                    setIsProcessing(false);
                }
            } else {
                setShowVendorPopup(false);
                Swal.fire({
                    icon: "warning",
                    title: "No Changes Detected",
                    text: "No changes in status. Update not required.",
                    confirmButtonColor: themeColor.warning,
                });
            }
        } else {
            setShowVendorPopup(false);
            Swal.fire({
                icon: "error",
                title: "Vendor Not Found",
                text: "Vendor not found in filtered data.",
                confirmButtonColor: themeColor.error,
            });
        }
    };

    const handleAddVendor = async () => {
        if (newVendor.name && newVendor.status && newVendor.imageFile) {
            setIsProcessing(true);

            // Create a FormData object to hold the new vendor data
            const formData = new FormData();
            formData.append("name", newVendor.name); // Vendor name
            formData.append("status", newVendor.status); // Vendor status
            formData.append("image", newVendor.imageFile); // Vendor image file

            try {
                // Send the FormData to the backend using axios
                const response = await axios.post(addVendorapi, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set the proper content type
                    },
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setShowAddVendorPopup(false);
                    fetchVendor(); // Fetch updated vendor data
                    Swal.fire({
                        icon: "success",
                        title: "Vendor Added!",
                        text: "The new vendor has been successfully added.",
                        confirmButtonColor: themeColor.success,
                        confirmButtonText: "OK",
                    });

                    // Reset the newVendor state
                    setNewVendor({
                        name: "",
                        status: "",
                        imageFile: null,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Add Failed",
                        text: "There was an error adding the vendor. Please try again.",
                        confirmButtonColor: themeColor.error,
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                setShowAddVendorPopup(false);
                console.error("Error adding vendor:", error);
                Swal.fire({
                    icon: "error",
                    title: "Add Vendor Failed",
                    text: error.response.data.message,
                    confirmButtonColor: themeColor.error,
                    confirmButtonText: "OK",
                });
            } finally {
                setIsProcessing(false);
            }
        } else {
            setShowAddVendorPopup(false);

            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "Please fill in all required fields.",
                confirmButtonColor: themeColor.error,
                confirmButtonText: "OK",
            });
        }
    };



    const filteredVendorData = vendorData.filter((vendor) =>

        vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // Capture the selected file
        if (file) {
            setNewVendor((prevState) => ({
                ...prevState,
                imageFile: file, // Save the file directly in the state
            }));
        }
    };


    const calculateAging = (uploadedDate) => {
        const currentDate = dayjs();
        const uploaded = dayjs(uploadedDate);
        return currentDate.diff(uploaded, "day");
    };



    // Utility function to convert Buffer to base64
    const bufferToBase64 = (buffer) => {
        if (buffer && buffer.data) {
            const binary = String.fromCharCode(...buffer.data);
            return `data:image/jpeg;base64,${btoa(binary)}`;
        }
        return "";
    };

    return (
        <Box sx={{ padding: 2, overflowY: "hidden", position: "relative" }}>
            <TitleTypography variant="h5">Vendor Management</TitleTypography>
            <AddButton
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setShowAddVendorPopup(true)}
            >
                Add New Vendor
            </AddButton>
            <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "center" }}>
                <TextField
                    label="Search Vendors"
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
                            <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {filteredVendorData.map((vendor, index) => (
                            <StyledTableRow
                                key={vendor.id}
                                onClick={() => handleRowClick(vendor)}
                            >
                                <StyledTableCell>{index + 1}</StyledTableCell>
                                <StyledTableCell>{vendor.name}</StyledTableCell>
                                <StyledTableCell>
                                    {vendor.status_id === 1 ? (
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

                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Vendor Detail Popup */}
            <Dialog
                open={showVendorPopup}
                onClose={handleCloseVendorPopup}
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
                <DialogTitle>Vendor</DialogTitle>
                <DialogContent>
                    {selectedVendor && (
                        <>
                            {selectedVendor.vendorlogo && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: "15px",
                                    }}
                                >
                                    <img
                                        // src={bufferToBase64(selectedVendor.vendorlogo)}
                                        src={`${backendUrl}${selectedVendor.vendorlogo}`}

                                        alt={selectedVendor.name}
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
            value={selectedVendor.name}
            onChange={(e) =>
              setSelectedVendor({
                ...selectedVendor,
                name: e.target.value,
              })
            }
          /> */}
                                <TextField
                                    label="Vendor Name"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    value={selectedVendor.name}
                                    onChange={(e) =>
                                        setSelectedVendor({
                                            ...selectedVendor,
                                            details: e.target.value,
                                        })
                                    }
                                />

                                {/* Status Selector with FormControl and InputLabel */}
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        label="Status"
                                        value={selectedVendor.status_id}
                                        onChange={(e) =>
                                            setSelectedVendor({
                                                ...selectedVendor,
                                                status_id: e.target.value
                                            })
                                        }
                                        fullWidth
                                    >
                                        {status.map((status) => (
                                            <MenuItem key={status.id} value={status.id}>
                                                {status.name}
                                            </MenuItem>
                                        ))}
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
                        onClick={handleCloseVendorPopup}
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


            {/* Add New Vendor Popup */}
            <Dialog
                open={showAddVendorPopup}
                onClose={handleCloseAddVendorPopup}
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
                <DialogTitle>Add New Vendor</DialogTitle>
                <DialogContent>

                    <TextField
                        label="Vendor name"
                        variant="outlined"
                        fullWidth
                        value={newVendor.name}
                        onChange={(e) =>
                            setNewVendor({
                                ...newVendor,
                                name: e.target.value,
                            })
                        }
                        sx={{ marginBottom: "12px" }}
                    />


                    {/* Promotion type Selector */}
                    <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px", marginTop: "12px" }}>
                        <InputLabel>Select Status</InputLabel>
                        <Select
                            value={newVendor.status || ""}
                            onChange={(e) =>
                                setNewVendor({ ...newVendor, status: e.target.value })
                            }
                            displayEmpty
                            label="Promotion Type"
                        >
                            {status.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Image Upload */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload} // Use the updated handler
                        style={{ marginBottom: "12px" }}
                    />
                    {newVendor.imageFile && (
                        <Typography variant="caption">Selected file: {newVendor.imageFile.name}</Typography>
                    )}

                </DialogContent>

                <DialogActions>
                    <PremiumButton
                        variant="outlined"
                        color="error"
                        onClick={handleCloseAddVendorPopup}
                    >
                        Cancel
                    </PremiumButton>
                    <PremiumButton variant="contained" onClick={handleAddVendor}>
                        Add Vendor
                    </PremiumButton>
                </DialogActions>
            </Dialog>


        </Box>
    );
};

export default VendorMgt;
