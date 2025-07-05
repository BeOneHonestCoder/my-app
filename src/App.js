import React from 'react';
import axios from 'axios';
import {
  Container,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      open: false,
      current: null,
      form: { name: '', birthday: '' },
      errors: {},
      searchTerm: '',
      pagination: { page: 1, rowsPerPage: 5 }
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      console.log(response);
      this.setState({
        data: response.data,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: 'Failed to fetch data: ' + error.message,
        loading: false
      });
    }
  };

  get filteredData() {
    return this.state.data.filter(item =>
      item.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
      item.birthday.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
  }

  get paginatedData() {
    const { page, rowsPerPage } = this.state.pagination;
    return this.filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }

  validateForm = () => {
    const newErrors = {};
    if (!this.state.form.name.trim()) newErrors.name = 'Name is required';
    if (!this.state.form.birthday.trim()) {
      newErrors.birthday = 'Birthday is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(this.state.form.birthday)) {
      newErrors.birthday = 'Birthday is invalid';
    }
    this.setState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({
    open: false, current: null, form: { name: '', birthday: '' }, errors: {}
  });


  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;

    try {
      if (this.state.current) {
        await axios.put(`${API_URL}/${this.state.current.id}`, this.state.form);
      } else {
        await axios.post(API_URL, this.state.form);
      }

      this.fetchData();
      this.handleClose();
    } catch (error) {
      this.setState({
        error: `Failed to submit: ${error.response?.data?.message || error.message}`
      });
    }
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      this.fetchData();
    } catch (error) {
      this.setState({
        error: `Failed to delete: ${error.response?.data?.message || error.message}`
      });
    }
  };

  handleEdit = (item) => {
    this.setState({ open: true, current: item, form: { name: item.name, birthday: item.birthday } });
  };

  handlePageChange = (e, page) => {
    this.setState(prev => ({ pagination: { ...prev.pagination, page } }));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prev => ({ form: { ...prev.form, [name]: value } }));
  };

  handleSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
      pagination: { ...this.state.pagination, page: 1 }
    });
  };

  render() {
    const { form, errors, pagination, open, searchTerm } = this.state;
    const totalPages = Math.ceil(this.filteredData.length / pagination.rowsPerPage);

    return (
      <Container maxWidth="lg" sx={{ py: 3, px: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4">User Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={this.handleOpen}>
            Add User
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search..."
          value={searchTerm}
          onChange={this.handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => this.setState({ searchTerm: '' })}>
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Birthday</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CreateTS</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.paginatedData.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.birthday}</TableCell>
                  <TableCell>{item.createts}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => this.handleEdit(item)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => this.handleDelete(item.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={pagination.page}
            onChange={this.handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>

        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>{this.state.current ? 'Edit User' : 'Add User'}</DialogTitle>
          <form onSubmit={this.handleSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={form.name}
                onChange={this.handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Birthday"
                name="birthday"
                value={form.birthday}
                onChange={this.handleInputChange}
                error={!!errors.birthday}
                helperText={errors.birthday}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {this.state.current ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    );
  }
}

export default App;