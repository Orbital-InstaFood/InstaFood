import { useState } from 'react';
import { Button, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NewEvent from './NewEvent';

function EventUI() {
  const navigate = useNavigate();
  const [creatingEvent, setCreatingEvent] = useState(false);

  const handleCreateEvent = () => {
    setCreatingEvent(true);
  };

  const handleEventCreated = (eventID) => {
    console.log('Event created:', eventID);
    setCreatingEvent(false);
  };

  const handleButtonClick = () => {
    navigate('/new-event');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#000' }}>
              Discover interesting events!  
            </Typography>
          <Button color="primary" variant="contained" onClick={handleCreateEvent}>
            Create
          </Button>
        </Toolbar>
      </AppBar>


      {creatingEvent ? (
        <NewEvent onEventCreated={handleEventCreated} />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default EventUI;
