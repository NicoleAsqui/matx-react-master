import { Fragment, useState } from "react";
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  IconButton,
  TextField,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogContent,
  TablePagination,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { dataInventory } from "app/mockData/inventory";
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

import Chip from '@mui/material/Chip';

// STYLED COMPONENTS (se mantienen igual)
const ContentBox = styled("div")(({ theme }) => ({
  margin: "2rem",
  [theme.breakpoints.down("sm")]: { margin: "1rem" }
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));
const SearchContainer = styled("div")(({ theme }) => ({
  marginBottom: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "flex-start"
  }
}));

const FilterButton = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  textTransform: "none",
  backgroundColor: theme.palette.grey[200],
  "&:hover": {
    backgroundColor: theme.palette.grey[300]
  }
}));

const FilterChip = styled(Chip)({
  marginRight: "0.5rem",
  marginBottom: "0.5rem"
});

export default function InventoryTable() {
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Estados para búsqueda y filtros
  const [searchText, setSearchText] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    categorias: [],
    marcas: [],
    puntos_venta: [],
    conStockBajo: false
  });

  // Datos únicos para filtros
  const categoriasUnicas = [...new Set(dataInventory.map(item => item.categoria))];
  const marcasUnicas = [...new Set(dataInventory.map(item => item.marca))];
  const puntosVentaUnicos = [...new Set(dataInventory.map(item => item.punto_venta))];

  // Manejar cambios en filtros
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  console.log("ssqs")
  // Aplicar filtros
  const filteredData = dataInventory.filter(product => {
    // Filtro por texto de búsqueda
    const matchesSearch = searchText === "" || 
      Object.values(product).some(
        value => value && 
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    
    // Filtros avanzados
    const matchesCategory = filters.categorias.length === 0 || 
      filters.categorias.includes(product.categoria);
    
    const matchesBrand = filters.marcas.length === 0 || 
      filters.marcas.includes(product.marca);
    
    const matchesLocation = filters.puntos_venta.length === 0 || 
      filters.puntos_venta.includes(product.punto_venta);
    
    const matchesLowStock = !filters.conStockBajo || 
      product.stock_total <= product.stock_minimo;
    
    return matchesSearch && matchesCategory && matchesBrand && 
           matchesLocation && matchesLowStock;
  });

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      categorias: [],
      marcas: [],
      puntos_venta: [],
      conStockBajo: false
    });
  };

  return (
    <Fragment>
      <ContentBox className="inventory">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Barra de búsqueda y filtros */}
            <SearchContainer>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar producto..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={() => setSearchText("")}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: "100%", sm: "300px" } }}
              />

              <FilterButton
                startIcon={<FilterListIcon />}
                onClick={() => setFilterModalOpen(true)}
              >
                Filtrar
                {Object.values(filters).some(f => 
                  (Array.isArray(f) && f.length > 0) || 
                  (typeof f === 'boolean' && f)
                ) && (
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                    •
                  </span>
                )}
              </FilterButton>
            </SearchContainer>

            {/* Mostrar filtros activos */}
            <Box sx={{ mb: 2 }}>
              {filters.categorias.map(cat => (
                <FilterChip
                  key={cat}
                  label={`Categoría: ${cat}`}
                  onDelete={() => handleFilterChange('categorias', 
                    filters.categorias.filter(c => c !== cat))}
                />
              ))}
              {filters.marcas.map(marca => (
                <FilterChip
                  key={marca}
                  label={`Marca: ${marca}`}
                  onDelete={() => handleFilterChange('marcas', 
                    filters.marcas.filter(m => m !== marca))}
                />
              ))}
              {filters.puntos_venta.map(punto => (
                <FilterChip
                  key={punto}
                  label={`Punto: ${punto}`}
                  onDelete={() => handleFilterChange('puntos_venta', 
                    filters.puntos_venta.filter(p => p !== punto))}
                />
              ))}
              {filters.conStockBajo && (
                <FilterChip
                  label="Stock Bajo"
                  onDelete={() => handleFilterChange('conStockBajo', false)}
                />
              )}
            </Box>
            
            {/* Tabla de inventario */}
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="center">Producto</TableCell>
                    <TableCell align="center">Categoría</TableCell>
                    <TableCell align="center">Marca</TableCell>
                    <TableCell align="center">Precio</TableCell>
                    <TableCell align="center">Stock Total</TableCell>
                    <TableCell align="center">Caducidad</TableCell>
                    <TableCell align="center">Punto de Venta</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{product.id}</TableCell>
                        <TableCell align="center">{product.nombre}</TableCell>
                        <TableCell align="center">{product.categoria}</TableCell>
                        <TableCell align="center">{product.marca}</TableCell>
                        <TableCell align="center">
                          ${product.precio_venta.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <span style={{
                            color: product.stock_total <= product.stock_minimo 
                                  ? "red" : "inherit",
                            fontWeight: "500"
                          }}>
                            {product.stock_total}
                          </span>
                        </TableCell>
                        <TableCell align="center">{product.caducidad}</TableCell>
                        <TableCell align="center">
                          {product.punto_venta}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton>
                            <Icon color="primary">edit</Icon>
                          </IconButton>
                          <IconButton>
                            <Icon color="error">delete</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </StyledTable>

              <TablePagination
                sx={{ px: 2 }}
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredData.length}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(+e.target.value);
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Grid>
        </Grid>
      </ContentBox>

      {/* Modal de Filtros */}
      <Dialog 
        open={filterModalOpen} 
        onClose={() => setFilterModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtrar Inventario</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Filtro por Categoría */}
            <TextField
              select
              label="Categorías"
              SelectProps={{
                multiple: true,
                value: filters.categorias,
                onChange: (e) => handleFilterChange('categorias', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {categoriasUnicas.map(cat => (
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
                onChange: (e) => handleFilterChange('marcas', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {marcasUnicas.map(marca => (
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
                value: filters.puntos_venta,
                onChange: (e) => handleFilterChange('puntos_venta', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {puntosVentaUnicos.map(punto => (
                <MenuItem key={punto} value={punto}>
                  <Checkbox checked={filters.puntos_venta.includes(punto)} />
                  {punto}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtro por Stock */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.conStockBajo}
                  onChange={(e) => handleFilterChange('conStockBajo', e.target.checked)}
                />
              }
              label="Mostrar solo productos con stock bajo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Limpiar Filtros</Button>
          <Button 
            onClick={() => setFilterModalOpen(false)}
            variant="contained"
            color="primary"
          >
            Aplicar Filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}