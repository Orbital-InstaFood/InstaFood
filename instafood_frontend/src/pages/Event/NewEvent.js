import React from 'react';
import { useNavigate } from 'react-router-dom';
import useNewEvent from './useNewEvent';
import {
  Grid, TextField, CircularProgress, Input,
  InputLabel, Select, MenuItem, FormControl,
  Button, Backdrop, Box, Chip, IconButton,
} from '@mui/material';

import {
  FormContainer,
  TextFieldElement,
} from 'react-hook-form-mui';

import {
  Title, Description,
} from '../../functions/Post/PostStyles.js';

export default function NewEvent() {
  const {
    eventName, setEventName,
    eventTime, setEventTime,
    eventPlace, setEventPlace,
    eventDescription, setEventDescription,
    attendeesLimit, setAttendeesLimit,
    categories, selectedCategories, setSelectedCategories,
    ingredients, selectedIngredients, setSelectedIngredients,
    createEvent,
    isInitialising, isCreatingEvent,
  } = useNewEvent();

  const navigate = useNavigate();

  if (isInitialising || isCreatingEvent) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isInitialising || isCreatingEvent}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      padding="1rem"
    >
      <Grid item xs={6}>
        <Box
          border="1px solid #ccc"
          padding="1rem"
          borderRadius="5px"
          backgroundColor="#fff"
        >
          <Title>New Event</Title>
          <Description>
            Invite your friends to your event and enjoy nice food together!
          </Description>

          <FormContainer onSuccess={createEvent}>
            <TextFieldElement
              sx={{ marginBottom: 2 }}
              label="Title"
              type="text"
              name='eventName'
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              fullWidth
              required
            />

            <TextFieldElement
              label="Time"
              name='eventTime'
              type="datetime-local"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              fullWidth
              margin="normal"
              required
            />


            <TextFieldElement
              label="Location"
              type="text"
              name='eventPlace'
              value={eventPlace}
              onChange={(e) => setEventPlace(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextFieldElement
              label="Event Description"
              type="text"
              name='eventDescription'
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              fullWidth
              multiline
              margin="normal"
              required
            />

            <TextFieldElement
              label="Attendees Limit"
              type="number"
              name='attendeesLimit'
              value={attendeesLimit}
              onChange={(e) => setAttendeesLimit(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <FormControl sx={{
              marginBottom: 2,
              marginTop: 2,
              width: '100%',
            }}>
              <InputLabel id="category-label">Categories</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                multiple
                value={selectedCategories}
                onChange={(e) => setSelectedCategories(e.target.value)}
                input={<Input />}
                renderValue={(selected) => (
                  <Box sx={{
                    display: 'flex',
                    maxWidth: '100%',
                    flexWrap: 'wrap'
                  }}>
                    {selected.map((category) => (
                      <Chip key={category} label={category} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{
              marginBottom: 2,
              marginTop: 2,
              width: '100%',
            }}>
              <InputLabel id="ingredient-label">Ingredients</InputLabel>
              <Select
                labelId="ingredient-label"
                id="ingredient"
                multiple
                value={selectedIngredients}
                onChange={(e) => setSelectedIngredients(e.target.value)}
                input={<Input />}
                renderValue={(selected) => (
                  <Box sx={{
                    display: 'flex',
                    maxWidth: '100%',
                    flexWrap: 'wrap'
                  }}>
                    {selected.map((ingredient) => (
                      <Chip key={ingredient} label={ingredient} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
              >
                {ingredients.map((ingredient) => (
                  <MenuItem key={ingredient} value={ingredient}>
                    {ingredient}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
              Create Event
            </Button>

            <Button
              variant="text"
              color="error"
              onClick={() => navigate('/viewEvent')}
            >
              Return to Events
            </Button>

          </FormContainer>
        </Box>
      </Grid>
    </Grid>
  );
}