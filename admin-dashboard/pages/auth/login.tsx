import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/router';
import Logo from '../../src/components/Logo';

const LoginCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  boxShadow: theme.shadows[10],
}));

const LoginContainer = styled(Container)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      // API hata kodlarına göre mesaj belirle
      if (err.response?.status === 401) {
        setError('Kullanıcı adı veya şifre hatalı');
      } else if (err.response?.status === 400) {
        setError('Geçersiz bilgiler girdiniz');
      } else if (err.message?.includes('admin yetkisi')) {
        setError(err.message);
      } else {
        setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Girişi - ChainSocial Dashboard</title>
        <meta name="description" content="Admin panel girişi" />
      </Head>
      
      <LoginContainer maxWidth={false}>
        <LoginCard>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Logo />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Admin Girişi
            </Typography>
            <Typography color="text.secondary">
              Dashboard'a erişmek için giriş yapın
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Sadece admin yetkisine sahip kullanıcılar giriş yapabilir
          </Typography>
        </LoginCard>
      </LoginContainer>
    </>
  );
};

export default LoginPage;