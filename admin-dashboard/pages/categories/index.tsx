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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCategoryStore } from 'src/stores/categoryStore';
import { CategoryResponse } from 'src/services';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import CategoryModal from 'src/components/CategoryModal';

function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

  // Zustand store
  const {
    categories,
    pagination,
    loading,
    loadingDelete,
    loadingUpdate,
    error,
    fetchCategories,
    deleteCategory,
    toggleCategoryActive,
    clearError
  } = useCategoryStore();

  // Sayfa yüklendiğinde kategorileri getir
  useEffect(() => {
    fetchCategories(1, 10);
  }, [fetchCategories]);

  // Search ve durum filtresi
  const filteredCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    
    return categories.filter(category => {
      // Kategori objesinin geçerli olup olmadığını kontrol et
      if (!category || typeof category !== 'object' || !category.name) return false;
      
      // Durum filtresi
      if (statusFilter === 'active' && !category.isActive) return false;
      if (statusFilter === 'inactive' && category.isActive) return false;
      
      // Arama filtresi
      const searchMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return searchMatch;
    });
  }, [categories, searchTerm, statusFilter]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    fetchCategories(value, pagination.limit);
  };

  const handleDeleteClick = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      const success = await deleteCategory(categoryToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        // Silme işleminden sonra listeyi yeniden fetch et
        fetchCategories(pagination.page, pagination.limit);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleRefresh = () => {
    fetchCategories(pagination.page, pagination.limit);
  };

  const handleToggleActive = async (categoryId: number) => {
    const success = await toggleCategoryActive(categoryId);
    if (success) {
      handleRefresh();
    }
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
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEditClick = (category: CategoryResponse) => {
    setModalMode('edit');
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    handleRefresh();
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
                      Yeni Kategori
                    </Button>
                  </Box>
                }
                title="Kategori Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    flex="1"
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
                    sx={{ flex: 1 }}
                  />
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Durum</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      label="Durum"
                    >
                      <MenuItem value="all">Tümü</MenuItem>
                      <MenuItem value="active">Aktif</MenuItem>
                      <MenuItem value="inactive">Pasif</MenuItem>
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
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Kategori Adı</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Açıklama</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Makale Sayısı</TableCell>
                            <TableCell>Oluşturulma Tarihi</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredCategories.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                <Typography variant="body2" color="text.secondary">
                                  {searchTerm ? 'Arama kriterinize uygun kategori bulunamadı.' : 'Henüz kategori eklenmemiş.'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredCategories.map((category) => (
                              <TableRow key={category.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {category.color && (
                                      <Box
                                        sx={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: '50%',
                                          backgroundColor: category.color,
                                          border: '1px solid #e0e0e0'
                                        }}
                                      />
                                    )}
                                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                                      {category.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {category.slug}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {category.description || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={category.isActive ? 'Aktif' : 'Pasif'}
                                    color={category.isActive ? 'success' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {category.articleCount || 0}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {formatDate(category.createdAt)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Tooltip title={category.isActive ? 'Pasif Yap' : 'Aktif Yap'} arrow>
                                    <IconButton
                                      sx={{
                                        '&:hover': {
                                          background: category.isActive ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)'
                                        },
                                        color: category.isActive ? 'warning.main' : 'success.main'
                                      }}
                                      color="inherit"
                                      size="small"
                                      onClick={() => handleToggleActive(category.id)}
                                      disabled={loadingUpdate}
                                    >
                                      {category.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                    </IconButton>
                                  </Tooltip>
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
                                      onClick={() => handleEditClick(category)}
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
                                      onClick={() => handleDeleteClick(category.id)}
                                      disabled={loadingDelete}
                                    >
                                      <DeleteTwoToneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))
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
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Kategoriyi Sil
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              {categoryToDelete && (
                <Typography component="div" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Silinecek kategori: {categories.find(c => c.id === categoryToDelete)?.name}
                </Typography>
              )}
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

        {/* Category Create/Edit Modal */}
        <CategoryModal
          open={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          category={editingCategory}
          mode={modalMode}
        />
      </Container>
    </>
  );
}

CategoriesPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default CategoriesPage;