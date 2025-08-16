import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Typography
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useUserStore } from 'src/stores/userStore';
import { UserResponse, CreateUserRequest, AdminUpdateUserRequest } from 'src/services';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserResponse | null;
  mode: 'create' | 'edit';
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSuccess,
  user,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    bio: '',
    role: 'USER' as 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN',
    isActive: true,
    isBlocked: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string>('');

  const { createUser, updateUser, loadingCreate, loadingUpdate } = useUserStore();

  // Form verilerini sıfırla
  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: '',
      bio: '',
      role: 'USER',
      isActive: true,
      isBlocked: false
    });
    setErrors({});
    setLocalError('');
  };

  // Modal açıldığında form verilerini ayarla
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && user) {
        setFormData({
          name: user.name || '',
          surname: user.surname || '',
          username: user.username || '',
          email: user.email || '',
          password: '',
          confirmPassword: '',
          avatar: user.avatar || '',
          bio: user.bio || '',
          role: user.role,
          isActive: user.isActive,
          isBlocked: user.isBlocked || false
        });
      } else {
        resetForm();
      }
    }
  }, [open, mode, user]);

  // Input değişikliklerini handle et
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Form validasyonu
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Ad zorunlu
    if (!formData.name.trim()) {
      newErrors.name = 'Ad zorunludur';
    }

    // E-posta zorunlu ve format kontrolü
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    // Yeni kullanıcı oluştururken şifre zorunlu
    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'Şifre zorunludur';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Şifre en az 6 karakter olmalıdır';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifre tekrarı zorunludur';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      }
    }

    // Username varsa format kontrolü
    if (formData.username && !/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = 'Kullanıcı adı sadece harf, rakam, nokta, tire ve alt çizgi içerebilir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLocalError('');

    try {
      let success = false;

      if (mode === 'create') {
        const createData: CreateUserRequest = {
          name: formData.name,
          surname: formData.surname || undefined,
          username: formData.username || undefined,
          email: formData.email,
          password: formData.password,
          avatar: formData.avatar || undefined,
          bio: formData.bio || undefined,
          role: formData.role
        };
        success = await createUser(createData);
      } else if (user) {
        const updateData: AdminUpdateUserRequest = {
          name: formData.name,
          surname: formData.surname || undefined,
          username: formData.username || undefined,
          avatar: formData.avatar || undefined,
          bio: formData.bio || undefined,
          role: formData.role,
          isActive: formData.isActive,
          isBlocked: formData.isBlocked
        };
        success = await updateUser(user.id, updateData);
      }

      if (success) {
        onSuccess();
      }
    } catch (error: any) {
      setLocalError(error.message || 'Bir hata oluştu');
    }
  };

  // Modal kapatma
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isLoading = loadingCreate || loadingUpdate;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? 'Yeni Kullanıcı Oluştur' : 'Kullanıcı Düzenle'}
      </DialogTitle>

      <DialogContent dividers>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Avatar Section */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={formData.avatar}
                sx={{ width: 100, height: 100 }}
              >
                {formData.name.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  width: 32,
                  height: 32
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Avatar URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Avatar URL"
              value={formData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </Grid>

          {/* Ad */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ad *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          {/* Soyad */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soyad"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              error={!!errors.surname}
              helperText={errors.surname}
            />
          </Grid>

          {/* Kullanıcı Adı */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              placeholder="ornek.kullanici"
            />
          </Grid>

          {/* E-posta */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="E-posta *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {/* Şifre (sadece create modda) */}
          {mode === 'create' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Şifre *"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Şifre Tekrarı *"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </>
          )}

          {/* Rol */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                label="Rol"
              >
                <MenuItem value="USER">Kullanıcı</MenuItem>
                <MenuItem value="AUTHOR">Yazar</MenuItem>
                <MenuItem value="EDITOR">Editör</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="SUPER_ADMIN">Süper Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Durum Switches (sadece edit modda) */}
          {mode === 'edit' && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                  }
                  label="Aktif"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isBlocked}
                      onChange={(e) => handleInputChange('isBlocked', e.target.checked)}
                    />
                  }
                  label="Bloklu"
                />
              </Box>
            </Grid>
          )}

          {/* Biyografi */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Biyografi"
              multiline
              rows={3}
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Kullanıcı hakkında kısa bilgi..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={isLoading}
        >
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {mode === 'create' ? 'Oluştur' : 'Güncelle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;