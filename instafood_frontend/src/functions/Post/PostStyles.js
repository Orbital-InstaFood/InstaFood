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
margin-bottom: 1rem;
`;

const Caption = styled(Typography)`
font-size: 1rem;
`;

const SubHeading = styled(Typography)`
font-size: 1rem;
color: #666;
`;

const PostContainer = styled(Box)`
  flex-direction: column,
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: "100%"; 
  border: 1px solid #ccc; 
  padding: 1rem; 
  `;

const ImagePreview = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  marginBottom: '1rem',
  aspectRatio: '1/1',
  border: '1px solid #ccc',
});

const Image = styled('img')({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const LeftArrowContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: 0,
  width: '5%',
  height: '5%',
});

const RightArrowContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  right: 0,
  width: '5%',
  height: '5%',
});

const ButtonOverlay = styled(Box)({
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 1)',
});

const DeleteButtonContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '7%', 
  height: '7%',
});

export {
    Title,
    Description,
    SubHeading,
    Caption,
    PostContainer,
    ImagePreview,
    Image,
    DeleteButtonContainer,
    LeftArrowContainer,
    RightArrowContainer,
    ButtonOverlay,
}