import { useState } from "react";
import DisplayUserLink from "../DisplayUserLink";
import saveOrUnsaveAPost from "./saveOrUnsaveAPost";
import useDisplayPostLogic from "./useDisplayPostLogic";

import { 
    List, 
    ListItem, 
    ListItemText, 
    Collapse, 
    ListItemIcon, 
    ListItemButton,
    Paper,
    InputBase,
    Button,
    IconButton,
    Chip,
    CircularProgress,
 } from "@mui/material";

import {
    PostContainer,
    Title,
    Description,
    Caption,
    SubHeading,
    ImagePreview,
    Image,
    LeftArrowContainer,
    ButtonOverlay,
    RightArrowContainer,
} from './PostStyles.js';

import { Box } from "@mui/system";

import {
    ChevronLeft,
    ChevronRight,
    BookmarkBorder,
    Bookmark,
    FavoriteBorder,
    Favorite,
    ExpandLess,
    ExpandMore,
    ChatBubbleOutline,
    Delete,
    AccountCircle,
    ArrowUpward,
} from '@mui/icons-material';

function DisplayPostUI({ postID, userOwnID, isAPersonalPost, isASavedPost }) {

    const {
        postDoc,
        isLoading,
        commentText, setCommentText,
        handleMakeComment, handleLikeOrDislike, handleDeleteComment,
    } = useDisplayPostLogic({ postID, userOwnID });

    const [shouldShowArrows, setShouldShowArrows] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isSaved, setIsSaved] = useState(isASavedPost);
    function handleSaveOrUnsaveAPost() {
        saveOrUnsaveAPost(postID, !isSaved);
        setIsSaved(!isSaved);
    }

    const [likesOpen, setLikesOpen] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          );
    }

    return (
        <PostContainer>
            <Title>{postDoc.title}</Title>

            <Description>
                <div>
                    Creator: {
                        <DisplayUserLink userID={postDoc.creator} />
                    }
                </div>
                <div>
                    Date: {postDoc.date_created.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </Description>

            <SubHeading>
                Categories
            </SubHeading>

            {postDoc.categories &&
                postDoc.categories.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        variant="outlined"
                        size="small"
                        sx={{ margin: '0.5rem' }}
                    />
                ))
            }

            <SubHeading
                sx={{ marginTop: '1rem' }}
            >
                Recipe Details
            </SubHeading>

            <Caption>
                {postDoc.caption}
            </Caption>

            <SubHeading
                sx={{ marginTop: '1rem' }}
            >
                Check out others' opinions!
            </SubHeading>

            <List>
                {/* Likes */}
                <ListItemButton onClick={() => setLikesOpen(!likesOpen)}>
                    <ListItemIcon>
                        <FavoriteBorder />
                    </ListItemIcon>
                    <ListItemText primary={`Likes (${postDoc.likes.length})`} />
                    {likesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={likesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {postDoc.likes.map((like, index) => (
                            <ListItem key={index}
                            >
                                <ListItemIcon
                                    sx={{ marginLeft: '5rem' }}
                                >
                                    <AccountCircle />
                                </ListItemIcon>
                                {/* <ListItemText primary={like} /> */}
                                <DisplayUserLink userID={like} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>

                {/* Comments */}
                <ListItemButton onClick={() => setCommentsOpen(!commentsOpen)}>
                    <ListItemIcon>
                        <ChatBubbleOutline />
                    </ListItemIcon>
                    <ListItemText primary={`Comments (${postDoc.comments.length})`} />
                    {commentsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={commentsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {postDoc.comments.map((comment, index) => (
                            <ListItem key={index}
                            >
                                <ListItemIcon

                                    sx={{ marginLeft: '5rem' }}
                                >
                                    <AccountCircle />
                                </ListItemIcon>
                                <ListItemText primary={`${comment.commenterID}: ${comment.commentText}`} />
                                {userOwnID === comment.commenterID && (
                                    <IconButton
                                        onClick={() => handleDeleteComment(comment.commentID)}
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </List>

            {postDoc.images.length > 0 && (

                <Box
                    sx={{ marginTop: 2 }}
                    onMouseEnter={() => setShouldShowArrows(true)}
                    onMouseLeave={() => setShouldShowArrows(false)}
                >
                    <ImagePreview key={postDoc.images[currentImageIndex]}>
                        <Image src={postDoc.images[currentImageIndex]} alt="preview" />

                        {shouldShowArrows && (
                            <LeftArrowContainer>
                                <ButtonOverlay />
                                <IconButton
                                    onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: 0,
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'auto',
                                    }}
                                    disabled={currentImageIndex === 0}
                                >
                                    <ChevronLeft />
                                </IconButton>
                            </LeftArrowContainer>
                        )}

                        {shouldShowArrows && (
                            <RightArrowContainer>
                                <ButtonOverlay />
                                <IconButton
                                    onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 0,
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'auto',
                                    }}
                                    disabled={currentImageIndex === postDoc.images.length - 1}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </RightArrowContainer>

                        )}


                    </ImagePreview>

                </Box>
            )}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop="2rem"
            >
                <Button
                    startIcon={postDoc.likes.includes(userOwnID) ? <Favorite /> : <FavoriteBorder />}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ flex: 1 }}
                    onClick={() => handleLikeOrDislike()}
                >
                    {postDoc.likes.includes(userOwnID) ? "Unlike" : "Like"}
                </Button>

                {(
                    <Button
                        startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
                        onClick={() => handleSaveOrUnsaveAPost()}
                        variant={"outlined"}
                        disabled={isAPersonalPost}
                        color="primary"
                        fullWidth
                        sx={{ flex: 1 }}
                    >
                        {isSaved ? "Unsave" : "Save"}
                    </Button>
                )}
            </Box>

            <Paper
                sx={{ 
                    marginTop: '2rem', 
                    display: 'flex',
                    p: '2px 4px',
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Add a comment..."
                    inputProps={{ 'aria-label': 'add a comment' }}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <IconButton
                    sx={{ p: '10px' }}
                    onClick={() => handleMakeComment()}
                >
                    <ArrowUpward />
                </IconButton>
            </Paper>



        </PostContainer>
    );

}

export default DisplayPostUI;
