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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logout, Person } from '@mui/icons-material';

// Styled components với type rõ ràng
const StyledAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
  backgroundColor: '#1976d2',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  flexGrow: 1,
  color: '#fff',
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

  // Handle avatar menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here (e.g., clear token, redirect)
    console.log('Logged out');
    handleMenuClose();
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        {/* Logo */}
        <LogoTypography variant="h6">
          OVCMailer
        </LogoTypography>

        {/* Navigation Buttons */}
        <NavButton>
          User
        </NavButton>
        <NavButton>
          Approved email
        </NavButton>
        <NavButton>
          Email editor
        </NavButton>

        {/* Avatar */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenuOpen}
          sx={{ ml: 2 }}
        >
          <Avatar
            alt="User Avatar"
            src="/path-to-avatar.jpg" // Thay bằng đường dẫn thực tế hoặc URL
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>

        {/* Avatar Menu */}
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
          {/* User Info */}
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              John Doe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              john.doe@example.com
            </Typography>
          </Box>
          <Divider />

          {/* Menu Items */}
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
  );
};

export default Navigator;