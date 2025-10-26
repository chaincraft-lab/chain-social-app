import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  FormLabel,
  Typography,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Divider,
  Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useArticleStore } from 'src/stores/articleStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { useTagStore } from 'src/stores/tagStore';
import { CreateArticleRequest, UpdateArticleRequest, ArticleResponse } from 'src/services';
import RichTextEditor from 'src/components/RichTextEditor';

interface ArticleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  article?: ArticleResponse | null; // Düzenleme için
  mode: 'create' | 'edit';
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ArticleModal({ open, onClose, onSuccess, article, mode }: ArticleModalProps) {
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    excerpt: '',
    content: '',
    image: undefined,
    categoryId: 0,
    tagIds: [],
    isFeatured: false,
    isBreaking: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const { createArticle, updateArticle, uploadImage, loadingCreate, loadingUpdate, error } = useArticleStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { tags, fetchTags } = useTagStore();

  // Modal açıldığında form verilerini set et ve kategorileri/tagları getir
  useEffect(() => {
    if (open) {
      fetchCategories(1, 100); // Tüm kategorileri getir
      fetchTags(1, 100); // Tüm tagları getir
      
      if (mode === 'edit' && article) {
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          image: article.image || undefined,
          categoryId: article.category.id,
          tagIds: article.tags?.map(tag => tag.id) || [],
          isFeatured: article.isFeatured,
          isBreaking: article.isBreaking
        });
        setImagePreview(article.image || '');
      } else {
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          image: undefined,
          categoryId: 0,
          tagIds: [],
          isFeatured: false,
          isBreaking: false
        });
        setImagePreview('');
      }
      setErrors({});
    }
  }, [open, mode, article, fetchCategories, fetchTags]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Makale başlığı gereklidir';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Makale başlığı en az 5 karakter olmalıdır';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Makale başlığı en fazla 200 karakter olabilir';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Makale özeti gereklidir';
    } else if (formData.excerpt.trim().length < 20) {
      newErrors.excerpt = 'Makale özeti en az 20 karakter olmalıdır';
    } else if (formData.excerpt.trim().length > 500) {
      newErrors.excerpt = 'Makale özeti en fazla 500 karakter olabilir';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Makale içeriği gereklidir';
    } else if (formData.content.trim().length < 100) {
      newErrors.content = 'Makale içeriği en az 100 karakter olmalıdır';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Kategori seçimi gereklidir';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let success = false;
    
    // Image alanını boşsa gönderme
    const submitData = { ...formData };
    if (!submitData.image || (typeof submitData.image === 'string' && submitData.image.trim() === '')) {
      delete submitData.image;
    }
    
    if (mode === 'create') {
      success = await createArticle(submitData);
    } else if (mode === 'edit' && article) {
      success = await updateArticle(article.id, submitData as UpdateArticleRequest);
    }

    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
  };

  const handleInputChange = (field: keyof CreateArticleRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: keyof CreateArticleRequest) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya türü kontrolü
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, featuredImage: 'Lütfen bir resim dosyası seçin' }));
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, featuredImage: 'Resim boyutu 5MB\'dan küçük olmalıdır' }));
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Resim yüklenirken hata oluştu' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    setImagePreview('');
  };

  const isLoading = loadingCreate || loadingUpdate;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      aria-labelledby="article-modal-title"
    >
      <DialogTitle id="article-modal-title">
        {mode === 'create' ? 'Yeni Makale Oluştur' : 'Makaleyi Düzenle'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Başlık */}
          <TextField
            label="Makale Başlığı *"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            placeholder="Makalenizin başlığını girin..."
          />

          {/* Kategori ve Durum Ayarları */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Kategori *</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={handleSelectChange('categoryId')}
                  label="Kategori *"
                >
                  <MenuItem value={0}>Kategori Seçin</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.categoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleInputChange('isFeatured')}
                    />
                  }
                  label="Öne Çıkar"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isBreaking}
                      onChange={handleInputChange('isBreaking')}
                    />
                  }
                  label="Son Dakika"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Özet */}
          <TextField
            label="Makale Özeti *"
            value={formData.excerpt}
            onChange={handleInputChange('excerpt')}
            error={!!errors.excerpt}
            helperText={errors.excerpt}
            fullWidth
            multiline
            rows={2}
            placeholder="Makalenizin özetini yazın..."
          />

          {/* Tag Seçimi */}
          <Autocomplete
            multiple
            id="tags-select"
            options={tags}
            getOptionLabel={(option) => option.name}
            value={tags.filter(tag => formData.tagIds?.includes(tag.id)) || []}
            onChange={(event, newValue) => {
              setFormData(prev => ({
                ...prev,
                tagIds: newValue.map(tag => tag.id)
              }));
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Etiketler"
                placeholder="Etiket seçin veya yazın..."
                helperText="Makaleyle ilgili etiketleri seçin (opsiyonel)"
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2">{option.name}</Typography>
                  {option.articlesCount && option.articlesCount > 0 && (
                    <Chip 
                      size="small" 
                      label={`${option.articlesCount} makale`} 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              </Box>
            )}
            sx={{ mt: 1 }}
          />

          {/* Öne Çıkarılan Resim */}
          <Box>
            <FormLabel component="legend" sx={{ mb: 1 }}>Öne Çıkarılan Resim</FormLabel>
            
            {imagePreview ? (
              <Card sx={{ mb: 2, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Öne çıkarılan resim"
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                  onClick={handleRemoveImage}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            ) : (
              <Box
                sx={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Resim yüklemek için tıklayın
                </Typography>
              </Box>
            )}

            <Button
              component="label"
              variant="outlined"
              startIcon={uploadingImage ? <CircularProgress size={16} /> : <CloudUploadIcon />}
              disabled={uploadingImage}
            >
              {uploadingImage ? 'Yükleniyor...' : 'Resim Seç'}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            
            {errors.image && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {errors.image}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* İçerik */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Makale İçeriği *
            </Typography>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => {
                setFormData(prev => ({ ...prev, content }));
                if (errors.content) {
                  setErrors(prev => ({ ...prev, content: '' }));
                }
              }}
              placeholder="Makalenizin içeriğini yazın..."
              error={!!errors.content}
              helperText={errors.content}
            />
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
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
}