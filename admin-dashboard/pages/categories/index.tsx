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
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data - replace with actual API call
  const categories = [
    {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji ile ilgili haberler',
      articlesCount: 25,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Spor',
      slug: 'spor',
      description: 'Spor haberleri ve güncel gelişmeler',
      articlesCount: 18,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Ekonomi',
      slug: 'ekonomi',
      description: 'Ekonomi ve finans haberleri',
      articlesCount: 12,
      createdAt: '2024-01-11'
    },
    {
      id: 4,
      name: 'Sağlık',
      slug: 'saglik',
      description: 'Sağlık ve yaşam haberleri',
      articlesCount: 8,
      createdAt: '2024-01-12'
    }
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Head>
        <title>Kategoriler - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Kategoriler"
          subHeading="Haber kategorilerini yönetin"
          docs="https://example.com"
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
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
                    Yeni Kategori
                  </Button>
                }
                title="Kategori Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Kategori ara..."
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
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Kategori Adı</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell>Açıklama</TableCell>
                        <TableCell>Makale Sayısı</TableCell>
                        <TableCell>Oluşturulma Tarihi</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                              {category.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {category.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {category.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {category.articlesCount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {category.createdAt}
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
                    count={Math.ceil(categories.length / itemsPerPage)}
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

CategoriesPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default CategoriesPage;