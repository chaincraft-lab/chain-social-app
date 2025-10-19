import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
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
  MenuItem,
  Avatar
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useArticleStore } from 'src/stores/articleStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { useTagStore } from 'src/stores/tagStore';
import { ArticleResponse } from 'src/services';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ArticleModal from 'src/components/ArticleModal';

function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [tagFilter, setTagFilter] = useState<number | ''>('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'normal'>('all');
  const [breakingFilter, setBreakingFilter] = useState<'all' | 'breaking' | 'normal'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingArticle, setEditingArticle] = useState<ArticleResponse | null>(null);

  // Article store
  const {
    articles,
    pagination,
    loading,
    loadingDelete,
    loadingUpdate,
    error,
    fetchArticles,
    fetchArticlesForAdmin,
    deleteArticle,
    toggleArticleActive,
    clearError
  } = useArticleStore();

  // Category store
  const {
    categories,
    fetchCategories: fetchCategoriesData
  } = useCategoryStore();

  // Tag store
  const {
    tags,
    fetchTags: fetchTagsData
  } = useTagStore();

  // Sayfa yüklendiğinde makaleleri, kategorileri ve tagları getir
  useEffect(() => {
    fetchArticlesForAdmin(1, 10);
    fetchCategoriesData(1, 100);
    fetchTagsData(1, 100);
  }, [fetchArticlesForAdmin, fetchCategoriesData, fetchTagsData]);

  // Search ve filtreleme
  const filteredArticles = useMemo(() => {
    if (!articles || !Array.isArray(articles)) return [];
    
    return articles.filter(article => {
      if (!article || typeof article !== 'object' || !article.title) return false;
      
      if (statusFilter === 'active' && !article.isActive) return false;
      if (statusFilter === 'inactive' && article.isActive) return false;
      if (categoryFilter && article.category?.id !== categoryFilter) return false;
      if (tagFilter && (!article.tags || !article.tags.some(tag => tag.id === tagFilter))) return false;
      if (featuredFilter === 'featured' && !article.isFeatured) return false;
      if (featuredFilter === 'normal' && article.isFeatured) return false;
      if (breakingFilter === 'breaking' && !article.isBreaking) return false;
      if (breakingFilter === 'normal' && article.isBreaking) return false;
      
      const searchMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return searchMatch;
    });
  }, [articles, searchTerm, statusFilter, categoryFilter, tagFilter, featuredFilter, breakingFilter]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event: any) => {
    setCategoryFilter(event.target.value);
  };

  const handleTagFilterChange = (event: any) => {
    setTagFilter(event.target.value);
  };

  const handleFeaturedFilterChange = (event: any) => {
    setFeaturedFilter(event.target.value);
  };

  const handleBreakingFilterChange = (event: any) => {
    setBreakingFilter(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    fetchArticlesForAdmin(value, pagination.limit);
  };

  const handleDeleteClick = (articleId: number) => {
    setArticleToDelete(articleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (articleToDelete) {
      const success = await deleteArticle(articleToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setArticleToDelete(null);
        fetchArticlesForAdmin(pagination.page, pagination.limit);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  const handleRefresh = () => {
    fetchArticlesForAdmin(pagination.page, pagination.limit);
  };

  const handleToggleActive = async (articleId: number) => {
    const success = await toggleArticleActive(articleId);
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
    setEditingArticle(null);
    setModalOpen(true);
  };

  const handleEditClick = (article: ArticleResponse) => {
    setModalMode('edit');
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingArticle(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    handleRefresh();
  };

  return (
    <>
      <Head>
        <title>Makaleler - ChainSocial Admin</title>
      </Head>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
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
                      Yeni Makale
                    </Button>
                  </Box>
                }
                title="Makale Listesi"
              />
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
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
                    sx={{ flex: 1, minWidth: 250 }}
                  />
                  <FormControl sx={{ minWidth: 120 }}>
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
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={handleCategoryFilterChange}
                      label="Kategori"
                    >
                      <MenuItem value="">Tümü</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Etiket</InputLabel>
                    <Select
                      value={tagFilter}
                      onChange={handleTagFilterChange}
                      label="Etiket"
                    >
                      <MenuItem value="">Tümü</MenuItem>
                      {tags.map((tag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Öne Çıkarma</InputLabel>
                    <Select
                      value={featuredFilter}
                      onChange={handleFeaturedFilterChange}
                      label="Öne Çıkarma"
                    >
                      <MenuItem value="all">Tümü</MenuItem>
                      <MenuItem value="featured">Öne Çıkan</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Son Dakika</InputLabel>
                    <Select
                      value={breakingFilter}
                      onChange={handleBreakingFilterChange}
                      label="Son Dakika"
                    >
                      <MenuItem value="all">Tümü</MenuItem>
                      <MenuItem value="breaking">Son Dakika</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
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
                      <Table sx={{ minWidth: 1000 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '30%' }}>Başlık</TableCell>
                            <TableCell sx={{ width: '10%' }}>Yazar</TableCell>
                            <TableCell sx={{ width: '8%' }}>Kategori</TableCell>
                            <TableCell sx={{ width: '12%' }}>Etiketler</TableCell>
                            <TableCell sx={{ width: '8%' }}>Durum</TableCell>
                            <TableCell sx={{ width: '10%' }}>İstatistikler</TableCell>
                            <TableCell sx={{ width: '9%' }}>Yayın Tarihi</TableCell>
                            <TableCell align="right" sx={{ width: '13%' }}>İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredArticles.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
                                <Typography variant="body2" color="text.secondary">
                                  {searchTerm || statusFilter !== 'all' || categoryFilter || tagFilter || featuredFilter !== 'all' || breakingFilter !== 'all'
                                    ? 'Arama kriterinize uygun makale bulunamadı.' 
                                    : 'Henüz makale eklenmemiş.'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredArticles.map((article) => (
                              <TableRow key={article.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {article.isFeatured && (
                                      <PushPinIcon fontSize="small" color="warning" />
                                    )}
                                    {article.isBreaking && (
                                      <span style={{ color: 'red', fontSize: '12px', fontWeight: 'bold' }}>⚡</span>
                                    )}
                                    <Box>
                                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                                        {article.title}
                                      </Typography>
                                      {article.excerpt && (
                                        <Typography variant="body2" color="text.secondary" sx={{ 
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          maxWidth: 300
                                        }}>
                                          {article.excerpt}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                      {article.author.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" color="text.secondary">
                                      {article.author.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={article.category.name}
                                    sx={{
                                      backgroundColor: article.category.color || '#e0e0e0',
                                      color: 'white',
                                      fontSize: '0.75rem',
                                    }}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 150 }}>
                                    {article.tags && article.tags.length > 0 ? (
                                      article.tags.slice(0, 3).map((tag) => (
                                        <Chip
                                          key={tag.id}
                                          label={tag.name}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            fontSize: '0.7rem',
                                            height: '20px',
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            borderColor: 'rgba(25, 118, 210, 0.5)',
                                            color: 'primary.main'
                                          }}
                                        />
                                      ))
                                    ) : (
                                      <Typography variant="caption" color="text.disabled">
                                        -
                                      </Typography>
                                    )}
                                    {article.tags && article.tags.length > 3 && (
                                      <Chip
                                        label={`+${article.tags.length - 3}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          fontSize: '0.7rem',
                                          height: '20px',
                                          color: 'text.secondary'
                                        }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={article.isActive ? 'Aktif' : 'Pasif'}
                                    color={article.isActive ? 'success' : 'default'}
                                    variant={article.isActive ? 'filled' : 'outlined'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <RemoveRedEyeIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {article.viewCount}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <ThumbUpIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {article.likeCount}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {article.publishedAt ? formatDate(article.publishedAt) : '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Tooltip title={article.isActive ? 'Pasifleştir' : 'Aktifleştir'} arrow>
                                    <IconButton
                                      sx={{
                                        '&:hover': {
                                          background: article.isActive ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)'
                                        },
                                        color: article.isActive ? 'warning.main' : 'success.main'
                                      }}
                                      color="inherit"
                                      size="small"
                                      onClick={() => handleToggleActive(article.id)}
                                      disabled={loadingUpdate}
                                    >
                                      {article.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
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
                                      onClick={() => handleEditClick(article)}
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
                                      onClick={() => handleDeleteClick(article.id)}
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
                    
                    {!searchTerm && statusFilter === 'all' && !categoryFilter && !tagFilter && featuredFilter === 'all' && breakingFilter === 'all' && pagination?.totalPages > 1 && (
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
            Makaleyi Sil
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Bu makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

        {/* Article Create/Edit Modal */}
        <ArticleModal
          open={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          article={editingArticle}
          mode={modalMode}
        />
      </Container>
    </>
  );
}

ArticlesPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default ArticlesPage;