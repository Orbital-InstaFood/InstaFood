import { useState } from 'react';

import {
    Box,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
} from '@mui/material';

import {
    NotInterested,
    AccountCircle,
} from '@mui/icons-material';

import DisplayUserLink from '../../../functions/DisplayUserLink';

function DisplayFollowing ( {otherUserID, unfollow }) {
    const [unfollowIsBeingProcessed, setUnfollowIsBeingProcessed] = useState(false); 

    const handleUnfollow = async () => {
        setUnfollowIsBeingProcessed(true);
        unfollow(otherUserID);

        setUnfollowIsBeingProcessed(false);
    }

    if (unfollowIsBeingProcessed) {
        return (
            <div>
                <p>Unfollowing {otherUserID}...</p>
            </div>
        );
    }

    return (
        <ListItem>
            <ListItemIcon>
                <AccountCircle />
            </ListItemIcon>
            <ListItemText primary={
                <DisplayUserLink userID={otherUserID} />
            } />
            <Box sx={{ marginLeft: 'auto' }}>
                <Button
                    startIcon={<NotInterested />}
                    onClick={() => handleUnfollow()}
                    variant={"outlined"}
                    color="error"
                    sx={{ flex: 1 }}
                >
                    Unfollow
                </Button>
            </Box>
        </ListItem>
    );
}

export default DisplayFollowing;