import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';
import { useAuth } from '../../../src/contexts/AuthContext';

import { 
  Grid, 
  Container, 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Box,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

const ProfileCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  background: `linear-gradient(135deg, ${theme.colors.gradients.blue1}, ${theme.colors.gradients.blue2})`,
  color: 'white',
  marginBottom: theme.spacing(3),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.colors.alpha.white[100]}`,
  marginBottom: theme.spacing(2),
}));

function AdminProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/management/profile/settings');
  };

  return (
    <>
      <Head>
        <title>Admin Profile - ChainSocial Dashboard</title>
      </Head>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProfileCard>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <ProfileAvatar>
                  {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
                </ProfileAvatar>
                <Typography variant="h4" gutterBottom>
                  {user?.name} {user?.surname}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                  {user?.email}
                </Typography>
                <Chip 
                  label={user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </ProfileCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    User ID
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.id}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    UUID
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.uuid}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    Role
                  </Typography>
                  <Typography variant="body1">
                    {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Access
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => router.push('/management/profile/settings')}
                    fullWidth
                  >
                    Profile Settings
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => router.push('/articles')}
                    fullWidth
                  >
                    Manage Articles
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => router.push('/users')}
                    fullWidth
                  >
                    Manage Users
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

AdminProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AdminProfile;
