import React, { useState, useEffect } from 'react';
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
  Button,
  Zoom,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import APIConnection from '../../config';

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#ebebeb',
  rowAlternateColor: '#f5f5f5',
  rowHoverHighlight: '#e0f7fa',
};

const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: '6px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  color: theme.palette.common.white,
  backgroundColor: themeColor.success,
  boxShadow: `0 3px 6px rgba(0, 0, 0, 0.2)`,
  '&:hover': {
    backgroundColor: themeColor.primaryDark,
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  marginRight: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '18px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '6px 8px',
  textAlign: 'left',
  backgroundColor: themeColor.rowAlternateColor,
  color: themeColor.color,
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
    textAlign: 'left',
    borderRight: `1px solid ${themeColor.borderColor}`,
    background: themeColor.primary,
    color: themeColor.headerTextColor,
    '&:last-child': {
      borderRight: 'none',
    },
  },
}));
const EditButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  color: themeColor.primaryDark,
  '&:hover': {
    color: themeColor.primary,
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
  borderRadius: '6px',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
  position: 'sticky',
  marginLeft: '25%',
  top: 0,
  zIndex: 3,
}));

const initialCategories = [];
const initialFeatures = [];
const initialVendors = ["Vendor A", "Vendor B", "Vendor C"];

const Catmgt = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [features, setFeatures] = useState(initialFeatures);
  const [vendors, setVendors] = useState(initialVendors);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [showAddFeaturePopup, setShowAddFeaturePopup] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [editFeatureIndex, setEditFeatureIndex] = useState(null);
  const [productName, setProductName] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [status, setStatus] = useState('active');
  const [productImages, setProductImages] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [productFeatureValues, setProductFeatureValues] = useState({});
  const [selectedTableCategory, setSelectedTableCategory] = useState(null);
  const [featuresForCat, setFeaturesForCat] = useState(initialFeatures);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');


  const fetchcategoriesapi = APIConnection.getCategoriesapi;
  const addcategoriesapi = APIConnection.addCategoryapi;
  const updatecategoriesapi = APIConnection.updatecategoriesapi;
  const addFeaturesapi = APIConnection.addFeaturesapi;
  const getFeaturesForCatapi = APIConnection.getFeaturesForCatapi;

  useEffect(() => {
    fetchCategories();  // Fetch categories on component mount
    getAllFeatures();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(fetchcategoriesapi, { withCredentials: true }); // Adjust the URL to your API endpoint
      setCategories(response.data);
     
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getAllFeatures = async () => {
    try {
      const response = await axios.get(getFeaturesForCatapi, { withCredentials: true });
      setFeaturesForCat(response.data);
     

    } catch (err) {
      console.error('Error fetching features:', err);
    }
  }

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        if (editCategoryIndex !== null) {
          const updatedCategory = { name: newCategory };
          await axios.put(`${updatecategoriesapi}/${categories[editCategoryIndex].id}`, updatedCategory, { withCredentials: true });
          Swal.fire({
            icon: 'success',
            title: 'Category Updated!',
            text: 'The category has been successfully updated.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });
          setEditCategoryIndex(null);
        } else {
          const newCategoryData = { name: newCategory };
       
          await axios.post(addcategoriesapi, newCategoryData, { withCredentials: true });
          Swal.fire({
            icon: 'success',
            title: 'Category Added!',
            text: 'The new category has been successfully added.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });
        }
        fetchCategories();  // Refresh the categories after adding/updating
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          confirmButtonColor: themeColor.error,
          confirmButtonText: 'OK',
        });
        fetchCategories();
        
      }
      setNewCategory('');
      setShowAddCategoryPopup(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please enter a category name.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    }
  };
  const handleAddFeature = async () => {
    if (newFeature && selectedCategory) {
      if (editFeatureIndex !== null) {
        const updatedFeatures = [...features];
        updatedFeatures[editFeatureIndex].name = newFeature;
        setFeatures(updatedFeatures);
        try {
          if (features != null) {
            const response = await axios.post(addFeaturesapi, features, { withCredentials: true });
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Feature Added!',
                text: 'The new features have been successfully added.',
                confirmButtonColor: themeColor.success,
                confirmButtonText: 'OK',
              });
            }

            if (response.status === 404) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                // text: error.response.data.message,
                confirmButtonColor: themeColor.error,
                confirmButtonText: 'OK',
              });
            }
          }
        } catch (error) {
   
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.response.data.message,
            confirmButtonColor: themeColor.error,
            confirmButtonText: 'OK',
          });
          setFeatures(initialFeatures);
        }
      } else {
        setFeatures([...features, { category: selectedCategory, name: newFeature }]);
      }
  
      setNewFeature('');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please select a category and enter a feature name.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    }
  };
  
  

  const handleEditCategory = (index) => {
    setEditCategoryIndex(index);
    setNewCategory(categories[index].name);
    setShowAddCategoryPopup(true);
  };

  const handleEditFeature = (index) => {
    setEditFeatureIndex(index);
    const feature = filteredTableFeatures[index];
    setNewFeature(feature.name);
    setSelectedCategory(feature.category);
    setShowAddFeaturePopup(true);
  };

  const handleUpdateFeatures = async (feat) => {
   

    if (feat != null) {
      try {
        const response = await axios.post(addFeaturesapi, feat, { withCredentials: true });
       
        if (response.status === 200) {
          setShowAddFeaturePopup(false);
          setSelectedCategory("");
          setNewFeature("");
          setFeatures("");
          Swal.fire({
            icon: 'success',
            title: 'Feature Added!',
            text: 'The new Features has been successfully added.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });
          getAllFeatures();
        }
      } catch (err) {
        setShowAddFeaturePopup(false);
        getAllFeatures();
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.response.data.message,
          confirmButtonColor: themeColor.error,
          confirmButtonText: 'OK',
        });
       
      }
    }

  };
  // setShowAddFeaturePopup(false);

  // const filteredFeatures = features.filter(
  //   (feature) => feature.category === selectedCategory
  // );

  const handleCategoryRowClick = async (category) => {
    setSelectedTableCategory(category.id);
    setSelectedCategoryName(category.name);

  };

  // setSelectedTableCategory(categoryName);

  const filteredTableFeatures = featuresForCat.filter(
    (featuresForCat) => featuresForCat.category_id === selectedTableCategory
  );

  return (
    <Box sx={{ padding: 2, overflowY: 'hidden', position: 'relative', marginTop: '-20px' }}>
      <TitleTypography variant="h5">Categories Management</TitleTypography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
        <AddButton
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowAddCategoryPopup(true)}
        >
          Add New Category
        </AddButton>
        <AddButton
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowAddFeaturePopup(true)}
        >
          Add Features
        </AddButton>

      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Categories
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                overflow: 'auto',
                height: '380px',
                borderRadius: '8px',
                boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Table stickyHeader>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Category Name</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {categories.map((category, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleCategoryRowClick(category)}
                      style={{ cursor: 'pointer' }}
                    >
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{category.name}</StyledTableCell>
                      <StyledTableCell>
                        <EditButton onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(index);
                        }}>
                          <EditIcon />
                        </EditButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {selectedTableCategory && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Features for Category: {selectedCategoryName}
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  overflow: 'auto',
                  height: '380px',
                  borderRadius: '8px',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                }}
              >
                <Table stickyHeader>
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell>Feature Name</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {filteredTableFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{feature.name}</StyledTableCell>
                        <StyledTableCell>

                        {/* <EditButton onClick={() => handleEditFeature(index)}>
                            <EditIcon />
                          </EditButton> */}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Add Category Popup */}
      <Dialog
        open={showAddCategoryPopup}
        onClose={() => setShowAddCategoryPopup(false)}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '500px',
            height: '180px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ marginBottom: '12px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowAddCategoryPopup(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddCategory}>
            {editCategoryIndex !== null ? 'Update Category' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Feature Popup */}
      <Dialog
        open={showAddFeaturePopup}
        onClose={() => setShowAddFeaturePopup(false)}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '500px',
            height: '500px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          <Select
            label="Category"
            fullWidth
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ marginBottom: '12px' }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Feature Name"
            variant="outlined"
            fullWidth
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            sx={{ marginBottom: '12px' }}
          />
          <Button
            variant="contained"
            onClick={handleAddFeature}
            sx={{ marginBottom: '12px' }}
          >
            {editFeatureIndex !== null ? 'Update Feature' : 'Add Feature'}
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Feature Name</StyledTableCell>
                  {/* <StyledTableCell>Actions</StyledTableCell> */}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {features && features.map((feature, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{feature.name}</StyledTableCell>
                    {/* <StyledTableCell> */}
                    {/* onClick={() => handleEditFeature(index)} */}
                      {/* <Button > */}
                        {/* Edit */}
                      {/* </Button> */}
                    {/* </StyledTableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowAddFeaturePopup(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={() => { handleUpdateFeatures(features) }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Popup */}

    </Box>
  );
};

export default Catmgt;
