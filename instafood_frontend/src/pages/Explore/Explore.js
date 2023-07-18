import useExplore from './useExplore';
import DisplayPostUI from '../../functions/Post/DisplayPostUI';

import {
  Box,
  CircularProgress,
  Backdrop,
  Grid,
  Typography,
  styled,
  Chip,
  TextField,
} from '@mui/material';

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const UserInfoContainer = styled(Box)`
  flex-direction: column,
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: "100%";
  border: 1px solid #ccc; 
  padding: 1rem; 
  `;

const Description = styled(Typography)`
font-size: 1rem;
color: #666;
margin-bottom: 1rem;
`;

/**
 * This component is used to render the explore page.
 */
export default function Explore() {

  const {
    userDoc, savedPosts,
    categories,selectedCategories, setSelectedCategories, categorisedPostsObject,
    ingredients, selectedIngredients, setSelectedIngredients, ingredientPostsObject,
    titleToSearch, setTitleToSearch,
    IDsOfRankedFilteredPostsToDisplay,
    isInitialising, isFiltering,
  } = useExplore();

  const handleCategorySelect = (category) => {
    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleIngredientSelect = (ingredient) => {
    const isSelected = selectedIngredients.includes(ingredient);
    if (isSelected) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  if (isInitialising || isFiltering) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isInitialising || isFiltering}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={6}>
        {/* First grid with basic information */}
        <UserInfoContainer style={{ position: 'sticky', top: 0 }}>

          <Title> Discover the most popular recipes on Instafood! </Title>
          <Description> Filter by title or category to find the best recipes for you. You must select at least one category. </Description>

          <TextField
            fullWidth
            label="Filter by title"
            type="text"
            required
            value={titleToSearch}
            margin='normal'
            onChange={(e) => setTitleToSearch(e.target.value)}
          />

          <Typography variant="subtitle1">Categories</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={`${category} ${categorisedPostsObject[category].length}`}
                onClick={() => handleCategorySelect(category)}
                color={selectedCategories.includes(category) ? 'primary' : 'default'}
                sx={{ margin: '0.5rem' }}
              />
            ))}
          </Box>

          <Typography variant="subtitle1">Ingredients</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {ingredients.map((ingredient) => (
              <Chip
                key={ingredient}
                label={`${ingredient} ${ingredientPostsObject[ingredient].length}`}
                onClick={() => handleIngredientSelect(ingredient)}
                color={selectedIngredients.includes(ingredient) ? 'primary' : 'default'}
                sx={{ margin: '0.5rem' }}
              />
            ))}
          </Box>

        </UserInfoContainer>
      </Grid>

      <Grid item xs={6}>
        {/* Second grid with personal posts */}
        <div style={{ height: '100vh', overflow: 'auto' }}>
          {IDsOfRankedFilteredPostsToDisplay.map((postID) => (
            <DisplayPostUI
              key={postID}
              postID={postID}
              userOwnID={userDoc.userID}
              isAPersonalPost={false}
              isASavedPost={savedPosts.includes(postID)}
            />
          ))}
        </div>
      </Grid>
    </Grid>
  );
}