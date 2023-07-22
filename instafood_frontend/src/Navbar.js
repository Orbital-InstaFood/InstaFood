import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Stack } from '@mui/material';
import { Dashboard, Add, Person, PeopleAlt, Explore, Event, Logout } from '@mui/icons-material';
import './Navbar.css';
import useAuth from './authentication/authLogic';
import logoImage from './theme/InstaFood.png';
const links = [
    { path: '/dashboard', icon: <Dashboard />, label: 'Dashboard' },
    { path: '/newPost', icon: <Add />, label: 'Create' },
    { path: '/connect', icon: <PeopleAlt />, label: 'Connect' },
    { path: '/explore', icon: <Explore />, label: 'Explore' },
    { path: '/event', icon: <Event />, label: 'Event' },
    { path: '/viewProfile', icon: <Person />, label: 'Profile' },
];

function Navbar() {
    const location = useLocation();
    const { pathname } = location;
    const { handleLogout } = useAuth();

    if (pathname === '/createProfile') {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h6" component="div">
                            My App
                        </Typography>
                        <IconButton
                            color="inherit"
                            component={Link}
                            to="/"
                            onClick={handleLogout}
                            edge="end"
                            aria-label="logout"
                        >
                            <Logout />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#f5efea', height: '56px' }}>
            <Toolbar>
                <div className="logo-container">
                        <img src={logoImage} alt="Logo" className="logo" />                 
                </div>
                <div className="links-container">
                    {links.map((link, index) => (
                        <Button
                            key={index}
                            component={Link}
                            to={link.path}
                            variant={pathname === link.path ? 'contained' : 'text'}
                            startIcon={link.icon}
                            className={`navbar-link ${pathname === link.path ? 'active' : ''}`}
                            sx={{
                                '&.active': {
                                    color: '#fff', // Change to the desired color for the active link
                                },
                                '&.active:hover': {
                                    color: '#fff', // Change to the desired color for the active link on hover
                                },
                            }}
                        >
                            {link.label}
                        </Button>
                    ))}
                </div>
                <IconButton
                    color="primary"
                    component={Link}
                    to="/"
                    onClick={handleLogout}
                    edge="end"
                    aria-label="logout"
                >
                    <Logout />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
