import DisplayUserForConnect from './DisplayUserForConnect';

import useConnectLogic from './useConnectLogic';

import {
    Backdrop,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Grid,
    Box,
    Typography,
    styled,
    TextField,
    Button,
} from '@mui/material';

const Title = styled(Typography)`
font-size: 1.5rem;
font-weight: bold;
`;

const Description = styled(Typography)`
font-size: 1rem;
color: #666;
margin-bottom: 1rem;
`;

const Container = styled(Box)`
  flex-direction: column;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  width: 600px;
  border: 1px solid #ccc; 
  padding: 1rem; 
  `;

function ConnectUI() {

    const {
        isLoading,
        input, setInput,
        listOfPossibleMatches,
        userDoc,
        handleFollowRequest,
    } = useConnectLogic();

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
        <Grid container>
            <Grid item xs={12}>
                <Container>

                    <Title>CONNECT</Title>
                    <Description>Check out who else is on Instafood!</Description>

                    <TextField
                        fullWidth
                        label="Search by their user ids"
                        type="text"
                        value={input}
                        margin='normal'
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <List>
                        {listOfPossibleMatches.map((otherUserID) => (
                            <ListItem key={otherUserID}>
                                <DisplayUserForConnect
                                    otherUserID={otherUserID}
                                    following={userDoc.following}
                                    followRequestsSent={userDoc.followRequestsSent}
                                    handleFollowRequest={handleFollowRequest}
                                />
                            </ListItem>
                        ))}
                    </List>

                </Container>
            </Grid>
        </Grid>
    );
}

export default ConnectUI;