import { Link } from "react-router-dom";
import useAuth from "./authLogic";
import {
    FormContainer,
    TextFieldElement
} from 'react-hook-form-mui'
import {
    Button,
    Typography,
} from '@mui/material'
import { StyledBox, StyledGoogleIcon, DividerWithText, Title, Description } from "./authStyle";
import GoogleIcon from "./google-icon.png";

/**
 * This component is used to render the sign up page.
 */
export default function SignUp() {
    const {
        email, setEmail,
        password, setPassword,
        handleSignup,
        handleGoogle,
    } = useAuth();

    return (
        <StyledBox>
            <Title variant="h2">SIGN UP</Title>
            <Description variant="body1">
                Welcome to Instafood!
            </Description>

            <FormContainer onSuccess={handleSignup}>
                <TextFieldElement
                    type="email"
                    name="email"
                    label="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ 
                        width: "100%",
                        marginBottom: "1rem"
                    }}
                />
                <TextFieldElement
                    type="password"
                    name="password"
                    label="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ 
                        width: "100%",
                        marginBottom: "1rem"
                    }}
                />

                <Button variant="contained" type="submit" sx={{ width: "100%" }}>
                    SIGN UP
                </Button>
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
                Already have an account? <Link to="/">LOG IN</Link>
            </Typography>
        </StyledBox>
    );
}
