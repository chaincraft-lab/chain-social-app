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
import { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from 'src/services';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryResponse | null; // For editing
  mode: 'create' | 'edit';
}

export default function CategoryModal({ open, onClose, onSuccess, category, mode }: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    color: '#007bff',
    icon: '',
    website: '',
    tokenSymbol: '',
    blockchain: ''
  });
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createCategory, updateCategory, loadingCreate, loadingUpdate, error } = useCategoryStore();

  // Set form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          color: category.color || '#007bff',
          icon: category.icon || '',
          website: category.website || '',
          tokenSymbol: category.tokenSymbol || '',
          blockchain: category.blockchain || ''
        });
      } else {
        setFormData({
          name: '',
          description: '',
          color: '#007bff',
          icon: '',
          website: '',
          tokenSymbol: '',
          blockchain: ''
        });
      }
      setErrors({});
    }
  }, [open, mode, category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Category name cannot exceed 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    if (formData.icon && formData.icon.length > 50) {
      newErrors.icon = 'Icon name cannot exceed 50 characters';
    }

    if (formData.website && formData.website.length > 255) {
      newErrors.website = 'Website URL cannot exceed 255 characters';
    }

    if (formData.tokenSymbol && formData.tokenSymbol.length > 10) {
      newErrors.tokenSymbol = 'Token symbol cannot exceed 10 characters';
    }

    if (formData.blockchain && formData.blockchain.length > 50) {
      newErrors.blockchain = 'Blockchain name cannot exceed 50 characters';
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
    
    // Clear error if exists
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
        {mode === 'create' ? 'Create New Protocol' : 'Edit Protocol'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Category Name */}
          <TextField
            label="Category Name *"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            placeholder="Technology, Sports, Economy..."
          />

          {/* Description */}
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
            placeholder="A brief description about the category..."
          />

          {/* Color Picker */}
          <FormControl>
            <FormLabel component="legend">Category Color</FormLabel>
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

          {/* Icon */}
          <TextField
            label="Icon"
            value={formData.icon}
            onChange={handleInputChange('icon')}
            error={!!errors.icon}
            helperText={errors.icon || 'Material Design Icons (e.g. mdi-laptop, mdi-sports)'}
            fullWidth
            placeholder="mdi-laptop"
          />

          {/* Blockchain Protocol Fields */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
            Blockchain Protocol Information
          </Typography>

          {/* Website */}
          <TextField
            label="Website URL"
            value={formData.website}
            onChange={handleInputChange('website')}
            error={!!errors.website}
            helperText={errors.website || 'Official protocol website'}
            fullWidth
            placeholder="https://arbitrum.io"
          />

          {/* Token Symbol */}
          <TextField
            label="Token Symbol"
            value={formData.tokenSymbol}
            onChange={handleInputChange('tokenSymbol')}
            error={!!errors.tokenSymbol}
            helperText={errors.tokenSymbol || 'Protocol token symbol (ARB, AVAX, etc.)'}
            fullWidth
            placeholder="ARB"
          />

          {/* Blockchain */}
          <TextField
            label="Main Blockchain"
            value={formData.blockchain}
            onChange={handleInputChange('blockchain')}
            error={!!errors.blockchain}
            helperText={errors.blockchain || 'Main blockchain the protocol runs on'}
            fullWidth
            placeholder="Ethereum"
          />
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