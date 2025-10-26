import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { 
  Container, 
  Tabs, 
  Tab, 
  Grid, 
  Typography, 
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton
} from '@mui/material';
import Footer from '@/components/Footer';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../../src/contexts/AuthContext';
import authService from '../../../../src/services/auth/AuthService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function AdminSettings() {
  const [currentTab, setCurrentTab] = useState<string>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  // Update form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const tabs = [
    { value: 'profile', label: 'Profile Information' },
    { value: 'security', label: 'Security' },
    { value: 'preferences', label: 'Preferences' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = async () => {
    setPasswordMessage(null);
    
    // Validations
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: 'Please fill in all fields'
      });
      return;
    }

    // Password matching validation is now also done on the backend
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: 'New passwords do not match'
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: 'New password must be at least 8 characters'
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const passwordPayload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
      
      console.log('Password change payload:', passwordPayload);
      
      await authService.changePassword(passwordPayload);

      setPasswordMessage({
        type: 'success',
        text: 'Your password has been successfully updated'
      });

      // Clear the form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error: any) {
      let errorMessage = 'An error occurred while updating password';
      
      if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid password format';
      }

      setPasswordMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const ProfileTab = useMemo(() => (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar 
            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
          >
            {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {user?.name} {user?.surname}
            </Typography>
            <Typography color="textSecondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.surname}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('surname', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              value={user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
              disabled
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          {!isEditing ? (
            <Button 
              variant="contained" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Box display="flex" gap={2}>
              <Button variant="contained" color="primary">
                Save
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  ), [formData, isEditing, user]);

  const SecurityTab = useMemo(() => (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.currentPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      edge="end"
                    >
                      {showPasswords.currentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('newPassword')}
                      edge="end"
                    >
                      {showPasswords.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      edge="end"
                    >
                      {showPasswords.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>

        {passwordMessage && (
          <Alert severity={passwordMessage.type} sx={{ mt: 3 }}>
            {passwordMessage.text}
          </Alert>
        )}

        <Box mt={3}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handlePasswordChange}
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          Use a strong password for security. It should contain at least 8 characters, uppercase and lowercase letters, numbers and special characters.
        </Alert>
      </CardContent>
    </Card>
  ), [formData, showPasswords, passwordLoading, passwordMessage]);

  const PreferencesTab = useMemo(() => (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Dashboard Preferences
        </Typography>
        
        <Box mt={3}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Email notifications"
          />
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Notification for new user registrations"
          />
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Notification for system updates"
          />
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={<Switch />}
            label="Dark theme"
          />
        </Box>

        <Box mt={3}>
          <Button variant="contained" color="primary">
            Save Preferences
          </Button>
        </Box>
      </CardContent>
    </Card>
  ), []);

  return (
    <>
      <Head>
        <title>Admin Settings - ChainSocial Dashboard</title>
      </Head>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'profile' && ProfileTab}
            {currentTab === 'security' && SecurityTab}
            {currentTab === 'preferences' && PreferencesTab}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

AdminSettings.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AdminSettings;
