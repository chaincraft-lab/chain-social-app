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
  Pagination
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data - replace with actual API call
  const articles = [
    {
      id: 1,
      title: 'Teknoloji Dünyasındaki Son Gelişmeler',
      category: 'Teknoloji',
      author: 'Ahmet Yılmaz',
      status: 'PUBLISHED',
      publishedAt: '2024-01-15',
      views: 1250
    },
    {
      id: 2,
      title: 'Yapay Zeka ve Gelecek',
      category: 'Teknoloji',
      author: 'Ayşe Demir',
      status: 'DRAFT',
      publishedAt: null,
      views: 0
    },
    {
      id: 3,
      title: 'Sporda Bu Hafta',
      category: 'Spor',
      author: 'Mehmet Kaya',
      status: 'PUBLISHED',
      publishedAt: '2024-01-14',
      views: 850
    }
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Yayında';
      case 'DRAFT':
        return 'Taslak';
      case 'ARCHIVED':
        return 'Arşivlendi';
      default:
        return status;
    }
  };

  return (
    <>
      <Head>
        <title>Makaleler - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Makaleler"
          subHeading="Sitedeki tüm makaleleri yönetin"
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
                    Yeni Makale
                  </Button>
                }
                title="Makale Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Makale ara..."
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
                        <TableCell>Başlık</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Yazar</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Yayın Tarihi</TableCell>
                        <TableCell>Görüntülenme</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                              {article.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {article.category}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {article.author}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(article.status)}
                              color={getStatusColor(article.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {article.publishedAt || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {article.views}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Görüntüle" arrow>
                              <IconButton
                                sx={{
                                  '&:hover': {
                                    background: 'rgba(0, 123, 255, 0.1)'
                                  },
                                  color: 'primary.main'
                                }}
                                color="inherit"
                                size="small"
                              >
                                <VisibilityTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
                    count={Math.ceil(articles.length / itemsPerPage)}
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

ArticlesPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default ArticlesPage;