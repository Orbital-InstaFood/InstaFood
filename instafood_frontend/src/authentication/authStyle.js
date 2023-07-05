import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";


const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  justify-content: center; /* Center the content vertically */
  gap: 1rem;
  margin-top: 2rem;
  width: 400px; /* Set the desired width */
  height: 400px; /* Set the desired height */
  margin: 0 auto; /* Center the box horizontally */
  border: 1px solid #ccc; /* Add a border */
  padding: 1rem; /* Add padding */
`;

const StyledGoogleIcon = styled("img")`
  width: 24px; // Adjust the size as per your requirement
  height: 24px;
`;

const DividerWithText = styled(Divider)`
  display: flex;
  align-items: center;
  width: 100%;
  color: #999;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid;
    margin: 0 0.5rem;
  }
`;

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const Description = styled(Typography)`
font-size: 1rem;
color: #666;
`;

export { StyledBox, StyledGoogleIcon, DividerWithText, Title, Description };