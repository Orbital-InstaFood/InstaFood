import DisplayUserLink from '../../functions/DisplayUserLink';

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

function DisplayUserForConnect({
    otherUserID,
    following,
    followRequestsSent,
    handleFollowRequest,
}) {

    if (following.includes(otherUserID)) {
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
                    variant={"outlined"}
                    disabled
                >
                    Following
                </Button>
            </Box>
        </ListItem>
        );
    }

    if (followRequestsSent.includes(otherUserID)) {
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
                    variant={"outlined"}
                    disabled
                >
                    Requested
                </Button>
            </Box>
        </ListItem>
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
                    onClick={() => handleFollowRequest(otherUserID)}
                    variant={"outlined"}
                    color="primary"
                >
                    Follow
                </Button>
            </Box>
        </ListItem>
    );
}

export default DisplayUserForConnect;