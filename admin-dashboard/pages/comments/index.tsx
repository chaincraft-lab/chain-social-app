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
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data - replace with actual API call
  const comments = [
    {
      id: 1,
      content: 'Bu makale gerçekten çok faydalı olmuş. Teşekkürler!',
      author: {
        name: 'Ali',
        surname: 'Veli',
        avatar: null
      },
      article: {
        title: 'Teknoloji Dünyasındaki Son Gelişmeler'
      },
      status: 'PENDING',
      createdAt: '2024-01-15 14:30',
      isReply: false
    },
    {
      id: 2,
      content: 'Konuyla ilgili daha detaylı bilgi alabilir miyiz?',
      author: {
        name: 'Ayşe',
        surname: 'Kaya',
        avatar: null
      },
      article: {
        title: 'Yapay Zeka ve Gelecek'
      },
      status: 'APPROVED',
      createdAt: '2024-01-15 13:15',
      isReply: false
    },
    {
      id: 3,
      content: 'Spam içerik...',
      author: {
        name: 'Test',
        surname: 'User',
        avatar: null
      },
      article: {
        title: 'Sporda Bu Hafta'
      },
      status: 'REJECTED',
      createdAt: '2024-01-15 12:00',
      isReply: false
    },
    {
      id: 4,
      content: 'Harika bir yazı olmuş, paylaştığınız için teşekkürler.',
      author: {
        name: 'Mehmet',
        surname: 'Öz',
        avatar: null
      },
      article: {
        title: 'Teknoloji Dünyasındaki Son Gelişmeler'
      },
      status: 'APPROVED',
      createdAt: '2024-01-15 11:45',
      isReply: true
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
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Onaylandı';
      case 'PENDING':
        return 'Beklemede';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      <Head>
        <title>Yorumlar - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Yorumlar"
          subHeading="Makale yorumlarını yönetin ve modere edin"
          docs="https://example.com"
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Yorum Listesi"
                subheader="Bekleyen yorumları onaylayın veya reddedin"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Yorum ara..."
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
                        <TableCell>Yazar</TableCell>
                        <TableCell>Yorum</TableCell>
                        <TableCell>Makale</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Tip</TableCell>
                        <TableCell>Tarih</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                {getInitials(comment.author.name, comment.author.surname)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold" color="text.primary" noWrap>
                                  {comment.author.name} {comment.author.surname}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {truncateText(comment.content, 60)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {truncateText(comment.article.title, 30)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(comment.status)}
                              color={getStatusColor(comment.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={comment.isReply ? 'Yanıt' : 'Yorum'}
                              color={comment.isReply ? 'secondary' : 'primary'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {comment.createdAt}
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
                            {comment.status === 'PENDING' && (
                              <>
                                <Tooltip title="Onayla" arrow>
                                  <IconButton
                                    sx={{
                                      '&:hover': {
                                        background: 'rgba(76, 175, 80, 0.1)'
                                      },
                                      color: 'success.main'
                                    }}
                                    color="inherit"
                                    size="small"
                                  >
                                    <CheckTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reddet" arrow>
                                  <IconButton
                                    sx={{
                                      '&:hover': {
                                        background: 'rgba(244, 67, 54, 0.1)'
                                      },
                                      color: 'error.main'
                                    }}
                                    color="inherit"
                                    size="small"
                                  >
                                    <CloseTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
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
                    count={Math.ceil(comments.length / itemsPerPage)}
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

CommentsPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default CommentsPage;