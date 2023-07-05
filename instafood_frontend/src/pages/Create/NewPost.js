import { categoriesData } from '../../theme/categoriesData.js';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import { Grid, IconButton, Input } from '@mui/material';
import { Box } from '@mui/system';
import useNewPost from './useNewPost.js';
import { Delete, ChevronLeft, ChevronRight } from '@mui/icons-material';

import {
  PostContainer,
  Title,
  Description,
  ImagePreview,
  Image,
  DeleteButtonContainer,
  ButtonOverlay
} from '../../functions/Post/PostStyles.js';

function NewPost() {
  const {
    title,
    setTitle,
    caption,
    setCaption,
    imageObjects,
    selectedCategories,
    setSelectedCategories,
    handleImageChange,
    handleSubmitNewPost,
    handleImageDelete,

    currentImageIndex,
    setCurrentImageIndex,
    shouldShowArrows,
    setShouldShowArrows,

  } = useNewPost();

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}>
      <Grid item xs={6}>
        <PostContainer>
          <Title>CREATE A NEW POST</Title>

          <Description>
            Add categories, recipe details, and images to share your creativity with the world!
          </Description>

          <TextField
            fullWidth
            label="Title"
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
              onChange={(e) =>
                setSelectedCategories(e.target.value)
              }
              input={<Input />}
              renderValue={(selected) => (
                <Box sx={{
                  display: 'flex',
                  maxWidth: '100%',
                  flexWrap: 'wrap'
                }}>
                  {selected.map((value) => (
                    <Chip key={value} label={categoriesData[value]} sx={{ m: 0.5 }} />
                  ))}
                </Box>
              )}
            >
              {categoriesData.map((category, index) => (
                <MenuItem key={index} value={index}>
                  {category}
                </MenuItem>
              ))}
            </Select>

          </FormControl>

          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            label="Recipe Details"
            multiline
            type="text"
            id="caption"
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <Button
            component="label"
            variant="outlined"
            color="primary"
            htmlFor="images"
            marginRight={2}
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
            <Box
              sx={{ marginTop: 2 }}
              onMouseEnter={() => setShouldShowArrows(true)}
              onMouseLeave={() => setShouldShowArrows(false)}
            >

              <ImagePreview key={imageObjects[currentImageIndex].uniqueID}>
                <Image src={imageObjects[currentImageIndex].imageURL} alt="preview" />

                {shouldShowArrows && (
                  <IconButton
                    onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translateY(-50%)',
                      pointerEvents: 'auto',
                    }}
                    disabled={currentImageIndex === 0}
                  >
                    <ChevronLeft />
                  </IconButton>
                )}

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
                    }}
                  >
                    <Delete />
                  </IconButton>
                </DeleteButtonContainer>

                {shouldShowArrows && (
                  <IconButton
                    onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      transform: 'translateY(-50%)',
                      pointerEvents: 'auto',
                    }}
                    disabled={currentImageIndex === imageObjects.length - 1}
                  >
                    <ChevronRight />
                  </IconButton>
                )}


              </ImagePreview>

            </Box>

          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmitNewPost}
            marginLeft={2}
          >
            Create Post
          </Button>
        </PostContainer>
      </Grid>
    </Grid>
  );
}

export default NewPost;
