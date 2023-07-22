import useViewEvent from './useViewEvent';
import DisplayEventUI from './DisplayEventUI';
import { Link } from 'react-router-dom';
import { Backdrop, CircularProgress, Box, styled, Typography } from '@mui/material';

const ScrollableContainer = styled(Box)`
  flex-direction: column;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: 50%;
  border: 1px solid #ccc;
  padding: 1rem;
  overflow-y: auto; 
  height: 800px; 
`;

const FlexContainer = styled(Box)`
  display: flex;
  gap: 16px;
`;

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const Caption = styled(Typography)`
font-size: 1rem;
`;

export default function ViewEvent() {
  const {
    IDsOfEventsToView,
    IDsOfEventsCreated,
    isInitialising
  } = useViewEvent();

  if (isInitialising) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isInitialising}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box>
      <Title sx={{ marginLeft: 1, marginTop: 5 }}>Join Us For A Culinary Extravaganza </Title>
      <Caption sx={{ marginLeft: 1, marginBottom: 1 }}>
      Are you a food enthusiast who loves the joy of cooking and sharing delicious meals with others? Look no further! Welcome to our exciting event page, where foodies like you come together to celebrate the art of cooking and savor the delights of mouthwatering dishes. At our events, you get to showcase your culinary prowess and invite fellow food lovers to your cozy abode, creating an intimate setting where everyone can bond over the love of food and good company. Whether you're a seasoned chef or a passionate home cook, this is the perfect opportunity to dazzle taste buds and exchange cherished recipes.
      </Caption>

      <FlexContainer>
        <ScrollableContainer>
          <Title sx={{ marginLeft: 1 }}>Events by your following</Title>
          <Caption sx={{ marginLeft: 1, marginBottom: 1 }}>
            Join an event to get the party started!
          </Caption>
          {IDsOfEventsToView.map((eventID) => (
            <DisplayEventUI
              eventID={eventID}
              key={eventID}
              isAuthor={false}
            />
          ))}
        </ScrollableContainer>

        <ScrollableContainer>
          <Title sx={{ marginLeft: 1}}>Your events</Title>
          <Caption sx={{ marginLeft: 1, marginBottom: 1 }}>
            Or create a new event <Link to="/newEvent">here</Link>
          </Caption>
          {IDsOfEventsCreated.map((eventID) => (
            <DisplayEventUI
              eventID={eventID}
              key={eventID}
              isAuthor={true}
            />
          ))}
        </ScrollableContainer>
      </FlexContainer>
    </Box>
  );
}