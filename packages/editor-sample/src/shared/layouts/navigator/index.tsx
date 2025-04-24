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
import { Send } from '@mui/icons-material';

// Styled components
const StyledAppBar = styled(AppBar)<AppBarProps>(() => ({
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const LogoTypography = styled(Typography)(() => ({
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  flexGrow: 1,
}));


const HighlightButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  marginRight: theme.spacing(2),
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));


const NavButton = styled(Button)(({ theme }) => ({
  color: 'black',
  marginRight: theme.spacing(2),
  textTransform: 'none'
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
      <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <LogoTypography variant="h6">
            <span style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              color: '#43a047', // xanh lá – thiện nguyện, năng lượng
              fontSize: '2rem',
            }}>
              OVC
            </span>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 200,
              color: '#1e88e5', // xanh dương – công nghệ, tin cậy
              marginLeft: '2px',
              fontSize: '1.4rem',
            }}>
              Mailer
            </span>
          </LogoTypography>

          {/* Nút nổi bật Send Email */}
          <HighlightButton
            variant="contained"
            startIcon={<Send />}
          >
            Send Email
          </HighlightButton>
          <NavButton>Email Editor</NavButton>
          <NavButton>Users</NavButton>
          <NavButton>My template</NavButton>
          <NavButton>My Emails</NavButton>

          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 2 }}
          >
            <Avatar
              alt="User Avatar"
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

      <Toolbar />

      {/* Nội dung route con */}
      <div style={{ width: '100vw' }} className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Navigator;
