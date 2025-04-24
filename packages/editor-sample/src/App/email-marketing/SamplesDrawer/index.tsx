import React from 'react';

import { Box, Divider, Drawer, Link, Stack, Typography, Toolbar } from '@mui/material';
import { LinkedIn, GitHub, Email, Facebook, Face } from '@mui/icons-material';

import { useSamplesDrawerOpen } from '../../../documents/editor/EditorContext';

import SidebarButton from './SidebarButton';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();

  // width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
  return (
    <Drawer
      open={samplesDrawerOpen}
      variant="permanent"
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            Public template
          </Typography>

          <Stack alignItems="flex-start">
            <SidebarButton href="#">Empty</SidebarButton>
            <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
            <SidebarButton href="#sample/one-time-password">One-time passcode (OTP)</SidebarButton>
            <SidebarButton href="#sample/reset-password">Reset password</SidebarButton>
            <SidebarButton href="#sample/order-ecomerce">E-commerce receipt</SidebarButton>
            <SidebarButton href="#sample/subscription-receipt">Subscription receipt</SidebarButton>
            <SidebarButton href="#sample/reservation-reminder">Reservation reminder</SidebarButton>
            <SidebarButton href="#sample/post-metrics-report">Post metrics</SidebarButton>
            <SidebarButton href="#sample/respond-to-message">Respond to inquiry</SidebarButton>
          </Stack>

          <Divider />

          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            Your template
          </Typography>

          <Stack alignItems="flex-start">
            <SidebarButton href="#">Empty</SidebarButton>
            <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
          </Stack>
        </Stack>

        {/* Author contact */}
        <Stack spacing={2} px={0.75} py={3}>
          <Box>
            <Typography variant="overline" gutterBottom>
              Connect with developer
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Loc Anh Phan 
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Link href="https://www.linkedin.com/in/phananhloc/" target="_blank" color="inherit">
                <LinkedIn fontSize="small" sx={{ color: '#0077B5' }} />
              </Link>
              <Link href="https://github.com/phananhlocpal" target="_blank" color="inherit">
                <GitHub fontSize="small" sx={{ color: '#171515' }} />
              </Link>
              <Link href="https://www.facebook.com/phananhloc.pal/" target="_blank" color="inherit">
                <Facebook fontSize="small" sx={{ color: '#1DA1F2' }} />
              </Link>
              <Link href="mailto:anhloc280@gmail.com" color="inherit">
                <Email fontSize="small" sx={{ color: '#D44638' }} />
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}
