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
  article?: ArticleResponse | null; // For editing
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

  // Set form data when modal opens and fetch categories/tags
  useEffect(() => {
    if (open) {
      fetchCategories(1, 100); // Fetch all categories
      fetchTags(1, 100); // Fetch all tags
      
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
      newErrors.title = 'Article title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Article title must be at least 5 characters';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Article title cannot exceed 200 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Article excerpt is required';
    } else if (formData.excerpt.trim().length < 20) {
      newErrors.excerpt = 'Article excerpt must be at least 20 characters';
    } else if (formData.excerpt.trim().length > 500) {
      newErrors.excerpt = 'Article excerpt cannot exceed 500 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Article content is required';
    } else if (formData.content.trim().length < 100) {
      newErrors.content = 'Article content must be at least 100 characters';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Category selection is required';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let success = false;
    
    // Don't send image field if empty
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
    
    // Clear error if exists
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

    // File type validation
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, featuredImage: 'Please select an image file' }));
      return;
    }

    // File size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, featuredImage: 'Image size must be less than 5MB' }));
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
      setErrors(prev => ({ ...prev, image: 'Error occurred while uploading image' }));
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
        {mode === 'create' ? 'Create New Article' : 'Edit Article'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            label="Article Title *"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            placeholder="Enter your article title..."
          />

          {/* Category and Status Settings */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={handleSelectChange('categoryId')}
                  label="Category *"
                >
                  <MenuItem value={0}>Select Category</MenuItem>
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
                  label="Featured"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isBreaking}
                      onChange={handleInputChange('isBreaking')}
                    />
                  }
                  label="Breaking News"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Excerpt */}
          <TextField
            label="Article Excerpt *"
            value={formData.excerpt}
            onChange={handleInputChange('excerpt')}
            error={!!errors.excerpt}
            helperText={errors.excerpt}
            fullWidth
            multiline
            rows={2}
            placeholder="Write your article excerpt..."
          />

          {/* Tag Selection */}
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
                label="Tags"
                placeholder="Select or type tags..."
                helperText="Select tags related to the article (optional)"
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2">{option.name}</Typography>
                  {option.articlesCount && option.articlesCount > 0 && (
                    <Chip 
                      size="small" 
                      label={`${option.articlesCount} articles`} 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              </Box>
            )}
            sx={{ mt: 1 }}
          />

          {/* Featured Image */}
          <Box>
            <FormLabel component="legend" sx={{ mb: 1 }}>Featured Image</FormLabel>
            
            {imagePreview ? (
              <Card sx={{ mb: 2, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Featured image"
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
                  Click to upload image
                </Typography>
              </Box>
            )}

            <Button
              component="label"
              variant="outlined"
              startIcon={uploadingImage ? <CircularProgress size={16} /> : <CloudUploadIcon />}
              disabled={uploadingImage}
            >
              {uploadingImage ? 'Uploading...' : 'Select Image'}
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

          {/* Content */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Article Content *
            </Typography>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => {
                setFormData(prev => ({ ...prev, content }));
                if (errors.content) {
                  setErrors(prev => ({ ...prev, content: '' }));
                }
              }}
              placeholder="Write your article content..."
              error={!!errors.content}
              helperText={errors.content}
            />
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}