import React from 'react';
import useViewEvent from './useViewEvent';
import { Box, CircularProgress, Backdrop, Grid, Typography } from '@mui/material';

const Title = Typography;

const eventBoxStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  width: '300px',
  backgroundColor: 'primary.main',
  color: 'common.white',
  borderRadius: 'borderRadius',
  boxShadow: 'shadows.2',
  margin: '2',
  padding: '2',
};

function ViewEvent() {
  const { eventData, loading } = useViewEvent();

  if (loading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Grid container spacing={2}>
      {eventData.map((event) => (
        <Grid key={event.eventID} item xs={12} sm={6} md={4} lg={3}>
          <Box sx={eventBoxStyles}>
            <Typography variant="h6">{event.eventName}</Typography>
            <Typography variant="body1">Event Time: {event.eventTime}</Typography>
            <Typography variant="body1">Event Place: {event.eventPlace}</Typography>
          </Box>
        </Grid>
      ))}
      {eventData.length === 0 && <div>No events found.</div>}
    </Grid>
  );
}

export default ViewEvent;
