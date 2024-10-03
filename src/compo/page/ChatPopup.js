// src/compo/page/ChatPopup.js

import React, { useState } from 'react';
import {
  Dialog,
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  Slide,
} from '@mui/material';
import {
  AttachFile,
  EmojiEmotions,
  Send,
  Close,
  InsertDriveFile,
  PictureAsPdf,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import imgdata from '../img/shaml.JPG';

// Theme colors as per your specifications
const themeColor = {
  primary: '#444', // Dark gray for primary elements
  primaryDark: '#666', // Slightly darker gray for accent
  success: '#4caf50', // Green for success messages or highlights
  error: '#f44336', // Red for error messages
  headerBg: '#444', // Dark gray for header background
  headerTextColor: '#ffffff', // White for header text
  borderColor: '#777', // Gray for borders
  color: '#000000', // Black for text
};

// Styled components
const ChatPopupContainer = styled(Box)({
  display: 'flex',
  height: '80vh',
  flexDirection: 'row',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: themeColor.primaryDark,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Subtle shadow for depth
});

const ContactsList = styled(Box)({
  width: '30%',
  borderRight: `1px solid ${themeColor.borderColor}`,
  backgroundColor: themeColor.primary,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: '#888 transparent', // Firefox
  '&::-webkit-scrollbar': {
    width: '8px', // Thin scrollbar width
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888', // Scrollbar thumb color
    borderRadius: '10px', // Rounded corners for scrollbar
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555', // Darker thumb on hover
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent', // Transparent track
  },
});

const StickyTitle = styled(Box)({
  position: 'sticky',
  top: 0,
  backgroundColor: themeColor.headerBg,
  padding: '15px',
  color: themeColor.headerTextColor,
  fontWeight: 'bold',
  fontSize: '16px',
  zIndex: 1,
});

const ChatWindow = styled(Box)({
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: themeColor.primaryDark,
  overflow: 'hidden',
});

const ContactItem = styled(ListItem)({
  '&:hover': {
    backgroundColor: themeColor.primaryDark, // Highlight color on hover
    color: themeColor.headerTextColor, // White text on hover
    transform: 'translateX(5px)', // Slide effect on hover
    transition: 'transform 0.3s ease, background-color 0.3s ease', // Smooth transition
  },
  color: themeColor.headerTextColor,
  padding: '15px',
  width:'90%',
  margin: 'auto',
  height: '60px',
  transition: 'transform 0.3s ease',
  borderBottom: `1px solid ${themeColor.borderColor}`, // Add a border between items
});

const MessageBubble = styled(Box)(({ type }) => ({
  padding: '10px',
  backgroundColor:
    type === 'user' ? themeColor.primary : themeColor.headerTextColor,
  color:
    type === 'user' ? themeColor.headerTextColor : themeColor.color,
  alignSelf: type === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: '10px',
  maxWidth: '75%',
  wordWrap: 'break-word',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // Subtle shadow for depth
  fontSize: '14px',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: type === 'user' ? '10px' : '0', // Rounded corners for user messages only
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const PdfMessageBubble = styled(Box)(({ type }) => ({
  padding: '10px',
  backgroundColor:
    type === 'user' ? themeColor.primary : themeColor.headerTextColor,
  color:
    type === 'user' ? themeColor.headerTextColor : themeColor.color,
  alignSelf: type === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: '10px',
  maxWidth: '75%',
  wordWrap: 'break-word',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // Subtle shadow for depth
  fontSize: '14px',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '10px', // Rounded corners for PDF messages
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const PdfIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.2)', // Slightly transparent white for icon background
  padding: '8px',
  marginRight: '10px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
});

const InputContainer = styled(Box)({
  padding: '10px',
  backgroundColor: themeColor.headerBg,
  display: 'flex',
  alignItems: 'center',
  borderTop: `1px solid ${themeColor.borderColor}`,
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 2,
  color: themeColor.headerTextColor,
});

const ChatHeader = styled(Box)({
  height: '60px',
  backgroundColor: themeColor.headerBg,
  display: 'flex',
  alignItems: 'center',
  padding: '0 15px',
  color: themeColor.headerTextColor,
  borderBottom: `1px solid ${themeColor.borderColor}`,
});

const HeaderAvatar = styled(Avatar)({
  marginRight: '15px',
  border: `2px solid ${themeColor.secondary}`, // Border around avatar for focus
});

const SendButton = styled(IconButton)({
  backgroundColor: themeColor.buttonBackground,
  color: themeColor.buttonText,
  margin: '0 5px',
  '&:hover': {
    backgroundColor: themeColor.primaryDark, // Darker on hover
  },
  transition: 'background-color 0.3s ease',
});

const FileInput = styled('input')({
  display: 'none',
});

const EmojiMenu = styled(Menu)({
  maxHeight: '250px',
  maxWidth: '300px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))', // Arrange emojis left to right
  gap: '10px',
  padding: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)', // Added shadow for depth
});

const ChatPopup = ({ open, onClose }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, type: 'user', file: null }]);
      setMessage('');
    }
  };

  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
    setEmojiAnchorEl(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([...messages, { text: file.name, type: 'user', file }]);
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" TransitionComponent={Slide} TransitionProps={{ direction: 'up' }}>
      <ChatPopupContainer>
        <ContactsList>
          <StickyTitle>Community</StickyTitle>
          <List>
            {dummyContacts.map((contact) => (
              <ContactItem button key={contact.id} onClick={() => setSelectedContact(contact)}>
                <Avatar
                  src={contact.image}
                  sx={{
                    marginRight: '10px',
                    width: '40px',
                    height: '40px',
                    border: `1px solid ${themeColor.primary}`,
                  }}
                />
                <ListItemText
                  primary={contact.name}
                  primaryTypographyProps={{
                    style: { color: themeColor.headerTextColor, fontSize: '15px' },
                  }}
                />
              </ContactItem>
            ))}
          </List>
        </ContactsList>
        <ChatWindow>
          {selectedContact ? (
            <>
              <ChatHeader>
                <HeaderAvatar
                  src={selectedContact.image}
                  sx={{ width: 45, height: 45 }}
                />
                <Typography variant="h6">{selectedContact.name}</Typography>
              </ChatHeader>
              <Box
                sx={{
                  flex: 1,
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  backgroundColor: themeColor.primaryDark,
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#888 transparent',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                }}
              >
                {messages.map((msg, index) =>
                  msg.file ? (
                    <PdfMessageBubble key={index} type={msg.type}>
                      <PdfIconWrapper>
                        <PictureAsPdf
                          sx={{ color: '#e57373', fontSize: '30px' }}
                        />
                      </PdfIconWrapper>
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          color:
                            msg.type === 'user'
                              ? themeColor.headerTextColor
                              : themeColor.color,
                        }}
                      >
                        {msg.text}
                      </Typography>
                    </PdfMessageBubble>
                  ) : (
                    <MessageBubble key={index} type={msg.type}>
                      {msg.text}
                    </MessageBubble>
                  )
                )}
              </Box>
              <Divider />
              <InputContainer>
                <FileInput
                  accept=".pdf"
                  id="upload-file"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="upload-file">
                  <IconButton color="primary" component="span">
                    <AttachFile />
                  </IconButton>
                </label>
                <IconButton color="primary" onClick={handleEmojiClick}>
                  <EmojiEmotions />
                </IconButton>
                <EmojiMenu
                  anchorEl={emojiAnchorEl}
                  open={Boolean(emojiAnchorEl)}
                  onClose={handleEmojiClose}
                  PaperProps={{
                    style: {
                      padding: '10px',
                      width: '20ch',
                      maxHeight: 250,
                    },
                  }}
                >
                  {[
                    '😊',
                    '😂',
                    '❤️',
                    '👍',
                    '😢',
                    '🙏',
                    '🎉',
                    '😮',
                    '😡',
                  ].map((emoji) => (
                    <MenuItem
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      sx={{ justifyContent: 'center' }}
                    >
                      {emoji}
                    </MenuItem>
                  ))}
                </EmojiMenu>
                <TextField
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  variant="outlined"
                  placeholder="Type a message"
                  fullWidth
                  sx={{ marginLeft: '10px', marginRight: '10px' }}
                  InputProps={{
                    sx: {
                      borderRadius: '0',
                      backgroundColor: themeColor.inputBackground,
                      color:'white'
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <SendButton onClick={handleSendMessage}>
                          <Send />
                        </SendButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </InputContainer>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#888',
              }}
            >
              <Typography>Select a contact to start chatting</Typography>
            </Box>
          )}
        </ChatWindow>
        <CloseButton onClick={onClose}>
          <Close />
        </CloseButton>
      </ChatPopupContainer>
    </Dialog>
  );
};

