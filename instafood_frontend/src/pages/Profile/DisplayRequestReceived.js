import { useState } from 'react';

import {
    Typography,
    CircularProgress,
    Box,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
} from '@mui/material';

import {
    NotInterested,
    Check,
    AccountCircle,
} from '@mui/icons-material';

import DisplayUserLink from '../../functions/DisplayUserLink';

function DisplayRequestReceived({ otherUserID, answerFollowRequest }) {
    const [requestIsBeingProcessed, setRequestIsBeingProcessed] = useState(false);

    const handleAcceptOrReject = async (isAccepted) => {
        setRequestIsBeingProcessed(true);
        answerFollowRequest(otherUserID, isAccepted);
        setRequestIsBeingProcessed(false);
    };

    if (requestIsBeingProcessed) {
        return (
            <div>
                <Typography variant="body1">Request from {otherUserID} is being processed...</Typography>
                <CircularProgress />
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
                    startIcon={<Check />}
                    onClick={() => handleAcceptOrReject(true)}
                    variant={"outlined"}
                    color="primary"
                    sx={{ flex: 1 }}
                >
                    Accept
                </Button>

                <Button
                    startIcon={<NotInterested />}
                    onClick={() => handleAcceptOrReject(false)}
                    variant={"outlined"}
                    color="error"
                    sx={{ flex: 1 }}
                >
                    Reject
                </Button>
            </Box>
        </ListItem>
    );
}

export default DisplayRequestReceived;
