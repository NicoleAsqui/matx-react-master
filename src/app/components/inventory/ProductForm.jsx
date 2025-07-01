import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ProductForm = ({ product, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = React.useState({
    id: '',
    nombre: '',
    categoria: '',
    marca: '',
    precioCompra: 0,
    precioVenta: 0,
    stockTotal: 0,
    stockMinimo: 0,
    caducidad: '',
    lote: '',
    puntoVenta: '',
    ...product
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID del Producto"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={isEditing}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre del Producto"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              label="Categoría"
              required
            >
              <MenuItem value="Bebidas">Bebidas</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
              <MenuItem value="Lácteos">Lácteos</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Precio de Compra"
            name="precioCompra"
            type="number"
            value={formData.precioCompra}
            onChange={handleChange}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Precio de Venta"
            name="precioVenta"
            type="number"
            value={formData.precioVenta}
            onChange={handleChange}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Stock Total"
            name="stockTotal"
            type="number"
            value={formData.stockTotal}
            onChange={handleChange}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Stock Mínimo"
            name="stockMinimo"
            type="number"
            value={formData.stockMinimo}
            onChange={handleChange}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Fecha de Caducidad"
            name="caducidad"
            type="date"
            value={formData.caducidad}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Lote"
            name="lote"
            value={formData.lote}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Punto de Venta"
            name="puntoVenta"
            value={formData.puntoVenta}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;