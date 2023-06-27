import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import useAuth from "./authLogic";
import { StyledBox, StyledGoogleIcon, DividerWithText, Title, Description } from "./authStyle";
import GoogleIcon from "./google-icon.png";

export default function SignUp() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleSignup,
        handleGoogle,
    } = useAuth();

    return (
        <StyledBox>
                <Title variant="h2">SIGN UP</Title>
                <Description variant="body1">
                    Welcome to Instafood! 
                </Description>
            <TextField
                type="email"
                label="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: "100%" }}
            />
            <TextField
                type="password"
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ width: "100%" }}
            />

            <Button variant="contained" onClick={handleSignup} sx={{ width: "100%" }}>
                SIGN UP
            </Button>

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
