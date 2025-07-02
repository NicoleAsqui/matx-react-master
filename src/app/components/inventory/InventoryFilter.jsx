import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  MenuItem,
  IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const InventoryFilter = ({ 
  filterOptions = { categorias: [], marcas: [], puntosVenta: [] }, 
  filters = { categorias: [], marcas: [], puntosVenta: [], conStockBajo: false }, 
  onFilterChange, 
  onClearFilters 
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleApply = () => {
    handleClose();
  };

  const hasActiveFilters = 
    filters.categorias.length > 0 || 
    filters.marcas.length > 0 || 
    filters.puntosVenta.length > 0 || 
    filters.conStockBajo;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleOpen}
        sx={{ ml: 2, position: 'relative' }}
      >
        Filtrar
        {hasActiveFilters && (
          <Box
            component="span"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main'
            }}
          />
        )}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Filtros de Inventario
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Filtro por Categoría */}
            <TextField
              select
              label="Categorías"
              SelectProps={{
                multiple: true,
                value: filters.categorias,
                onChange: (e) => onFilterChange('categorias', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {filterOptions.categorias.map(cat => (
                <MenuItem key={cat} value={cat}>
                  <Checkbox checked={filters.categorias.includes(cat)} />
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtro por Marca */}
            <TextField
              select
              label="Marcas"
              SelectProps={{
                multiple: true,
                value: filters.marcas,
                onChange: (e) => onFilterChange('marcas', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {filterOptions.marcas.map(marca => (
                <MenuItem key={marca} value={marca}>
                  <Checkbox checked={filters.marcas.includes(marca)} />
                  {marca}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtro por Punto de Venta */}
            <TextField
              select
              label="Puntos de Venta"
              SelectProps={{
                multiple: true,
                value: filters.puntosVenta,
                onChange: (e) => onFilterChange('puntosVenta', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {filterOptions.puntosVenta.map(punto => (
                <MenuItem key={punto} value={punto}>
                  <Checkbox checked={filters.puntosVenta.includes(punto)} />
                  {punto}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtro por Stock */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.conStockBajo}
                  onChange={(e) => onFilterChange('conStockBajo', e.target.checked)}
                />
              }
              label="Mostrar solo productos con stock bajo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClearFilters}>Limpiar Filtros</Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Aplicar Filtros
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mostrar filtros activos */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.categorias.map(cat => (
            <Chip
              key={cat}
              label={`Categoría: ${cat}`}
              onDelete={() => onFilterChange('categorias', filters.categorias.filter(c => c !== cat))}
            />
          ))}
          {filters.marcas.map(marca => (
            <Chip
              key={marca}
              label={`Marca: ${marca}`}
              onDelete={() => onFilterChange('marcas', filters.marcas.filter(m => m !== marca))}
            />
          ))}
          {filters.puntosVenta.map(punto => (
            <Chip
              key={punto}
              label={`Punto: ${punto}`}
              onDelete={() => onFilterChange('puntosVenta', filters.puntosVenta.filter(p => p !== punto))}
            />
          ))}
          {filters.conStockBajo && (
            <Chip
              label="Stock Bajo"
              onDelete={() => onFilterChange('conStockBajo', false)}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default InventoryFilter;
