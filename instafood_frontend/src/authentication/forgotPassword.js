import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useAuth from "./authLogic";
import { StyledBox, Title, Description } from "./authStyle";
import { Grid } from "@mui/material";

export default function ForgotPassword() {
    const { email, setEmail, handleSendPasswordResetEmail } = useAuth();
    return (
        <StyledBox>
                <Title variant="h2">Forgot your password?</Title>
                <Description variant="body1">
                A link to reset your password will be sent to your email.
                </Description>
            <TextField
                type="email"
                label="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: "100%" }} // Stretch the text field to occupy the entire width
            />

            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs>
                    <Button
                        component={Link}
                        variant="text"
                        size="small"
                        to="/"
                    >
                        BACK TO LOGIN
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={handleSendPasswordResetEmail}
                    >
                        RESET PASSWORD
                    </Button>
                </Grid>
            </Grid>
        </StyledBox>
    );
}
