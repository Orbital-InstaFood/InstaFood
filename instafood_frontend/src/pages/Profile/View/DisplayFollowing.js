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

/**
 * This component is used to render the following list of the user
 * and provide the user with the option to unfollow the user.
 * 
 * @param {string} otherUserID The user ID of the user who is being followed.
 * @param {function} unfollow The function to unfollow the user. This function is passed from a UserDocEditor component.
 */
export default function DisplayFollowing ( {otherUserID, unfollow }) {
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