import DisplayUserLink from '../../functions/DisplayUserLink';
import DisplayPostUI from '../../functions/Post/DisplayPostUI';

import useViewOtherUsers from './useViewOtherUsers';

import { useState } from 'react';

import {
    Box,
    CircularProgress,
    Backdrop,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Grid,
    Typography,
    styled,
    Button,
} from '@mui/material';

import {
    FavoriteBorder,
    AccountCircle
} from '@mui/icons-material';

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const Description = styled(Typography)`
font-size: 1rem;
color: #666;
`;

const Container = styled(Box)`
  flex-direction: column;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: 100%;
  border: 1px solid #ccc; 
  padding: 1rem; 
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

const Caption = styled(Typography)`
  font-size: 1rem;
`;

function ViewOtherUsers() {

    const {
        viewableUserInfo,
        isLoading,
        userOwnUserDoc,
        savedPosts,
        handleFollow,
    } = useViewOtherUsers();

    const [selectedField, setSelectedField] = useState('followers');
    const selectedStyle = {
        backgroundColor: '#e6e6e6', 
    };

    if (isLoading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
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
                    <Title> {viewableUserInfo.username}'s Profile </Title>

                    <Description
                        marginBottom="1rem"
                    >
                        User ID: {viewableUserInfo.userID}
                    </Description>

                    <Description> Bio </Description>
                    <Caption
                    sx={{ marginBottom: '1rem' }}
                    > {viewableUserInfo.bio} </Caption>

                    {/* Follow button */}
                    {userOwnUserDoc.following.includes(viewableUserInfo.userID) && (
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Button
                                variant={"outlined"}
                                disabled
                                size='small'
                            >
                                Following
                            </Button>
                        </Box>
                    )}

                    {userOwnUserDoc.followRequestsSent.includes(viewableUserInfo.userID) && (
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Button
                                variant={"outlined"}
                                disabled
                                size='small'
                            >
                                Requested To Follow
                            </Button>
                        </Box>
                    )}

                    {!userOwnUserDoc.following.includes(viewableUserInfo.userID) && 
                    !userOwnUserDoc.followRequestsSent.includes(viewableUserInfo.userID) && (
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Button
                                variant={"outlined"}
                                size='small'
                                onClick={() => handleFollow(viewableUserInfo.userID)}
                            >
                                Follow
                            </Button>
                        </Box>
                    )}

                    <List>
                        {/* followers */}
                        <ListItemButton
                            onClick={() => setSelectedField('followers')}
                            selected={selectedField === 'followers' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <FavoriteBorder />
                            </ListItemIcon>
                            <ListItemText primary={`Followers (${viewableUserInfo.followers.length})`} />
                        </ListItemButton>

                        {/* following */}
                        <ListItemButton
                            onClick={() => setSelectedField('following')}
                            selected={selectedField === 'following' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Following (${viewableUserInfo.following.length})`} />
                        </ListItemButton>

                        {/* personal posts */}
                        <ListItemButton
                            onClick={() => setSelectedField('personalPosts')}
                            selected={selectedField === 'personalPosts' ? selectedStyle : null}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={`Personal Posts (${viewableUserInfo.personalPosts.length})`} />
                        </ListItemButton>
                    </List>
                </UserInfoContainer>
            </Grid>

            <Grid item xs={6}>
                {/* Second grid with personal posts */}
                <div style={{ height: '100vh', overflow: 'auto' }}>

                    {selectedField === 'followers' && (
                        <UserInfoContainer>
                            <Title>Followers</Title>
                            <List component="div">
                                {viewableUserInfo.followers.map((follower) => (
                                    <ListItem>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <DisplayUserLink userID={follower} />
                                    </ListItem>
                                ))}
                            </List>
                        </UserInfoContainer>
                    )}

                    {selectedField === 'following' && (
                        <UserInfoContainer>
                            <Title>Following</Title>
                            <List>
                                {viewableUserInfo.following.map((following) => (
                                    <ListItem>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <DisplayUserLink userID={following} />
                                    </ListItem>
                                ))}
                            </List>
                        </UserInfoContainer>
                    )}

                    {selectedField === 'personalPosts' && viewableUserInfo.personalPosts.map((postID) => (
                        <DisplayPostUI
                            postID={postID}
                            userOwnID={userOwnUserDoc.userID}
                            isAPersonalPost={false}
                            isASavedPost={savedPosts.includes(postID)}
                        />
                    ))}

                </div>
            </Grid>
        </Grid>
    );
}

export default ViewOtherUsers;