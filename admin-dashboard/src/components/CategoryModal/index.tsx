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
  Alert
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { useCategoryStore } from 'src/stores/categoryStore';
import { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from 'src/services/api';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryResponse | null; // Düzenleme için
  mode: 'create' | 'edit';
}

export default function CategoryModal({ open, onClose, onSuccess, category, mode }: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    color: '#007bff',
    icon: ''
  });
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createCategory, updateCategory, loadingCreate, loadingUpdate, error } = useCategoryStore();

  // Modal açıldığında form verilerini set et
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          color: category.color || '#007bff',
          icon: category.icon || ''
        });
      } else {
        setFormData({
          name: '',
          description: '',
          color: '#007bff',
          icon: ''
        });
      }
      setErrors({});
    }
  }, [open, mode, category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Kategori adı en az 2 karakter olmalıdır';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Kategori adı en fazla 50 karakter olabilir';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Açıklama en fazla 200 karakter olabilir';
    }

    if (formData.icon && formData.icon.length > 50) {
      newErrors.icon = 'İkon adı en fazla 50 karakter olabilir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let success = false;
    
    if (mode === 'create') {
      success = await createCategory(formData);
    } else if (mode === 'edit' && category) {
      success = await updateCategory(category.id, formData as UpdateCategoryRequest);
    }

    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
  };

  const handleInputChange = (field: keyof CreateCategoryRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const isLoading = loadingCreate || loadingUpdate;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="category-modal-title"
    >
      <DialogTitle id="category-modal-title">
        {mode === 'create' ? 'Yeni Kategori Oluştur' : 'Kategoriyi Düzenle'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Kategori Adı */}
          <TextField
            label="Kategori Adı *"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            placeholder="Teknoloji, Spor, Ekonomi..."
          />

          {/* Açıklama */}
          <TextField
            label="Açıklama"
            value={formData.description}
            onChange={handleInputChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
            placeholder="Kategori hakkında kısa bir açıklama..."
          />

          {/* Renk Seçici */}
          <FormControl>
            <FormLabel component="legend">Kategori Rengi</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  backgroundColor: formData.color,
                  border: '2px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#bdbdbd'
                  }
                }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <TextField
                value={formData.color}
                onChange={handleInputChange('color')}
                size="small"
                sx={{ width: 120 }}
                placeholder="#007bff"
              />
            </Box>
            
            {showColorPicker && (
              <Box sx={{ mt: 2 }}>
                <HexColorPicker
                  color={formData.color || '#007bff'}
                  onChange={handleColorChange}
                />
              </Box>
            )}
          </FormControl>

          {/* İkon */}
          <TextField
            label="İkon"
            value={formData.icon}
            onChange={handleInputChange('icon')}
            error={!!errors.icon}
            helperText={errors.icon || 'Material Design Icons (mdi-laptop, mdi-sports gibi)'}
            fullWidth
            placeholder="mdi-laptop"
          />
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