import { Link, useNavigate } from "react-router-dom";
import useAuth from "./authLogic";
import GoogleIcon from "./google-icon.png";
import { StyledBox, StyledGoogleIcon, DividerWithText, Title, Description } from "./authStyle";
import {
    Button,
    Typography,
    Grid
} from '@mui/material'
import {
    FormContainer,
    TextFieldElement
} from 'react-hook-form-mui'

/**
 * This component is used to render the login page.
 */
export default function Login() {
    const {
        email, setEmail,
        password, setPassword,
        handleGoogle,
        handleLogin,
    } = useAuth();

    const navigate = useNavigate();

    return (
        <StyledBox>

            <Title variant="h2">LOG IN</Title>
            <Description variant="body1"> Welcome back to Instafood! </Description>

            <FormContainer onSuccess={handleLogin}>

                <TextFieldElement
                    name="email"
                    type="email"
                    label="EMAIL"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ 
                        width: "100%",
                        marginBottom: "1rem" 
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
                        width: "100%",
                        marginBottom: "1rem"
                    }}
                />

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs>
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            onClick={() => navigate("/forgotpassword")}
                        >
                            Forgot password?
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ width: "100%" }}
                        >
                            LOG IN
                        </Button>
                    </Grid>
                </Grid>
            </FormContainer>

            <DividerWithText>OR</DividerWithText> 

            <Button
                variant="outlined"
                onClick={handleGoogle}
                sx={{ width: "100%" }}
                startIcon={<StyledGoogleIcon src={GoogleIcon} alt="Google Icon" />}
            >
                CONTINUE WITH GOOGLE
            </Button>

            <Typography component="div" variant="body2">
                Don't have an account? <Link to="/signup">SIGN UP</Link>
            </Typography>
        </StyledBox>
    );
}
