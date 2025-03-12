import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Divider,
  Box,
  Fade,
  InputAdornment,
  IconButton,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { auth, provider, signInWithPopup, signOut } from "../../configs/firebase.config";
import { SignInPaper } from '../../styles/SignInPaper';
import { StyledButton } from '../../styles/StyledButton';
import { loginWithGoogle } from '../../services/auth.service';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");

  /**
   * @description Handle Google Sign In
   */ 
  const handleGoogleSignIn = async () => {
    
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email && await loginWithGoogle(email)) {
        // Redirect home

      } else {
        await signOut(auth);
        setError("The account is not allowed to sign in!");
      }
    } catch (err) {
      console.error(err);
      setError("Sign-in failed!");
    }
  };

  /**
   * @description Handle sign in
   * @param e 
   */
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Thêm logic xử lý đăng nhập ở đây
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh]">
      <Container component="main" maxWidth="xs">
        <Fade in={true} timeout={1000}>
          <SignInPaper elevation={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: '#1976d2',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome Back
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledButton type="submit" fullWidth variant="contained" color="primary">
                Sign In
              </StyledButton>

              <Divider sx={{ my: 3, width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <StyledButton
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{
                  borderColor: '#4285f4',
                  color: '#4285f4',
                  '&:hover': {
                    borderColor: '#4285f4',
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  },
                }}
              >
                Sign in with Google
              </StyledButton>
            </Box>
          </SignInPaper>
        </Fade>
      </Container>
    </div>
  );
};

export default SignIn;
