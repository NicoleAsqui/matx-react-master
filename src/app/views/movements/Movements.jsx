import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Checkbox,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography
} from "@mui/material";
import { styled } from "@mui/system";
import {
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  LocalOffer as PromotionIcon,
  Block as BlockIcon,
  Autorenew as ReturnIcon,
  Cake as TastingIcon
} from "@mui/icons-material";

import { movementsData } from "app/mockData/movements";

// STYLED COMPONENTS
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
    "& tr": { "& td": { paddingLeft: 0 } }
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

const MovementTypeBadge = styled("span")(({ type, theme }) => ({
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: "600",
  backgroundColor: type === "ingreso" 
    ? theme.palette.success.light 
    : theme.palette.error.light,
  color: type === "ingreso" 
    ? theme.palette.success.dark 
    : theme.palette.error.dark
}));

const CategoryIcon = ({ category }) => {
  const iconProps = { fontSize: "small", sx: { mr: 1 } };
  
  switch(category) {
    case "degustacion":
      return <TastingIcon {...iconProps} color="primary" />;
    case "promocion":
      return <PromotionIcon {...iconProps} color="secondary" />;
    case "merma":
      return <BlockIcon {...iconProps} color="error" />;
    case "devolucion":
      return <ReturnIcon {...iconProps} color="warning" />;
    default:
      return <ReceiptIcon {...iconProps} />;
  }
};

