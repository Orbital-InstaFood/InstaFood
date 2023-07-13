import { useState } from 'react';
import { Button, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NewEvent from './NewEvent';
import ViewEvent from './ViewEvent';

function EventUI() {
  const navigate = useNavigate();
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [appBarMessage, setAppBarMessage] = useState('Discover interesting events!');

  const handleCreateEvent = () => {
    setCreatingEvent(true);
    setAppBarMessage('Create a new event...');
  };

  const handleEventCreated = () => {
    setCreatingEvent(false);
    setAppBarMessage('Discover interesting events!');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#000' }}>
             {appBarMessage} 
            </Typography>
          <Button color="primary" variant="contained" onClick={handleCreateEvent}>
            Create
          </Button>
        </Toolbar>
      </AppBar>


      {creatingEvent ? (
        <NewEvent onEventCreated={handleEventCreated} />
      ) : (
        <ViewEvent />
      )}
    </div>
  );
}

export default EventUI;
