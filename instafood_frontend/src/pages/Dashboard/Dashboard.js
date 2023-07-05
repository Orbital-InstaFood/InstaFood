import DisplayPostUI from '../../functions/Post/DisplayPostUI';
import { categoriesData } from '../../theme/categoriesData.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDashboard from './useDashboard';

import {
    Box,
    CircularProgress,
    Typography,
    Button,
    MenuItem,
    Select,
    Grid,
} from '@mui/material';

function Dashboard() {

    const {
        userProfile,
        IDsOfLoadedPosts,
        hasMorePosts,
        isLoadingForUserDoc,
        isLoadingForSubscriptions,
        IDsOfSavedPosts,
        searchCategory,
        setSearchCategory,
        handleSearch,
        _loadMorePosts,
    } = useDashboard();

    if (isLoadingForUserDoc || isLoadingForSubscriptions) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'center',
                alignItems: 'center',
            }}
        >
            <Grid item xs={6}>
            {(IDsOfLoadedPosts.length !== 0) && <InfiniteScroll
                dataLength={IDsOfLoadedPosts.length}
                next={_loadMorePosts}
                hasMore={hasMorePosts}
                loader={<p>Loading...</p>}
                endMessage={<p>No more posts to load.</p>}
            >
                {IDsOfLoadedPosts.map((postID) => (
                    <DisplayPostUI
                        postID={postID}
                        userOwnID={userProfile.userID}
                        isAPersonalPost={false}
                        isASavedPost={IDsOfSavedPosts.includes(postID)}
                    />
                ))}
            </InfiniteScroll>
            }
            </Grid>
        </Grid>
    )
}

export default Dashboard
