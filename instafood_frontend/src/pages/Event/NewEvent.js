import React from 'react';
import useNewEvent from './useNewEvent';
import {
  Grid,
  TextField,
  Button,
  Backdrop,
  Box,
  CircularProgress
} from '@mui/material';

function NewEvent() {
  const {
    eventName,
    setEventName,
    eventTime,
    setEventTime,
    eventPlace,
    setEventPlace,
    createEvent,
    isLoading
  } = useNewEvent();

  const handleSubmit = (e) => {
    e.preventDefault();
    createEvent();
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <Grid item xs={6}>
        <Box
          sx={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '5px',
            backgroundColor: '#fff',
          }}
        >
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Event Name"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Event Time"
              type="text"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Event Place"
              type="text"
              value={eventPlace}
              onChange={(e) => setEventPlace(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <Button type="submit" variant="contained" color="primary">
              Create Event
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

export default NewEvent;
