import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  AppBarProps,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logout, Person } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

// Styled components
const StyledAppBar = styled(AppBar)<AppBarProps>(() => ({
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const LogoTypography = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  flexGrow: 1,
  color: 'black',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  marginRight: theme.spacing(2),
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

export const Navigator: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logged out');
    handleMenuClose();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <StyledAppBar position="static">
        <Toolbar>
          <LogoTypography variant="h6">OVCMailer</LogoTypography>

          <NavButton>Users</NavButton>
          <NavButton>Approved Emails</NavButton>
          <NavButton>Email Editor</NavButton>

          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 2 }}
          >
            <Avatar
              alt="User Avatar"
              src="/path-to-avatar.jpg"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: '200px',
                borderRadius: 2,
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                John Doe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                john.doe@example.com
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      {/* Nội dung route con */}
      <div style={{ width: '100vw' }} className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Navigator;
