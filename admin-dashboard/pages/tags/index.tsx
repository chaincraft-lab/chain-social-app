import { useState, useEffect, ChangeEvent, useMemo } from 'react';
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
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTagStore } from 'src/stores/tagStore';
import { TagResponse } from 'src/services';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import TagModal from 'src/components/TagModal';

function TagsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'articlesCount'>('createdAt');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);

  // Tag store
  const {
    tags,
    pagination,
    loading,
    loadingDelete,
    error,
    fetchTags,
    deleteTag,
    clearError
  } = useTagStore();

  // Sayfa yüklendiğinde tagları getir
  useEffect(() => {
    fetchTags(1, 10);
  }, [fetchTags]);

  // Search ve sıralama
  const filteredTags = useMemo(() => {
    if (!tags || !Array.isArray(tags)) return [];
    
    let filtered = tags.filter(tag => {
      if (!tag || typeof tag !== 'object' || !tag.name) return false;
      
      const searchMatch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return searchMatch;
    });

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'articlesCount':
          return (b.articlesCount || 0) - (a.articlesCount || 0);
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [tags, searchTerm, sortBy]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    fetchTags(value, pagination.limit);
  };

  const handleDeleteClick = (tagId: number) => {
    setTagToDelete(tagId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tagToDelete) {
      const success = await deleteTag(tagToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setTagToDelete(null);
        fetchTags(pagination.page, pagination.limit);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTagToDelete(null);
  };

  const handleRefresh = () => {
    fetchTags(pagination.page, pagination.limit);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: tr });
    } catch {
      return dateString;
    }
  };

  const handleCreateClick = () => {
    setModalMode('create');
    setEditingTag(null);
    setModalOpen(true);
  };

  const handleEditClick = (tag: TagResponse) => {
    setModalMode('edit');
    setEditingTag(tag);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTag(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    handleRefresh();
  };

  const getPopularityLevel = (count: number): { label: string; color: 'success' | 'warning' | 'error' | 'default' } => {
    if (count >= 20) return { label: 'Çok Popüler', color: 'success' };
    if (count >= 10) return { label: 'Popüler', color: 'warning' };
    if (count >= 5) return { label: 'Orta', color: 'default' };
    return { label: 'Az Kullanılan', color: 'error' };
  };

  return (
    <>
      <Head>
        <title>Etiketler - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Etiketler"
          subHeading="Haber etiketlerini yönetin"
          docs="https://example.com"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
                {error}
              </Alert>
            )}
            <Card>
              <CardHeader
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon fontSize="small" />}
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      Yenile
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleCreateClick}
                    >
                      Yeni Etiket
                    </Button>
                  </Box>
                }
                title="Etiket Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
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
                    sx={{ flex: 1, minWidth: 250 }}
                  />
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Sıralama</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={handleSortChange}
                      label="Sıralama"
                    >
                      <MenuItem value="createdAt">Oluşturma Tarihi</MenuItem>
                      <MenuItem value="name">İsim</MenuItem>
                      <MenuItem value="articlesCount">Makale Sayısı</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '25%' }}>Etiket Adı</TableCell>
                            <TableCell sx={{ width: '20%' }}>Slug</TableCell>
                            <TableCell sx={{ width: '15%' }}>Makale Sayısı</TableCell>
                            <TableCell sx={{ width: '15%' }}>Popülerlik</TableCell>
                            <TableCell sx={{ width: '15%' }}>Oluşturulma Tarihi</TableCell>
                            <TableCell align="right" sx={{ width: '10%' }}>İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredTags.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                <Typography variant="body2" color="text.secondary">
                                  {searchTerm 
                                    ? 'Arama kriterinize uygun etiket bulunamadı.' 
                                    : 'Henüz etiket eklenmemiş.'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredTags.map((tag) => {
                              const popularity = getPopularityLevel(tag.articlesCount || 0);
                              return (
                                <TableRow key={tag.id}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {(tag.articlesCount || 0) >= 15 && (
                                        <TrendingUpIcon fontSize="small" color="success" />
                                      )}
                                      <Typography variant="body1" fontWeight="medium" color="text.primary">
                                        {tag.name}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                      {tag.slug}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {tag.articlesCount || 0} makale
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={popularity.label}
                                      color={popularity.color}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {formatDate(tag.createdAt)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Tooltip title="Düzenle" arrow>
                                      <IconButton
                                        sx={{
                                          '&:hover': {
                                            background: 'rgba(25, 118, 210, 0.1)'
                                          },
                                          color: 'primary.main'
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => handleEditClick(tag)}
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
                                        onClick={() => handleDeleteClick(tag.id)}
                                        disabled={loadingDelete}
                                      >
                                        <DeleteTwoToneIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {!searchTerm && pagination?.totalPages > 1 && (
                      <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                          count={pagination.totalPages}
                          page={pagination.page}
                          onChange={handlePageChange}
                          color="primary"
                        />
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Etiketi Sil
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Bu etiketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              Etiket, ilişkili olduğu makalelerden de kaldırılacaktır.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loadingDelete}>
              İptal
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loadingDelete}
              startIcon={loadingDelete ? <CircularProgress size={16} /> : null}
            >
              Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tag Create/Edit Modal */}
        <TagModal
          open={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          tag={editingTag}
          mode={modalMode}
        />
      </Container>
    </>
  );
}

TagsPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default TagsPage;