// Dummy contact list
const dummyContacts = [
  { id: 1, name: 'John Doe', image: imgdata },
  { id: 2, name: 'Jane Smith', image: imgdata },
  { id: 3, name: 'Alice Johnson', image: imgdata },
  { id: 4, name: 'Bob Brown', image: imgdata },
  { id: 5, name: 'Charlie Davis', image: imgdata },
  { id: 6, name: 'Daisy Evans', image: imgdata },
  { id: 7, name: 'Eve Foster', image: imgdata },
  { id: 8, name: 'Frank Green', image: imgdata },
  { id: 9, name: 'Grace Harris', image: imgdata },
  { id: 10, name: 'Henry Irvine', image: imgdata },
  { id: 11, name: 'Ivy Jackson', image: imgdata },
  { id: 12, name: 'Jack King', image: imgdata },
  { id: 13, name: 'Kara Lee', image: imgdata },
  { id: 14, name: 'Leo Martinez', image: imgdata },
  { id: 15, name: 'Mia Nelson', image: imgdata },
  { id: 16, name: 'Nate Owens', image: imgdata },
  { id: 17, name: 'Olivia Parker', image: imgdata },
  { id: 18, name: 'Paul Quinn', image: imgdata },
  { id: 19, name: 'Quinn Roberts', image: imgdata },
  { id: 20, name: 'Rachel Smith', image: imgdata },
];

export default ChatPopup;
