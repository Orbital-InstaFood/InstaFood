import React from 'react';
import {
  Grid, Button, Select, MenuItem, FormControl,
  InputLabel, Chip, IconButton, Input, Box, CircularProgress,
} from '@mui/material';

import {
  Delete, ChevronLeft, ChevronRight,
} from '@mui/icons-material';

import {
  FormContainer,
  TextFieldElement,
} from 'react-hook-form-mui';

import useNewPost from './useNewPost.js';

import {
  PostContainer, Title, Description,
  ImagePreview, Image, DeleteButtonContainer, ButtonOverlay,
} from '../../functions/Post/PostStyles.js';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * This component is used to render the new post page.
 */
export default function NewPost() {
  const {
    title, setTitle,
    captionHTML, setCaptionHTML,
    categories, selectedCategories, setSelectedCategories,
    ingredients, selectedIngredients, setSelectedIngredients,
    imageObjects, currentImageIndex, setCurrentImageIndex,
    handleImageChange, handleImageDelete,
    handleSubmitNewPost, isLoading
  } = useNewPost();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #f9f9f9, #eaeaea)',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Grid
      container
      sx={{
        display: 'flex', flexDirection: 'column', justify: 'center',
        alignItems: 'center', padding: '1rem'
      }}>
      <Grid item xs={6}>
        <PostContainer>
          <Title>CREATE A NEW POST</Title>

          <Description>
            Add categories, ingredients, recipe details, and images to share your creativity with the world!
          </Description>

          <FormContainer onSuccess={handleSubmitNewPost}>

            <TextFieldElement
              fullWidth
              label="Title"
              name="title"
              type="text"
              required
              value={title}
              margin='normal'
              onChange={(e) => setTitle(e.target.value)}
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

            <div>
              <Description sx={{ marginTop: 1, marginBottom: 1 }} >
                Add Recipe Details
              </Description>
                <ReactQuill
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                  }}
                  fullWidth
                  label="Recipe Details"
                  multiline
                  type="text"
                  id="caption"
                  required
                  value={captionHTML}
                  onChange={(newHTML) => setCaptionHTML(newHTML)}
                />
            </div>

            <Button
              component="label"
              variant="outlined"
              color="primary"
              htmlFor="images"
              sx={{ marginTop: 2 }}
            >
              Upload Images
              <input
                type="file"
                id="images"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </Button>

            {imageObjects.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                <ImagePreview key={imageObjects[currentImageIndex].uniqueID}>
                  <Image src={imageObjects[currentImageIndex].imageURL} alt="preview" />

                  <IconButton
                    onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translateY(-50%)',
                      pointerEvents: 'auto',
                      opacity: 0.5,
                    }}
                    disabled={currentImageIndex === 0}
                  >
                    <ChevronLeft />
                  </IconButton>

                  <DeleteButtonContainer>
                    <ButtonOverlay />
                    <IconButton
                      onClick={() => {

                        if (imageObjects.length === 1) {
                          setCurrentImageIndex(0)
                        } else if (currentImageIndex === imageObjects.length - 1) {
                          setCurrentImageIndex(currentImageIndex - 1)
                        } else {
                          setCurrentImageIndex(currentImageIndex)
                        }

                        handleImageDelete(imageObjects[currentImageIndex].uniqueID)
                      }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        pointerEvents: 'auto',
                        color: '#ffffff',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </DeleteButtonContainer>

                  <IconButton
                    onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      transform: 'translateY(-50%)',
                      pointerEvents: 'auto',
                      color: '#ffffff',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%',
                    }}
                    disabled={currentImageIndex === imageObjects.length - 1}
                  >
                    <ChevronRight />
                  </IconButton>
                </ImagePreview>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={captionHTML === '' || captionHTML === '<p><br></p>'}
              sx={{ marginTop: 2 }}
            >
              Create Post
            </Button>
          </FormContainer>
        </PostContainer>
      </Grid>
    </Grid >
  );
}