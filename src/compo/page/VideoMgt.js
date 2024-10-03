// src/compo/page/VideoMgt.js

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Swal from 'sweetalert2';
import APIConnection from "../../config";
import axios from 'axios';

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
  activeStatusColor: '#4caf50',
  inactiveStatusColor: '#f44336',
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
  color:
    variant === 'contained' ? theme.palette.common.white : themeColor.primary,
  border: variant === 'outlined' ? `1px solid ${themeColor.primary}` : 'none',
  '&:hover': {
    backgroundColor:
      variant === 'contained'
        ? themeColor.primaryDark
        : 'rgba(51, 51, 51, 0.05)',
    transform: 'scale(1.03)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
}));

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
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '6px 8px',
  textAlign: 'left', // Align text to the left
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
    boxShadow: `0px 2px 4px rgba(0,0,0,0.05)`,
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
    textAlign: 'left', // Align header text to the left
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

const BlinkingDot = styled('span')({
  display: 'inline-block',
  height: '8px',
  width: '8px',
  borderRadius: '50%',
  marginRight: '5px',
  animation: 'blink-animation 0.5s infinite',
  '@keyframes blink-animation': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
});



const VideoMgt = () => {
  const [videoData, setVideoData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showAddVideoPopup, setShowAddVideoPopup] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    uploadedDate: new Date().toISOString().split("T")[0],
    status_id: 'inactive',
    link: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // API endpoints
  const getvideoinfo = APIConnection.getvideoinfo;
  const addvideoinfo = APIConnection.addvideoinfo;
  const updateVideoapi = APIConnection.updateVideoapi;

  const fetchvideoinfo = async () => {
    try {
      const response = await axios.get(getvideoinfo, {
        withCredentials: true,
      });
      setVideoData(response.data);

    } catch (error) {
      console.error("Error loading Promotions:", error);
    }
  };


  useEffect(() => {
    fetchvideoinfo();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRowClick = (video) => {
    setSelectedVideo(video);
    setShowVideoPopup(true);
  };

  const handleCloseVideoPopup = () => {
    setShowVideoPopup(false);
    setSelectedVideo(null);
  };

  const handleCloseAddVideoPopup = () => {
    setShowAddVideoPopup(false);
    setNewVideo({
      title: '',
      description: '',
      uploadedDate: '',
      status: 'inactive',
      videoUrl: '',
    });
  };

  const handleStatusChange = (event) => {
    console.log('Status changed:', event.target.value);
    setSelectedVideo({
      ...selectedVideo,
      status_id: event.target.value,
    });
  };

  const handleAddVideoStatusChange = (e) => {
    setNewVideo({ ...newVideo, status: e.target.value });
  };

  const handleUpdate = async () => {
    const matchedPromotion = filteredVideoData.find(
      (Videos) => Videos.id === selectedVideo.id
    );
    if (matchedPromotion) {
      // Compare the status_id of selectedPromotion and matchedPromotion
      if (selectedVideo.status_id !== matchedPromotion.status_id) {
        // setShowPromotionPopup(false);
        Swal.fire({
          icon: "info",
          title: "Status Changed",
          text: `Status has changed for video ID ${selectedVideo.id}. Proceeding with update...`,
          confirmButtonColor: themeColor.success,
        });

        setIsProcessing(true);

        try {
          // Prepare the payload with the id and status_id only
          const payload = {
            id: selectedVideo.id,
            status_id: selectedVideo.status_id,
          };

          // Make the PUT request to update the promotion on the server
          const response = await axios.put(updateVideoapi, payload, {
            withCredentials: true,
          });

          if (response.status === 200) {

            setShowVideoPopup(false);
            Swal.fire({
              icon: "success",
              title: "Promotion Updated!",
              text: "The promotion status has been successfully updated.",
              confirmButtonColor: themeColor.success,
              confirmButtonText: "OK",
            });
            fetchvideoinfo();
          } else {
            setShowVideoPopup(false);
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: "There was an error updating the video. Please try again.",
              confirmButtonColor: themeColor.error,
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error updating promotion:", error);
          setShowVideoPopup(false);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was an error updating the video. Please try again.",
            confirmButtonColor: themeColor.error,
            confirmButtonText: "OK",
          });
        } finally {
          setIsProcessing(false);
        }
      } else {
        setShowVideoPopup(false);
        Swal.fire({
          icon: "warning",
          title: "No Changes Detected",
          text: "No changes in status. Update not required.",
          confirmButtonColor: themeColor.warning,
        });
      }
    } else {
      setShowVideoPopup(false);
      Swal.fire({
        icon: "error",
        title: "video Not Found",
        text: "video not found in filtered data.",
        confirmButtonColor: themeColor.error,
      });
    }
  };
  //
  const handleAddVideo = async () => {
    if (newVideo.title && newVideo.videoUrl && newVideo.uploadedDate && newVideo.description) {
      const newVideoData = {
        ...newVideo,
        id: videoData.length + 1,
      };
      setNewVideo([...videoData, newVideoData]);
      try {
        const response = await axios.post(addvideoinfo, newVideo, {
          withCredentials: true,

        });

        if (response.status === 200) {
          handleCloseAddVideoPopup();
          Swal.fire({
            icon: 'success',
            title: 'Video Added!',
            text: 'The new video has been successfully added.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });
          fetchvideoinfo(); // Refresh the Video list after adding a new product
        }
      } catch (error) {
        console.error("Error adding product:", error);
        handleCloseAddVideoPopup();
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "There was an error adding the Video. Please try again.",
          confirmButtonColor: themeColor.error,
          confirmButtonText: "OK",
        });
      }
      handleCloseAddVideoPopup();
    } else {
      handleCloseAddVideoPopup();
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    }
  };

  const filteredVideoData = videoData.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (

    <Box sx={{ padding: 2, overflowY: 'hidden', position: 'relative' }}>
      <TitleTypography variant="h5">Video Management</TitleTypography>
      <AddButton
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setShowAddVideoPopup(true)}
      >
        Add New Video
      </AddButton>
      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search Videos"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
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
          overflow: 'auto',
          height: '430px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Video Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Uploaded Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredVideoData.map((video) => (
              <StyledTableRow
                key={video.id}
                onClick={() => handleRowClick(video)}
              >
                <StyledTableCell>{video.id}</StyledTableCell>
                <StyledTableCell>{video.title}</StyledTableCell>
                <StyledTableCell>{video.description}</StyledTableCell>
                <StyledTableCell>{video.uploaded_date}</StyledTableCell>
                <StyledTableCell>
                  {video.status_id === 1 ? (
                    <Typography
                      sx={{
                        color: themeColor.activeStatusColor,
                        fontWeight: 'bold',
                      }}
                    >
                      <BlinkingDot
                        style={{ backgroundColor: themeColor.activeStatusColor }}
                      />
                      Enable
                    </Typography>
                  ) : (
                    <Typography sx={{ color: themeColor.inactiveStatusColor }}>
                      <BlinkingDot
                        style={{ backgroundColor: themeColor.inactiveStatusColor }}
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

      {/* Video Detail Popup */}
      <Dialog
        open={showVideoPopup}
        onClose={handleCloseVideoPopup}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '500px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle> Video</DialogTitle>
        <DialogContent sx={{ paddingTop: '12px' }}> {/* Added paddingTop */}
          {selectedVideo && (
            <>
              <TextField
                label="Video Title"
                variant="outlined"
                fullWidth
                value={selectedVideo.title}
                onChange={(e) =>
                  setSelectedVideo({
                    ...selectedVideo,
                    title: e.target.value,
                  })
                }
                sx={{ marginTop: '12px', marginBottom: '12px' }} // Added marginTop
                
              />
              <TextField
                label="Video URL"
                variant="outlined"
                fullWidth
                value={selectedVideo.link}
                onChange={(e) =>
                  setSelectedVideo({
                    ...selectedVideo,
                    videoUrl: e.target.value,
                  })
                }
                sx={{ marginBottom: '12px' }}

              />
              {renderVideoPlayer(selectedVideo.link)}
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                value={selectedVideo.description}
                // onChange={(e) =>
                //   setSelectedVideo({
                //     ...selectedVideo,
                //     description: e.target.value,
                //   })
                // }
                sx={{ marginBottom: '12px' }}

              />
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Uploaded Date:</DetailTableCell>
                    <DetailTableCell>{selectedVideo.uploaded_date}</DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Current Status:</DetailTableCell>
                    <DetailTableCell>
                      <Select
                        value={selectedVideo.status_id}
                        onChange={handleStatusChange}
                        fullWidth
                      >
                        <MenuItem value={1}>Enable</MenuItem>
                        <MenuItem value={2}>Disable</MenuItem>
                      </Select>
                    </DetailTableCell>
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
            onClick={handleCloseVideoPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton
            variant="contained"
            onClick={handleUpdate}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={20} /> : 'Update'}
          </PremiumButton>
        </DialogActions>
      </Dialog>


      {/* Add New Video Popup */}
      <Dialog
        open={showAddVideoPopup}
        onClose={handleCloseAddVideoPopup}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '500px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
            
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle>Add New Video</DialogTitle>
        <DialogContent>
          <TextField
            label="Video Title"
            variant="outlined"
            fullWidth
            value={newVideo.title}
            onChange={(e) =>
              setNewVideo({ ...newVideo, title: e.target.value })
            }
            sx={{ marginBottom: '12px', marginTop: '10px'} }
          />
          <TextField
            label="Video URL"
            variant="outlined"
            fullWidth
            value={newVideo.videoUrl}
            onChange={(e) =>
              setNewVideo({ ...newVideo, videoUrl: e.target.value })
            }
            sx={{ marginBottom: '12px' }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            value={newVideo.description}
            onChange={(e) =>
              setNewVideo({ ...newVideo, description: e.target.value })
            }
            sx={{ marginBottom: '12px' }}
          />
          <TextField
            label="Uploaded Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newVideo.uploadedDate}
            // onChange={(e) =>
            //   setNewVideo({ ...newVideo, uploadedDate: e.target.value })
            // }
            sx={{ marginBottom: '12px' }}
            disabled
          />
          <FormControl fullWidth sx={{ marginBottom: '12px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={newVideo.status}
              onChange={handleAddVideoStatusChange}
              fullWidth
            >
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Inactive</MenuItem>
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseAddVideoPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleAddVideo}>
            Add Video
          </PremiumButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoMgt;