export default function MovementsTable() {
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Estados para búsqueda y filtros
  const [searchText, setSearchText] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipos: [],
    categorias: [],
    puntos_venta: [],
    responsables: [],
    fechaDesde: "",
    fechaHasta: ""
  });

  // Datos únicos para filtros
  const tiposUnicos = [...new Set(movementsData.map(item => item.tipo))];
  const categoriasUnicas = [...new Set(movementsData.map(item => item.categoria))];
  const puntosVentaUnicos = [...new Set(movementsData.map(item => item.punto_venta))];
  const responsablesUnicos = [...new Set(movementsData.map(item => item.responsable))];

  // Manejar cambios en filtros
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Aplicar filtros
  const filteredData = movementsData.filter(movement => {
    // Filtro por texto de búsqueda
    const matchesSearch = searchText === "" || 
      Object.values(movement).some(
        value => value && 
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    
    // Filtros avanzados
    const matchesType = filters.tipos.length === 0 || 
      filters.tipos.includes(movement.tipo);
    
    const matchesCategory = filters.categorias.length === 0 || 
      filters.categorias.includes(movement.categoria);
    
    const matchesLocation = filters.puntos_venta.length === 0 || 
      filters.puntos_venta.includes(movement.punto_venta);
    
    const matchesResponsible = filters.responsables.length === 0 || 
      filters.responsables.includes(movement.responsable);
    
    // Filtro por fecha
    const movementDate = new Date(movement.fecha);
    const matchesDateFrom = !filters.fechaDesde || 
      movementDate >= new Date(filters.fechaDesde);
    
    const matchesDateTo = !filters.fechaHasta || 
      movementDate <= new Date(filters.fechaHasta + "T23:59:59");
    
    return matchesSearch && matchesType && matchesCategory && 
           matchesLocation && matchesResponsible && 
           matchesDateFrom && matchesDateTo;
  });

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      tipos: [],
      categorias: [],
      puntos_venta: [],
      responsables: [],
      fechaDesde: "",
      fechaHasta: ""
    });
  };

  // Calcular totales por categoría
  const calculateTotalsByCategory = () => {
    const totals = {};
    
    filteredData.forEach(movement => {
      if (movement.tipo === "egreso") {
        if (!totals[movement.categoria]) {
          totals[movement.categoria] = 0;
        }
        totals[movement.categoria] += movement.costo_total;
      }
    });
    
    return totals;
  };

  const categoryTotals = calculateTotalsByCategory();

  return (
    <Fragment>
      <ContentBox className="movements-history">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Resumen de costos por categoría */}
            {Object.keys(categoryTotals).length > 0 && (
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                backgroundColor: 'background.paper', 
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Typography variant="h6" gutterBottom>
                  Resumen de Costos por Categoría
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(categoryTotals).map(([category, total]) => (
                    <Grid item xs={12} sm={6} md={3} key={category}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: 'grey.100',
                        borderRadius: 1
                      }}>
                        <CategoryIcon category={category} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                            {category}
                          </Typography>
                          <Typography variant="h6" color="error.main">
                            ${total.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Barra de búsqueda y filtros */}
            <SearchContainer>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar movimiento..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
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
                  (typeof f === 'string' && f)
                ) && (
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                    •
                  </span>
                )}
              </FilterButton>
            </SearchContainer>

            {/* Mostrar filtros activos */}
            <Box sx={{ mb: 2 }}>
              {filters.tipos.map(tipo => (
                <FilterChip
                  key={tipo}
                  label={`Tipo: ${tipo === "ingreso" ? "Ingreso" : "Egreso"}`}
                  onDelete={() => handleFilterChange('tipos', 
                    filters.tipos.filter(t => t !== tipo))}
                />
              ))}
              {filters.categorias.map(cat => (
                <FilterChip
                  key={cat}
                  label={`Categoría: ${cat}`}
                  onDelete={() => handleFilterChange('categorias', 
                    filters.categorias.filter(c => c !== cat))}
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
              {filters.responsables.map(resp => (
                <FilterChip
                  key={resp}
                  label={`Responsable: ${resp}`}
                  onDelete={() => handleFilterChange('responsables', 
                    filters.responsables.filter(r => r !== resp))}
                />
              ))}
              {(filters.fechaDesde || filters.fechaHasta) && (
                <FilterChip
                  label={`Fecha: ${filters.fechaDesde || '...'} a ${filters.fechaHasta || '...'}`}
                  onDelete={() => {
                    handleFilterChange('fechaDesde', '');
                    handleFilterChange('fechaHasta', '');
                  }}
                />
              )}
            </Box>
            
            {/* Tabla de movimientos */}
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Fecha</TableCell>
                    <TableCell align="center">Tipo</TableCell>
                    <TableCell align="center">Producto</TableCell>
                    <TableCell align="center">Categoría</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="center">Costo Unitario</TableCell>
                    <TableCell align="center">Costo Total</TableCell>
                    <TableCell align="center">Punto de Venta</TableCell>
                    <TableCell align="center">Responsable</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((movement, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{movement.fecha}</TableCell>
                        <TableCell align="center">
                          <MovementTypeBadge type={movement.tipo}>
                            {movement.tipo === "ingreso" ? "Ingreso" : "Egreso"}
                          </MovementTypeBadge>
                        </TableCell>
                        <TableCell align="center">{movement.producto}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <CategoryIcon category={movement.categoria} />
                            {movement.categoria}
                          </Box>
                        </TableCell>
                        <TableCell align="center">{movement.cantidad}</TableCell>
                        <TableCell align="center">
                          ${movement.costo_unitario.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Typography 
                            variant="body1" 
                            color={movement.tipo === "egreso" ? "error.main" : "success.main"}
                            fontWeight="500"
                          >
                            ${movement.costo_total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {movement.punto_venta}
                        </TableCell>
                        <TableCell align="center">
                          {movement.responsable}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton title="Ver detalles">
                            <VisibilityIcon color="info" />
                          </IconButton>
                          <IconButton title="Descargar comprobante">
                            <ReceiptIcon color="action" />
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
        <DialogTitle>Filtrar Movimientos</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Filtro por Tipo */}
            <TextField
              select
              label="Tipo de Movimiento"
              SelectProps={{
                multiple: true,
                value: filters.tipos,
                onChange: (e) => handleFilterChange('tipos', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value === "ingreso" ? "Ingreso" : "Egreso"} 
                        size="small" 
                      />
                    ))}
                  </Box>
                )
              }}
            >
              {tiposUnicos.map(tipo => (
                <MenuItem key={tipo} value={tipo}>
                  <Checkbox checked={filters.tipos.includes(tipo)} />
                  {tipo === "ingreso" ? "Ingreso" : "Egreso"}
                </MenuItem>
              ))}
            </TextField>

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

            {/* Filtro por Responsable */}
            <TextField
              select
              label="Responsables"
              SelectProps={{
                multiple: true,
                value: filters.responsables,
                onChange: (e) => handleFilterChange('responsables', e.target.value),
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )
              }}
            >
              {responsablesUnicos.map(resp => (
                <MenuItem key={resp} value={resp}>
                  <Checkbox checked={filters.responsables.includes(resp)} />
                  {resp}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtro por Fecha */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Desde"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              />
              <TextField
                label="Hasta"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              />
            </Box>
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