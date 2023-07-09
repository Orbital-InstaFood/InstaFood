import {
  Checkbox,
  Button,
  CircularProgress,
  Grid,
  FormControlLabel,
} from "@mui/material";

import {
  FormContainer,
  TextFieldElement
} from 'react-hook-form-mui'

import {
  Title, 
  CheckboxButtonContainer, 
  Container
} from './ProfileStyles';

import useCreateProfile from "./useCreateProfile";

export default function CreateProfile() {

  const {
    username,
    setUserName,
    bio,
    setBio,
    isPrivate,
    setIsPrivate,
    userID,
    setUserID,
    helperText,
    isValidUserID,
    isLoading,
    handleCreate,
    isCreatingUserProfile,
  } = useCreateProfile();

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (isCreatingUserProfile) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Grid
      container
      sx={{
        flexDirection: 'column',
        padding: '1rem',
        alignItems: 'center',
      }}>
      <Grid item xs={8}>
        <Container>

          <Title
            sx={{
              marginBottom: '1rem',
            }}
          >Create Profile</Title>

          <FormContainer onSuccess={handleCreate}>
            <TextFieldElement
              sx={{
                marginBottom: '1rem',
              }}
              name="username"
              label="Username"
              value={username}
              fullWidth
              onChange={(e) => setUserName(e.target.value)}
              required
            />

            <TextFieldElement
              sx={{
                marginBottom: '1rem',
              }}
              name="bio"
              label="Bio"
              value={bio}
              fullWidth
              onChange={(e) => setBio(e.target.value)}
              required
            />

            <TextFieldElement
              name="userID"
              label="User ID"
              value={userID}
              fullWidth
              sx={{
                marginBottom: '1rem',
                width: '100%',
              }}
              onChange={(e) => setUserID(e.target.value)}
              required
              helperText={helperText}
              error={!isValidUserID}
            />

            <CheckboxButtonContainer>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    name="isPrivate"
                    color="primary"
                  />
                }
                label="Set Profile to Private"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  marginTop: '1rem',
                }}
                disabled={!isValidUserID}
              >
                Create Profile
              </Button>

            </CheckboxButtonContainer>
          </FormContainer>
        </Container>
      </Grid>
    </Grid>
  );
}
