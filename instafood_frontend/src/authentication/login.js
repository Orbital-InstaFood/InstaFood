import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useAuth from "./authLogic";
import GoogleIcon from "./google-icon.png";
import { Grid } from "@mui/material";
import { StyledBox, StyledGoogleIcon, DividerWithText, Title, Description } from "./authStyle";

export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleGoogle,
        handleLogin,
    } = useAuth();

    const navigate = useNavigate();

    return (
        <StyledBox>
                <Title variant="h2">LOG IN</Title>
                <Description variant="body1">
                    Welcome back to Instafood!
                </Description>
            <TextField
                type="email"
                label="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: "100%" }} // Stretch the text field to occupy the entire width
            />
            <TextField
                type="password"
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ width: "100%" }} // Stretch the text field to occupy the entire width
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
                        onClick={handleLogin}
                        sx={{ width: "100%" }}
                    >
                        LOG IN
                    </Button>
                </Grid>
            </Grid>

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
