import {
  Box,
  Typography,
  styled,
} from "@mui/material";

const UserInfoContainer = styled(Box)`
  flex-direction: column,
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: "100%";
  border: 1px solid #ccc; 
  padding: 1rem; 
  `;

  const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const CheckboxButtonContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
`;

const Container = styled(Box)`
  flex-direction: column;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: "100%";
  border: 1px solid #ccc; 
  padding: 1rem; 
  `;

export { 
  UserInfoContainer, 
  Title, 
  CheckboxButtonContainer, 
  Container
};