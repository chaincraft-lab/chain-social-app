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
  Pagination,
  Chip
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

function TagsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data - replace with actual API call
  const tags = [
    {
      id: 1,
      name: 'Yapay Zeka',
      slug: 'yapay-zeka',
      articlesCount: 15,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Blockchain',
      slug: 'blockchain',
      articlesCount: 8,
      createdAt: '2024-01-11'
    },
    {
      id: 3,
      name: 'Futbol',
      slug: 'futbol',
      articlesCount: 12,
      createdAt: '2024-01-12'
    },
    {
      id: 4,
      name: 'Kripto Para',
      slug: 'kripto-para',
      articlesCount: 6,
      createdAt: '2024-01-13'
    },
    {
      id: 5,
      name: 'Web3',
      slug: 'web3',
      articlesCount: 4,
      createdAt: '2024-01-14'
    }
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getTagColor = (count: number) => {
    if (count >= 10) return 'primary';
    if (count >= 5) return 'secondary';
    return 'default';
  };

  return (
    <>
      <Head>
        <title>Etiketler - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Etiketler"
          subHeading="Makale etiketlerini yönetin"
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
                    Yeni Etiket
                  </Button>
                }
                title="Etiket Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Etiket ara..."
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
                        <TableCell>Etiket Adı</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell>Makale Sayısı</TableCell>
                        <TableCell>Popülerlik</TableCell>
                        <TableCell>Oluşturulma Tarihi</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                              {tag.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {tag.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {tag.articlesCount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                tag.articlesCount >= 10 ? 'Yüksek' :
                                tag.articlesCount >= 5 ? 'Orta' : 'Düşük'
                              }
                              color={getTagColor(tag.articlesCount) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {tag.createdAt}
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
                    count={Math.ceil(tags.length / itemsPerPage)}
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

TagsPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default TagsPage;