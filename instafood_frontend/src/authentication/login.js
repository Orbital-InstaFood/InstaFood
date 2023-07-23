import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from './authLogic';
import GoogleIcon from './google-icon.png';
import {
  StyledBox,
  StyledGoogleIcon,
  DividerWithText,
  Description,
} from './authStyle';
import { Button, Typography, Grid } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import './login.css'

/**
 * This component is used to render the login page.
 */
export default function Login() {
  const { email, setEmail, password, setPassword, handleGoogle, handleLogin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <StyledBox>
        <Description variant="body1">Welcome back to Instafood!</Description>

        <FormContainer onSuccess={handleLogin}>
          <TextFieldElement
            name="email"
            type="email"
            label="EMAIL"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              width: '100%',
              marginBottom: '1.5rem',
              background: '#FFF',
              borderRadius: '8px',
            }}
          />

          <TextFieldElement
            name="password"
            type="password"
            label="PASSWORD"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              width: '100%',
              marginBottom: '1.5rem',
              background: '#FFF',
              borderRadius: '8px',
            }}
          />


        <Grid container alignItems="center" justifyContent="space-between" marginBottom="1.5rem">
          <Grid item xs>
            <Button
              variant="text"
              size="small"
              color="error"
              onClick={() => navigate('/forgotpassword')}
            >
              Forgot password?
            </Button>
          </Grid>

          <Grid item>
            <Button variant="contained" type='submit' sx={{ width: '100%' }}>
              LOG IN
            </Button>
          </Grid>
        </Grid>

        </FormContainer>

        <DividerWithText>OR</DividerWithText>

        <Button
          variant="outlined"
          onClick={handleGoogle}
          className="login-google-button"
          startIcon={<StyledGoogleIcon src={GoogleIcon} alt="Google Icon" />}
        >
          CONTINUE WITH GOOGLE
        </Button>

        <Typography component="div" variant="body2" sx={{ marginBottom: '1.5rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'underline' }}>SIGN UP</Link>
        </Typography>
      </StyledBox>
    </div>
  );
}
