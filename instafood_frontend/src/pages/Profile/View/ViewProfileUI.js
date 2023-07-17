import useViewProfile from './useViewProfile';

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Grid,
    CircularProgress,
    Box,
    Typography,
    styled,
    Button,
} from '@mui/material';

import {
    AccountCircle,
    FavoriteBorder,
} from '@mui/icons-material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DisplayRequestReceived from './DisplayRequestReceived';
import DisplayRequestSent from './DisplayRequestSent';
import DisplayFollower from './DisplayFollower';
import DisplayFollowing from './DisplayFollowing';
import DisplayPostUI from '../../../functions/Post/DisplayPostUI';

import {
    UserInfoContainer,
} from '../ProfileStyles';

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const Description = styled(Typography)`
font-size: 1rem;
color: #666;
`;

const Caption = styled(Typography)`
font-size: 1rem;
`;

/**
 * This component is used to render the view profile page
 * for the user's own profile.
 */
export default function ViewProfile() {

    const navigate = useNavigate();

    const {
        userDoc,
        UserDocEditor,
        savedPosts,
        isLoading
    } = useViewProfile();

    const [selectedField, setSelectedField] = useState('personalPosts');
    const selectedStyle = {
        backgroundColor: '#e6e6e6',
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={6}>
                {/* First grid with basic information */}
                <UserInfoContainer style={{ position: 'sticky', top: 0 }}>
                    <Title> {userDoc.username}</Title>

                    <Description
                        marginBottom="1rem"
                    >
                        User ID: {userDoc.userID}
                    </Description>

                    <Description> Bio </Description>
                    <Caption> {userDoc.bio} </Caption>

                    <List>
                        {/* followers */}
                        <ListItemButton
                            onClick={() => setSelectedField('followers')}
                            selected={selectedField === 'followers' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <FavoriteBorder />
                            </ListItemIcon>
                            <ListItemText primary={`Followers (${userDoc.followers.length})`} />
                        </ListItemButton>

                        {/* following */}
                        <ListItemButton
                            onClick={() => setSelectedField('following')}
                            selected={selectedField === 'following' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Following (${userDoc.following.length})`} />
                        </ListItemButton>

                        {/* follow requests received */}
                        <ListItemButton
                            onClick={() => setSelectedField('followRequestsReceived')}
                            selected={selectedField === 'followRequestsReceived' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Follow Requests Received (${userDoc.followRequestsReceived.length})`} />
                        </ListItemButton>

                        {/* follow requests sent */}
                        <ListItemButton
                            onClick={() => setSelectedField('followRequestsSent')}
                            selected={selectedField === 'followRequestsSent' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Follow Requests Sent (${userDoc.followRequestsSent.length})`} />
                        </ListItemButton>

                        {/* personal posts */}
                        <ListItemButton
                            onClick={() => setSelectedField('personalPosts')}
                            selected={selectedField === 'personalPosts' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Personal Posts (${userDoc.personalPosts.length})`} />
                        </ListItemButton>

                        {/* saved posts */}
                        <ListItemButton
                            onClick={() => setSelectedField('savedPosts')}
                            selected={selectedField === 'savedPosts' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Saved Posts (${savedPosts.length})`} />
                        </ListItemButton>

                    </List>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/editProfile')}
                    >
                        Edit Profile
                    </Button>
                </UserInfoContainer>
            </Grid>
            <Grid item xs={6}>
                {/* Second grid with personal posts */}
                <div style={{ height: '100vh', overflow: 'auto' }}>

                    {selectedField === 'followers' && (
                        <UserInfoContainer>
                            <Title>Followers</Title>
                            <List component="div">
                                {userDoc.followers.map((follower) => (
                                    <ListItem>
                                        <DisplayFollower
                                            otherUserID={follower}
                                            removeFollower={UserDocEditor.removeFollower}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </UserInfoContainer>
                    )}

                    {selectedField === 'following' && (
                        <UserInfoContainer>
                            <Title>Following</Title>
                            <List>
                                {userDoc.following.map((following) => (
                                    <ListItem>
                                        <DisplayFollowing
                                            otherUserID={following}
                                            unfollow={UserDocEditor.unfollow}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </UserInfoContainer>
                    )}

                    {selectedField === 'followRequestsReceived' && (
                        <UserInfoContainer>
                            <Title>Follow Requests Received</Title>
                            <List>
                                {userDoc.followRequestsReceived.map((followRequestReceived) => (
                                    <ListItem>
                                        <DisplayRequestReceived
                                            otherUserID={followRequestReceived}
                                            answerFollowRequest={UserDocEditor.answerFollowRequest}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </UserInfoContainer>
                    )}

                    {selectedField === 'followRequestsSent' && (
                        <UserInfoContainer>
                            <Title>Follow Requests Sent</Title>
                            <List>
                                {userDoc.followRequestsSent.map((followRequestSent) => (
                                    <ListItem>
                                        <DisplayRequestSent
                                            otherUserID={followRequestSent}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </UserInfoContainer>
                    )}

                    {selectedField === 'personalPosts' && [...userDoc.personalPosts].reverse().map((postID) => (
                        <DisplayPostUI
                            postID={postID}
                            userOwnID={userDoc.userID}
                            isAPersonalPost={true}
                            isASavedPost={savedPosts.includes(postID)}
                        />
                    ))}

                    {selectedField === 'savedPosts' && savedPosts.map((postID) => (
                        <DisplayPostUI
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