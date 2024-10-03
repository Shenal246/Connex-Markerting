import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
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
  DialogTitle,
  Button,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Swal from "sweetalert2";
import axios from "axios";
import APIConnection from "../../config";
import SearchIcon from "@mui/icons-material/Search";

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
};

// Styled Components
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
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: themeColor.primaryDark,
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  marginRight: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "16px",
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: "6px 8px",
  textAlign: "left",
  backgroundColor: themeColor.rowAlternateColor,
  color: themeColor.color,
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
  borderRadius: "6px",
  boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
  position: "sticky",
  marginLeft: "25%",
  top: 0,
  zIndex: 3,
}));

const steps = [
  "Category Selection",
  "Product Information",
  "Features",
  "Media",
];

const ProductMgt = () => {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [productManagers, setProductManagers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProductManager, setSelectedProductManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [status, setStatus] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [productFeatureValues, setProductFeatureValues] = useState({});

  const [products, setProducts] = useState([]);
  
  const [activeStep, setActiveStep] = useState(0);
  const [modelNo, setModelNo] = useState("");
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [showEditProductPopup, setShowEditProductPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // API endpoints
  const fetchcategoriesapi = APIConnection.getCategoriesapi;
  const getVendorapi = APIConnection.getVendorsapi;
  const getPMapi = APIConnection.getPMapi;
  const getFeaturesForProductapi = APIConnection.getFeaturesForProductapi;
  const addproductsapi = APIConnection.addproductsapi;
  const getstatusapi = APIConnection.getstatusapi;
  const getProductsapi = APIConnection.getproductsapi; // Add this API endpoint for fetching products
  const updateProductapi = APIConnection.updateProducstapi;

  useEffect(() => {
    fetchCategories();
    fetchVendors();
    fetchProductManagers();
    fetchStatus();
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(getProductsapi, {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get(getstatusapi, { withCredentials: true });
      setStatus(response.data);
    } catch (error) {
      console.error("Error loading Status:", error);
    }
  };

  // Section 1: Load Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(fetchcategoriesapi, {
        withCredentials: true,
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Section 2: Load Vendors and Product Managers
  const fetchVendors = async () => {
    try {
      const response = await axios.get(getVendorapi, { withCredentials: true });
      setVendors(response.data);
    } catch (error) {
      console.error("Error loading vendors:", error);
    }
  };

  const fetchProductManagers = async () => {
    try {
      const response = await axios.get(getPMapi, { withCredentials: true });
      setProductManagers(response.data);
    } catch (error) {
      console.error("Error loading product managers:", error);
    }
  };

  // Handle Edit Product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setSelectedCategory(product.category);
    setProductName(product.name);
    setSelectedVendor(product.vendor);
    setSelectedProductManager(product.productManager);
    setSelectedStatus(product.status);
    setModelNo(product.modelNo);
    setProductImages(product.images || []);
    setVideoLink(product.videoLink || "");
    setProductFeatureValues(product.features || {});
  };

  const openSelectedProduct = (product) => {
    setSelectedProduct(product);
    console.log(product);
    setShowEditProductPopup(true);
  };

  // Update Product
  const handleProductUpdate = async () => {
    try {
      // Find the product in products with the same id as selectedProduct
      const matchedProduct = products.find(
        (product) => product.id === selectedProduct.id
      );

      if (!matchedProduct) {
        Swal.fire({
          icon: "error",
          title: "Product Not Found",
          text: "The selected product was not found.",
          confirmButtonColor: themeColor.error,
        });
        return;
      }

      // Compare the status_id of selectedProduct and matchedProduct
      if (selectedProduct.status_id !== matchedProduct.status_id) {
        Swal.fire({
          icon: "info",
          title: "Status Changed",
          text: `Status has changed for product ID ${matchedProduct.id}. Proceeding with update...`,
          confirmButtonColor: themeColor.success,
        });

        // Prepare the payload with the id and status_id only
        const payload = {
          id: selectedProduct.id,
          status_id: selectedProduct.status_id,
        };

        // Make the PUT request to update the product on the server
        const response = await axios.put(updateProductapi, payload, {
          withCredentials: true,
        });

        if (response.status === 200) {
          resetForm();
          setShowEditProductPopup(false);
          Swal.fire({
            icon: "success",
            title: "Product Updated!",
            text: "The product has been successfully updated.",
            confirmButtonColor: themeColor.success,
            confirmButtonText: "OK",
          });
          fetchProducts();
        } else {
          throw new Error("Update failed. Response status was not 200.");
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "No Changes Detected",
          text: "No changes in status. Update not required.",
          confirmButtonColor: themeColor.warning,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the product. Please try again.",
        confirmButtonColor: themeColor.error,
        confirmButtonText: "OK",
      });
    } finally {
      setShowEditProductPopup(false);
    }
  };


  // Section 3: Load Features Based on Selected Category
  useEffect(() => {
    if (selectedCategory) {
      fetchFeatures(selectedCategory);
    }
  }, [selectedCategory]);



  const fetchFeatures = async (categoryId) => {
    try {
      const response = await axios.post(
        getFeaturesForProductapi,
        { categoryId },
        { withCredentials: true }
      );
      setFeatures(response.data);
    } catch (error) {
      console.error("Error loading features:", error);
    }
  };
  const filteredProductData = products.filter((product) =>

    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submitting the Form Data
  const handleProductSubmit = async () => {
    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('name', productName);
    formData.append('vendor', selectedVendor.id);
    formData.append('productManager', selectedProductManager.id);
    formData.append('status', selectedStatus.id);
    formData.append('videoLink', videoLink);
    formData.append('modelNo', modelNo);
    formData.append('features', JSON.stringify(productFeatureValues));
  
    // Ensure you append the image file from the file input
    formData.append('image', productImages[0]); // Assuming you're uploading only one image
  
    try {
      const response = await axios.post(addproductsapi, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',  // Ensure form data is sent as multipart
        },
      });

      if (response.status === 200) {
        resetForm();
        setShowAddProductPopup(false);
        fetchProducts();
        Swal.fire({
          icon: "success",
          title: "New Product added!",
          text: "The  New product has been successfully added.",
          confirmButtonColor: themeColor.success,
          confirmButtonText: "OK",
        });
        

      }
  
      // Handle success and error cases as usual
    } catch (error) {
      console.log('Error adding product:', error);
      setShowAddProductPopup(false);
      Swal.fire({
        icon: "error",
        title: "New Product Failed",
        text: error?.response.data.message,
        confirmButtonColor: themeColor.error,
        confirmButtonText: "OK",
      });
    }
  };
  

  const resetForm = () => {
    setSelectedCategory("");
    setProductName("");
    setProductFeatureValues({});
    setSelectedVendor("");
    setSelectedProductManager("");
    setProductImages([]);
    setVideoLink("");
    setSelectedStatus("");
    setActiveStep(0);
    setModelNo("");
    setShowAddProductPopup(false);
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files); // Store the entire File list
};

  const handleFeatureValueChange = (featureId, value) => {
    setProductFeatureValues({
      ...productFeatureValues,
      [featureId]: value,
    });
  };

  const handleProductDetailsChange = (field, value) => {
    setSelectedProduct({
      ...selectedProduct,
      [field]: value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isNextButtonDisabled = () => {
    switch (activeStep) {
      case 0:
        return selectedCategory === "";
      case 1:
        return (
          productName === "" ||
          selectedVendor === "" ||
          selectedProductManager === "" ||
          modelNo === "" ||
          selectedStatus === ""
        );
      case 2:
        return features.some((feature) => !productFeatureValues[feature.id]);
      case 3:
        return productImages.length === 0 || videoLink === "";
      default:
        return false;
    }
  };

  // Utility function to convert Buffer to base64
  const bufferToBase64 = (buffer) => {
    if (buffer && buffer.data) {
      const binary = String.fromCharCode(...buffer.data);
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    return "";
  };


  const renderVideoPlayer = (videoUrl) => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      return (
        <iframe
          width="100%"
          height="315"
          src={videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: '8px', marginBottom: '15px' }}
          pl
        ></iframe>
      );
    }
    return (
      <video
        controls
        src={videoUrl}
        style={{
          width: '100%',
          borderRadius: '8px',
          marginBottom: '15px',
        }}
      />
    );
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box p={2}>
      <TitleTypography variant="h6" gutterBottom>
        Product Management
      </TitleTypography>
      <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Search Products"
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
      <AddButton
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setShowAddProductPopup(true)}
      >
        Add Product
      </AddButton>

      {/* Product Table */}
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
      >
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Model No</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredProductData.map((product, index) => (
              <TableRow
                key={index}
                hover
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? themeColor.rowAlternateColor
                      : themeColor.rowHoverColor,
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => openSelectedProduct(product)} // Assuming you want to handle row click for editing
              >
                <StyledTableCell>{product.category_name}</StyledTableCell>
                <StyledTableCell>{product.name}</StyledTableCell>
                <StyledTableCell>{product.vendor_name}</StyledTableCell>
                <StyledTableCell
                  style={{
                    color:
                      product.status_name === "Enable"
                        ? themeColor.success
                        : themeColor.error,
                  }}
                >
                  {product.status_name}
                </StyledTableCell>
                <StyledTableCell>{product.modelno}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Dialog */}
      <Dialog
        open={showAddProductPopup}
        onClose={() => setShowAddProductPopup(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Category
                </Typography>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Information
                </Typography>
                <TextField
                  label="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                />
                <Autocomplete
                  options={vendors}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedVendor}
                  onChange={(event, newValue) => {
                    setSelectedVendor(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor"
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                    />
                  )}
                />
                <Autocomplete
                  options={productManagers}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedProductManager}
                  onChange={(event, newValue) => {
                    setSelectedProductManager(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Manager"
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                    />
                  )}
                />
                <TextField
                  label="Country"
                  value="Sri Lanka"
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                  disabled
                />
                <TextField
                  label="Model No"
                  value={modelNo}
                  onChange={(e) => setModelNo(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                />

                <Autocomplete
                  options={status}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedStatus}
                  onChange={(event, newValue) => {
                    setSelectedStatus(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Features
                </Typography>
                {features.map((feature) => (
                  <TextField
                    key={feature.id}
                    label={feature.name}
                    value={productFeatureValues[feature.id] || ""}
                    onChange={(e) =>
                      handleFeatureValueChange(feature.id, e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "20px" }}
                  />
                ))}
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Media
                </Typography>
                <TextField
                  label="Video Link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                />
                <TextField
                  label=""
                  type="file"
                  inputProps={{ multiple: true }}
                  onChange={handleProductImagesChange}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddProductPopup(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            color="primary"
          >
            Previous
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleProductSubmit} color="primary">
              Add Product
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              color="primary"
              disabled={isNextButtonDisabled()}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>




      {/* Product Details Dialog */}
      <Dialog
        open={showEditProductPopup}
        onClose={() => setShowEditProductPopup(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              {/* Product Image */}
              {/* <img
                src={bufferToBase64(selectedProduct.image)}
                alt="Product"
                style={{
                  height: "250px",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto 20px",
                }}
              /> */}
              {renderVideoPlayer(selectedProduct.videolink)}

              {/* Product Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Product Name"
                    value={selectedProduct.name}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Model Number"
                    value={selectedProduct.modelno}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={selectedProduct.status_name}  // Directly use the status_name for value
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          status_id: e.target.value === "Enable" ? 1 : 2,
                          status_name: e.target.value,  // Also update status_name to reflect the selected value
                        })
                      }
                    >
                      <MenuItem value="Enable">Enable</MenuItem>
                      <MenuItem value="Disable">Disable</MenuItem>
                    </Select>

                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Product Manager"
                    value={selectedProduct.product_manager_name}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vendor"
                    value={selectedProduct.vendor_name}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Features Section */}
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(selectedProduct.features).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        label={key}
                        value={value}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setShowEditProductPopup(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => { handleProductUpdate() }}>Update Product</Button>
        </DialogActions>
      </Dialog>




    </Box>
  );
};

export default ProductMgt;