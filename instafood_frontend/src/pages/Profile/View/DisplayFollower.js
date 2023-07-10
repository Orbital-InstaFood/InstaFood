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

function DisplayFollower ( {otherUserID, removeFollower } ) {
    const [removeFollowerIsBeingProcessed, setRemoveFollowerIsBeingProcessed] = useState(false); 

    const handleRemoveFollower = async () => {
        setRemoveFollowerIsBeingProcessed(true);
        removeFollower(otherUserID);
        setRemoveFollowerIsBeingProcessed(false);
    }

    if (removeFollowerIsBeingProcessed) {
        return (
            <div>
                <p>Removing {otherUserID}...</p>
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
                    onClick={() => handleRemoveFollower()}
                    variant={"outlined"}
                    color="error"
                    sx={{ flex: 1 }}
                >
                    Remove
                </Button>
            </Box>
        </ListItem>
    );
}

export default DisplayFollower; 