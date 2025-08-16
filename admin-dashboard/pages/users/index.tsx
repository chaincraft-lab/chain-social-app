import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Pagination,
  Avatar
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data - replace with actual API call
  const users = [
    {
      id: 1,
      name: 'Ahmet',
      surname: 'Yılmaz',
      username: 'ahmet.yilmaz',
      email: 'ahmet@example.com',
      role: 'ADMIN',
      isActive: true,
      articlesCount: 15,
      joinedAt: '2024-01-01',
      avatar: null
    },
    {
      id: 2,
      name: 'Ayşe',
      surname: 'Demir',
      username: 'ayse.demir',
      email: 'ayse@example.com',
      role: 'EDITOR',
      isActive: true,
      articlesCount: 8,
      joinedAt: '2024-01-05',
      avatar: null
    },
    {
      id: 3,
      name: 'Mehmet',
      surname: 'Kaya',
      username: 'mehmet.kaya',
      email: 'mehmet@example.com',
      role: 'USER',
      isActive: true,
      articlesCount: 0,
      joinedAt: '2024-01-10',
      avatar: null
    },
    {
      id: 4,
      name: 'Fatma',
      surname: 'Özkan',
      username: 'fatma.ozkan',
      email: 'fatma@example.com',
      role: 'USER',
      isActive: false,
      articlesCount: 0,
      joinedAt: '2024-01-12',
      avatar: null
    }
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'EDITOR':
        return 'warning';
      case 'USER':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Yönetici';
      case 'EDITOR':
        return 'Editör';
      case 'USER':
        return 'Kullanıcı';
      default:
        return role;
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <Head>
        <title>Kullanıcılar - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Kullanıcılar"
          subHeading="Sistem kullanıcılarını yönetin"
          docs="https://example.com"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                action={
                  <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                  >
                    Yeni Kullanıcı
                  </Button>
                }
                title="Kullanıcı Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Kullanıcı ara..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchTwoToneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '20%' }}>Kullanıcı</TableCell>
                        <TableCell sx={{ width: '12%' }}>Kullanıcı Adı</TableCell>
                        <TableCell sx={{ width: '18%' }}>E-posta</TableCell>
                        <TableCell sx={{ width: '10%' }}>Rol</TableCell>
                        <TableCell sx={{ width: '8%' }}>Durum</TableCell>
                        <TableCell sx={{ width: '10%' }}>Makale Sayısı</TableCell>
                        <TableCell sx={{ width: '12%' }}>Katılım Tarihi</TableCell>
                        <TableCell align="right" sx={{ width: '10%' }}>İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2 }}>
                                {getInitials(user.name, user.surname)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                                  {user.name} {user.surname}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getRoleText(user.role)}
                              color={getRoleColor(user.role) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.isActive ? 'Aktif' : 'Pasif'}
                              color={user.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.articlesCount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.joinedAt}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Düzenle" arrow>
                              <IconButton
                                sx={{
                                  '&:hover': {
                                    background: 'rgba(255, 193, 7, 0.1)'
                                  },
                                  color: 'warning.main'
                                }}
                                color="inherit"
                                size="small"
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={user.isActive ? 'Engelle' : 'Aktifleştir'} arrow>
                              <IconButton
                                sx={{
                                  '&:hover': {
                                    background: 'rgba(255, 152, 0, 0.1)'
                                  },
                                  color: 'orange'
                                }}
                                color="inherit"
                                size="small"
                              >
                                <BlockTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sil" arrow>
                              <IconButton
                                sx={{
                                  '&:hover': {
                                    background: 'rgba(220, 53, 69, 0.1)'
                                  },
                                  color: 'error.main'
                                }}
                                color="inherit"
                                size="small"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={Math.ceil(users.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

UsersPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default UsersPage;