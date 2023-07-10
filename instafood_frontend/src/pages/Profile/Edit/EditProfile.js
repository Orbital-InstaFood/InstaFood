import useEditProfile from "./useEditProfile"

import { useNavigate } from "react-router-dom";

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
} from '../ProfileStyles';

function EditProfile() {

    const {
        username, setUserName,
        bio, setBio,
        isPrivate, setIsPrivate,
        isLoading,
        handleSubmitUserInfo,
    } = useEditProfile();

    const navigate = useNavigate();

    if (isLoading) {
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
                    >EDIT PROFILE INFORMATION</Title>

                    <FormContainer onSuccess={handleSubmitUserInfo} values={{ username, bio, isPrivate }} >
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
                            fullWidth
                            onChange={(e) => setBio(e.target.value)}
                            required
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
                                    alignSelf: 'flex-end',

                                }}
                            >
                                EDIT PROFILE
                            </Button>
                        </CheckboxButtonContainer>

                        <Button                        
                            variant="text"
                            color="secondary"
                            onClick={() => navigate('/viewProfile')}
                        >
                            BACK TO PROFILE
                        </Button>

                    </FormContainer>
                </Container>
            </Grid>
        </Grid>
    );

}

export default EditProfile;