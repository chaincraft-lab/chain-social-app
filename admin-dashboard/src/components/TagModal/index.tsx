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
  tag?: TagResponse | null; // Düzenleme için
  mode: 'create' | 'edit';
}

export default function TagModal({ open, onClose, onSuccess, tag, mode }: TagModalProps) {
  const [formData, setFormData] = useState<CreateTagRequest>({
    name: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createTag, updateTag, loadingCreate, loadingUpdate, error } = useTagStore();

  // Modal açıldığında form verilerini set et
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
      newErrors.name = 'Tag adı gereklidir';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tag adı en az 2 karakter olmalıdır';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Tag adı en fazla 50 karakter olabilir';
    } else if (!/^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s\-_]+$/.test(formData.name)) {
      newErrors.name = 'Tag adı sadece harf, rakam, boşluk, tire ve alt çizgi içerebilir';
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
    
    // Hata varsa temizle
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
        {mode === 'create' ? 'Yeni Tag Oluştur' : 'Tag Düzenle'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Tag Adı */}
          <TextField
            label="Tag Adı *"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            helperText={errors.name || 'Tag adı en az 2, en fazla 50 karakter olmalıdır'}
            fullWidth
            placeholder="Tag adını girin..."
            autoFocus
          />

          {/* Bilgi Mesajı */}
          <Box sx={{ 
            backgroundColor: 'info.light', 
            color: 'info.contrastText', 
            p: 2, 
            borderRadius: 1,
            opacity: 0.8
          }}>
            <Typography variant="body2">
              <strong>Not:</strong> Tag adı otomatik olarak URL dostu bir slug'a dönüştürülecektir. 
              Örnek: "Yapay Zeka" → "yapay-zeka"
            </Typography>
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