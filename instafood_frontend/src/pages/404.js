import { Button, Typography, Box } from "@mui/material";

export default function PageNotFound() {

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
    >
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        PAGE NOT FOUND
      </Typography>
    </Box>
  );
}