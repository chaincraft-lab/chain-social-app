import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTagStore } from 'src/stores/tagStore';
import { CreateTagRequest, UpdateTagRequest, TagResponse } from 'src/services';

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tag?: TagResponse | null; // For editing
  mode: 'create' | 'edit';
}

export default function TagModal({ open, onClose, onSuccess, tag, mode }: TagModalProps) {
  const [formData, setFormData] = useState<CreateTagRequest>({
    name: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createTag, updateTag, loadingCreate, loadingUpdate, error } = useTagStore();

  // Set form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && tag) {
        setFormData({
          name: tag.name,
        });
      } else {
        setFormData({
          name: '',
        });
      }
      setErrors({});
    }
  }, [open, mode, tag]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tag name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tag name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Tag name cannot exceed 50 characters';
    } else if (!/^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s\-_]+$/.test(formData.name)) {
      newErrors.name = 'Tag name can only contain letters, numbers, spaces, hyphens and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let success = false;
    
    if (mode === 'create') {
      success = await createTag(formData);
    } else if (mode === 'edit' && tag) {
      success = await updateTag(tag.id, formData as UpdateTagRequest);
    }

    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
  };

  const handleInputChange = (field: keyof CreateTagRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isLoading = loadingCreate || loadingUpdate;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="tag-modal-title"
    >
      <DialogTitle id="tag-modal-title">
        {mode === 'create' ? 'Create New Tag' : 'Edit Tag'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Tag Name */}
          <TextField
            label="Tag Name *"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            helperText={errors.name || 'Tag name must be between 2 and 50 characters'}
            fullWidth
            placeholder="Enter tag name..."
            autoFocus
          />

          {/* Info Message */}
          <Box sx={{ 
            backgroundColor: 'info.light', 
            color: 'info.contrastText', 
            p: 2, 
            borderRadius: 1,
            opacity: 0.8
          }}>
            <Typography variant="body2">
              <strong>Note:</strong> Tag name will be automatically converted to a URL-friendly slug. 
              Example: "Artificial Intelligence" → "artificial-intelligence"
            </Typography>
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