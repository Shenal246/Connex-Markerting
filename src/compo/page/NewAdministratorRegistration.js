import React from 'react';
import { Box, Typography, Button, TextField, Autocomplete } from '@mui/material';
import { styled } from '@mui/system';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  userName: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contactNo: yup.string().required('Contact Number is required'),
  designation: yup.string().required('Designation is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  bisRegId: yup.string().required('BIS REG ID is required'),
});

// Define theme color

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
};


// Define styled components
const CustomTextField = styled(TextField)(({ theme }) => ({
  height: '40px',
  margin: '6px 0',
  '& .MuiInputBase-root': {
    height: '100%',
    padding: '6px 10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: `0 0 4px ${theme.palette.primary.main}`,
    },
  },
  '& .MuiFormLabel-root': {
    color: '#333333',
    fontWeight: '500',
    fontSize: '0.75rem',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: '#333333',
    fontSize: '0.75rem',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#999999',
  },
}));

const CustomButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '6px',
  padding: '6px 12px',
  height: '30px',
  width: '100px',
  fontSize: '12px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  border: 'none',
  margin: 'Auto',
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

// Mock data for BIS REG IDs
const bisRegIds = [
  { id: 'BIS001', label: 'BIS REG ID 001' },
  { id: 'BIS002', label: 'BIS REG ID 002' },
  { id: 'BIS003', label: 'BIS REG ID 003' },
  // Add more as needed
];

const NewAdministratorRegistration = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful!',
      text: 'Your administrator account has been created successfully.',
      confirmButtonColor: themeColor.primary,
      confirmButtonText: 'OK',
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        maxWidth: '400px',  // Adjusted width
        mx: 'auto',
        mt: 4,
        p: 2,  // Adjusted padding
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
      }}
    >
      <Typography variant="h6" gutterBottom>
        New Administrator Registration
      </Typography>
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Full Name"
            variant="outlined"
            margin="normal"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        )}
      />
      <Controller
        name="userName"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Username"
            variant="outlined"
            margin="normal"
            error={!!errors.userName}
            helperText={errors.userName?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Email"
            variant="outlined"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="contactNo"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Contact Number"
            variant="outlined"
            margin="normal"
            error={!!errors.contactNo}
            helperText={errors.contactNo?.message}
          />
        )}
      />
      <Controller
        name="designation"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Designation"
            variant="outlined"
            margin="normal"
            error={!!errors.designation}
            helperText={errors.designation?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        )}
      />
      <Controller
        name="bisRegId"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={bisRegIds}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => field.onChange(value?.id || '')}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="BIS REG ID"
                variant="outlined"
                margin="normal"
                error={!!errors.bisRegId}
                helperText={errors.bisRegId?.message}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value}
          />
        )}
      />
      <CustomButton type="submit" variant="contained">
        Register
      </CustomButton>
    </Box>
  );
};

export default NewAdministratorRegistration;
