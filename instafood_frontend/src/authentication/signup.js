import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import GoogleIcon from './google-icon.png';
import useAuth from './authLogic';
import {
  StyledBox,
  StyledGoogleIcon,
  DividerWithText,
  Title,
  Description,
} from './authStyle';

import './signup.css';

const SignUp = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSignup,
    handleGoogle,
  } = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    handleSignup();
  };

  return (
    <div className="signup-container">
      <StyledBox>
        <Title variant="h2" className="signup-title">
          SIGN UP
        </Title>
        <Description variant="body1" className="signup-description">
          Welcome to Instafood!
        </Description>

        <FormContainer onSuccess={handleSubmit} className="signup-form-container">
          <TextFieldElement
            type="email"
            name="email"
            label="Email"
            required
            value={email}
            onChange={handleEmailChange}
            className="signup-input"
          />
          <TextFieldElement
            type="password"
            name="password"
            label="Password"
            required
            value={password}
            onChange={handlePasswordChange}
            className="signup-input"
          />

          <Button variant="contained" type="submit" className="signup-button">
            SIGN UP
          </Button>
        </FormContainer>


        <DividerWithText>OR</DividerWithText>

        <Button
          variant="outlined"
          onClick={handleGoogle}
          className="signup-google-button"
          startIcon={<StyledGoogleIcon src={GoogleIcon} alt="Google Icon" />}
        >
          CONTINUE WITH GOOGLE
        </Button>

        <Typography component="div" variant="body2" className="signup-login-link">
          Already have an account? <Link to="/" className="signup-login-link-text">LOG IN</Link>
        </Typography>
      </StyledBox>
    </div>
  );
};

export default SignUp;
