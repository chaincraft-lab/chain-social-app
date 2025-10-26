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
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useUserStore } from 'src/stores/userStore';
import { UserResponse } from 'src/services';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import UserModal from 'src/components/UserModal';

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [blockFilter, setBlockFilter] = useState<'all' | 'blocked' | 'unblocked'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  // User store
  const {
    users,
    pagination,
    loading,
    loadingDelete,
    loadingUpdate,
    loadingBlock,
    error,
    fetchUsers,
    deleteUser,
    toggleUserBlock,
    clearError
  } = useUserStore();

  // Sayfa yüklendiğinde kullanıcıları getir
  useEffect(() => {
    fetchUsers(1, 10);
  }, [fetchUsers]);

  // Search ve filtreleme
  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    
    return users.filter(user => {
      if (!user || typeof user !== 'object') return false;
      
      if (statusFilter === 'active' && !user.isActive) return false;
      if (statusFilter === 'inactive' && user.isActive) return false;
      if (blockFilter === 'blocked' && !user.isBlocked) return false;
      if (blockFilter === 'unblocked' && user.isBlocked) return false;
      if (roleFilter && user.role !== roleFilter) return false;
      
      const searchMatch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.surname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      return searchMatch;
    });
  }, [users, searchTerm, roleFilter, statusFilter, blockFilter]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event: any) => {
    setRoleFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const handleBlockFilterChange = (event: any) => {
    setBlockFilter(event.target.value);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    fetchUsers(value, pagination.limit);
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers(pagination.page, pagination.limit);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleRefresh = () => {
    fetchUsers(pagination.page, pagination.limit);
  };

  const handleToggleBlock = async (userId: number) => {
    const success = await toggleUserBlock(userId);
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
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditClick = (user: UserResponse) => {
    setModalMode('edit');
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    handleRefresh();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'error';
      case 'ADMIN':
        return 'warning';
      case 'EDITOR':
        return 'info';
      case 'AUTHOR':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'EDITOR':
        return 'Editor';
      case 'AUTHOR':
        return 'Author';
      default:
        return 'User';
    }
  };

  return (
    <>
      <Head>
        <title>Users - ChainSocial Admin</title>
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
                      Refresh
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleCreateClick}
                    >
                      New User
                    </Button>
                  </Box>
                }
                title="User List"
              />
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    placeholder="Search users..."
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
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={roleFilter}
                      onChange={handleRoleFilterChange}
                      label="Role"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="USER">User</MenuItem>
                      <MenuItem value="AUTHOR">Author</MenuItem>
                      <MenuItem value="EDITOR">Editor</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      label="Status"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Block Status</InputLabel>
                    <Select
                      value={blockFilter}
                      onChange={handleBlockFilterChange}
                      label="Block Status"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="blocked">Blocked</MenuItem>
                      <MenuItem value="unblocked">Unblocked</MenuItem>
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
                            <TableCell sx={{ width: '25%' }}>User</TableCell>
                            <TableCell sx={{ width: '20%' }}>Email</TableCell>
                            <TableCell sx={{ width: '10%' }}>Role</TableCell>
                            <TableCell sx={{ width: '10%' }}>Status</TableCell>
                            <TableCell sx={{ width: '10%' }}>Block Status</TableCell>
                            <TableCell sx={{ width: '10%' }}>Registration Date</TableCell>
                            <TableCell align="right" sx={{ width: '15%' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                <Typography variant="body2" color="text.secondary">
                                  {searchTerm || roleFilter || statusFilter !== 'all' || blockFilter !== 'all'
                                    ? 'No users found matching your search criteria.' 
                                    : 'No users have been added yet.'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar 
                                      src={user.avatar} 
                                      sx={{ width: 40, height: 40 }}
                                    >
                                      {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body1" fontWeight="bold" color="text.primary">
                                        {user.name} {user.surname}
                                      </Typography>
                                      {user.username && (
                                        <Typography variant="body2" color="text.secondary">
                                          @{user.username}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.primary">
                                    {user.email}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={getRoleLabel(user.role)}
                                    color={getRoleColor(user.role) as any}
                                    size="small"
                                    icon={user.role.includes('ADMIN') ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={user.isActive ? 'Active' : 'Inactive'}
                                    color={user.isActive ? 'success' : 'default'}
                                    variant={user.isActive ? 'filled' : 'outlined'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={user.isBlocked ? 'Blocked' : 'Normal'}
                                    color={user.isBlocked ? 'error' : 'success'}
                                    variant={user.isBlocked ? 'filled' : 'outlined'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(user.createdAt)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  {user.role !== 'SUPER_ADMIN' && (
                                    <Tooltip title={user.isBlocked ? 'Unblock' : 'Block'} arrow>
                                      <IconButton
                                        sx={{
                                          '&:hover': {
                                            background: user.isBlocked ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                                          },
                                          color: user.isBlocked ? 'success.main' : 'error.main'
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => handleToggleBlock(user.id)}
                                        disabled={loadingBlock}
                                      >
                                        {user.isBlocked ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Edit" arrow>
                                    <IconButton
                                      sx={{
                                        '&:hover': {
                                          background: 'rgba(25, 118, 210, 0.1)'
                                        },
                                        color: 'primary.main'
                                      }}
                                      color="inherit"
                                      size="small"
                                      onClick={() => handleEditClick(user)}
                                    >
                                      <EditTwoToneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  {user.role !== 'SUPER_ADMIN' && (
                                    <Tooltip title="Delete" arrow>
                                      <IconButton
                                        sx={{
                                          '&:hover': {
                                            background: 'rgba(220, 53, 69, 0.1)'
                                          },
                                          color: 'error.main'
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => handleDeleteClick(user.id)}
                                        disabled={loadingDelete}
                                      >
                                        <DeleteTwoToneIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {!searchTerm && !roleFilter && statusFilter === 'all' && blockFilter === 'all' && pagination?.totalPages > 1 && (
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
            Delete User
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loadingDelete}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loadingDelete}
              startIcon={loadingDelete ? <CircularProgress size={16} /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* User Create/Edit Modal */}
        <UserModal
          open={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          user={editingUser}
          mode={modalMode}
        />
      </Container>
    </>
  );
}

UsersPage.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

export default UsersPage;