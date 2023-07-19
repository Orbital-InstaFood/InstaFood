
import useDisplayEvent from "./useDisplayEvent";
import DisplayUserLink from "../../functions/DisplayUserLink";
import { useState } from "react";
import {
    Box, Typography, Chip, styled, Button,
    List, ListItem, ListItemText, ListItemIcon, ListItemButton,
    IconButton, Backdrop, CircularProgress, Collapse,
    Paper, InputBase
} from "@mui/material";

import {
    AccountCircle, ArrowUpward,
    ExpandLess,
    ExpandMore,
    ChatBubbleOutline,
} from "@mui/icons-material";

const Container = styled(Box)`
  flex-direction: column,
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: "100%"; 
  border: 1px solid #ccc; 
  padding: 1rem; 
  `;
const Title = styled(Typography)`
  font-size: 1.5rem;
  font-weight: bold;
  `;

const Description = styled(Typography)`
  font-size: 1rem;
  color: #666;
  `;

export default function DisplayEventUI({ eventID, isAuthor }) {

    const {
        userDoc,
        eventDoc, eventDocEditorInstance,
        hasEnded,
        isInitialising,
        commentText, setCommentText, handleMakeComment,
    } = useDisplayEvent({ eventID: eventID });

    const [attendeesOpen, setAttendeesOpen] = useState(false); 
    const [commentsOpen, setCommentsOpen] = useState(false);

    if (isInitialising) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isInitialising}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <Container>
            <Title> {eventDoc.eventName} </Title>

            <Description>
                Host: <DisplayUserLink userID={eventDoc.creator} />
            </Description>

            <Description sx={{ marginTop: 1 }}>
                Description
            </Description>
            <Typography sx={{ marginBottom: 1 }}>
                {eventDoc.eventDescription}
            </Typography>

            <Description>
                Location: {eventDoc.eventPlace}
            </Description>

            <Description >
                Time: {eventDoc.eventTime.toString()}
            </Description>

            {eventDoc.categories && eventDoc.categories.length !== 0 && (
                <>
                    <Description sx={{ marginTop: '1rem' }}>
                        Categories
                    </Description>
                    {eventDoc.categories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            variant="outlined"
                            size="small"
                            sx={{ margin: '0.5rem' }}
                        />
                    ))}
                </>
            )}

            {eventDoc.ingredients && eventDoc.ingredients.length !== 0 && (
                <>
                    <Description sx={{ marginTop: '1rem' }}>
                        Ingredients
                    </Description>
                    {eventDoc.ingredients.map((ingredient) => (
                        <Chip
                            key={ingredient}
                            label={ingredient}
                            variant="outlined"
                            size="small"
                            sx={{ margin: '0.5rem' }}
                        />
                    ))}
                </>
            )}

            {eventDoc.attendees && (
                <List sx={{ width: '100%', marginTop: '1rem' }}>
                    <ListItemButton onClick={() => setAttendeesOpen(!attendeesOpen)}>
                        <ListItemIcon>
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary={`Attendees (${eventDoc.attendees.length})`} />
                        {attendeesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={attendeesOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {eventDoc.attendees.map((attendee) => (
                                <ListItem key={attendee} alignItems="flex-start">
                                    <ListItemIcon
                                        sx={{ marginLeft: '5rem' }}
                                    >
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<DisplayUserLink userID={attendee} />}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>
            )}

            {eventDoc.comments && (
                <List sx={{ width: '100%', marginTop: '1rem' }}>
                    <ListItemButton onClick={() => setCommentsOpen(!commentsOpen)}>
                        <ListItemIcon>
                            <ChatBubbleOutline />
                        </ListItemIcon>
                        <ListItemText primary={`Comments (${eventDoc.comments.length})`} />
                        {commentsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={commentsOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {eventDoc.comments.map((comment, index) => (
                                <ListItem key={index}
                                >
                                    <ListItemIcon

                                        sx={{ marginLeft: '5rem' }}
                                    >
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText primary={`${comment.commenterID}: ${comment.commentText}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>
            )}

            {hasEnded && (
                <Typography sx={{
                    marginTop: '1rem',
                    color: '#666'
                }}>
                    This event has ended.
                </Typography>
            )}


            {!isAuthor && !hasEnded && eventDoc.attendees.includes(userDoc.userID) && (
                <Button
                    variant="contained"
                    color="error"
                    sx={{ marginTop: '1rem' }}
                    onClick={eventDocEditorInstance.unattend}
                >
                    Cancel
                </Button>
            )}

            {!isAuthor && !hasEnded && !eventDoc.attendees.includes(userDoc.userID) && (
                <Button
                    variant="contained"
                    color="success"
                    sx={{ marginTop: '1rem' }}
                    onClick={eventDocEditorInstance.attend}
                    disabled={eventDoc.attendees.length >= eventDoc.attendeesLimit}
                >
                    Attend
                </Button>
            )}

            {!hasEnded && (
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
            )}
        </Container>
    );
}
