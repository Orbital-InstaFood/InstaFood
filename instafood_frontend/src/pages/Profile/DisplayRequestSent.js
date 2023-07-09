import {
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

import {
    AccountCircle,
} from '@mui/icons-material';

import DisplayUserLink from '../../functions/DisplayUserLink';

function DisplayRequestSent({ otherUserID }) {

    return (
        <ListItem>
            <ListItemIcon>
                <AccountCircle />
            </ListItemIcon>
            <ListItemText primary={
                <DisplayUserLink userID={otherUserID} />
            } />
        </ListItem>
    );
}

export default DisplayRequestSent;
