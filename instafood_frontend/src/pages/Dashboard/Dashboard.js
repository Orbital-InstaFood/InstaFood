import DisplayPostUI from '../../functions/Post/DisplayPostUI';
import useDashboard from './useDashboard';

import {
    Box,
    CircularProgress,
    Backdrop,
    Typography,
    Grid,
    Chip,
    styled,
    Button,
} from '@mui/material';

import {
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';

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
 * This component is used to render the dashboard page.
 */
export default function Dashboard() {

    const {
        userProfile, IDsOfSavedPosts,
        categories, selectedCategories, setSelectedCategories, categorisedPostsObject,
        ingredients, selectedIngredients, setSelectedIngredients, ingredientPostsObject,
        IDsOfPostsToDisplay,
        isInitialising,
        IDsOfLoadedPosts, setCurrentPage, currentPage, maxNumberOfPages
    } = useDashboard();

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
        <Grid container spacing={0}>
            <Grid item xs={6}>
                {/* First grid with basic information */}
                <UserInfoContainer style={{ position: 'sticky', top: 0 }}>

                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        Welcome, <span style={{ fontFamily: 'Georgia', color: '#ffff' }}>{userProfile.username}</span>!
                    </Typography>

                    <Typography variant="body1" component="p" sx={{ fontFamily: 'Arial', fontStyle: 'italic' }}>
                        Discover the newest recipes from people you follow
                    </Typography>

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
                <div style={{ height: '100vh', overflow: 'auto' }}>
                    {IDsOfPostsToDisplay.length !== 0 && (
                        <div>
                            <Button
                                variant="contained"
                                sx={{ position: 'absolute' }}
                                size='small'
                                startIcon={<ChevronLeft />}
                                onClick={() => {
                                    setCurrentPage((prevPage) => prevPage - 1);
                                }}
                                disabled={currentPage === 1 || IDsOfPostsToDisplay.length === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ right: 0, position: 'absolute' }}
                                size='small'
                                endIcon={<ChevronRight />}
                                onClick={() => {
                                    setCurrentPage((prevPage) => prevPage + 1);
                                }}
                                disabled={maxNumberOfPages === currentPage || IDsOfPostsToDisplay.length === 0}
                            >
                                Next
                            </Button>
                        </div>
                    )}

                    {IDsOfLoadedPosts.map((postID) => (
                        <DisplayPostUI
                            key={postID}
                            postID={postID}
                            userOwnID={userProfile.userID}
                            isAPersonalPost={false}
                            isASavedPost={IDsOfSavedPosts.includes(postID)}
                        />
                    ))}
                </div>
            </Grid>
        </Grid>
    );
}
