import { Link } from "react-router-dom";
import useAuth from "./authLogic";
import { StyledBox, Title, Description } from "./authStyle";
import { 
    Grid,
    Button,
    TextField,
} from "@mui/material";

import './forgotPassword.css'
/**
 * This component is used to render the forgot password page.
 */
export default function ForgotPassword() {
    const { email, setEmail, handleSendPasswordResetEmail } = useAuth();
    return (
        <div className="forgotPassword-container">
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
                sx={{ width: "100%" }}
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
        </div>
    );
}
