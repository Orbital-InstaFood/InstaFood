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

function Dashboard() {

    const {
        userProfile, IDsOfSavedPosts,
        categories, selectedCategories, setSelectedCategories, categorisedPostsObject,
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

                    <Title> Welcome, {userProfile.username}! </Title>
                    <Description> Discover the newest recipes from people you follow. </Description>

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

export default Dashboard
