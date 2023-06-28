import { styled } from '@mui/material';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const Description = styled(Typography)`
font-size: 1rem;
color: #666;
`;

const PostContainer = styled(Box)`
  display: flex,
  flex-direction: column,
  align-items: flex-start,
  justify-content: start;
  gap: 1rem;
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  width: 600px; 
  border: 1px solid #ccc; 
  padding: 1rem; /* Add padding */
  `;

const ImagePreview = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
  aspectRatio: '1/1',
  border: '1px solid #ccc',
});

const Image = styled('img')({
  objectFit: 'cover',
  width: '100%',
  justifyContent: 'center',
  height: '100%',
});

const DeleteButtonContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '7%', // Adjust the width to control the size of the delete button
  height: '7%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  pointerEvents: 'none', // Prevent pointer events on the container to allow clicking the delete button
});

const DeleteButtonOverlay = styled(Box)({
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.8)', // Use a semi-transparent white overlay to obscure the image
});

export {
    Title,
    Description,
    PostContainer,
    ImagePreview,
    Image,
    DeleteButtonContainer,
    DeleteButtonOverlay
}