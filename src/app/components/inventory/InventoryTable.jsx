import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  styled,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, Search as SearchIcon, Close as CloseIcon,} from '@mui/icons-material';
import inventoryService from '../../services/inventoryService';
import InventoryFilter from './InventoryFilter';


const SearchContainer = styled("div")(({ theme }) => ({
  marginBottom: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "flex-start"
  }
}));

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    categorias: [],
    marcas: [],
    puntos_venta: [],
    conStockBajo: false,
  });

  const navigate = useNavigate();

  // Cargar inventario desde el servicio
  const loadInventory = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Generar opciones únicas para filtros a partir del inventario
  const categorias = [...new Set(inventory.map(item => item.categoria))];
  const marcas = [...new Set(inventory.map(item => item.marca))];
  const puntos_venta = [...new Set(inventory.map(item => item.punto_venta))];

  // Filtrar datos según filtros y búsqueda
  const filteredData = inventory.filter(product => {
    const matchesSearch = searchText === "" || 
      Object.values(product).some(
        value => value && value.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    
    const matchesCategory = filters.categorias.length === 0 || 
      filters.categorias.includes(product.categoria);
    
    const matchesBrand = filters.marcas.length === 0 || 
      filters.marcas.includes(product.marca);
    
    const matchesLocation = filters.puntos_venta.length === 0 || 
      filters.puntos_venta.includes(product.punto_venta);
    
    const matchesLowStock = !filters.conStockBajo || 
      product.stock_total <= product.stock_minimo;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesLocation && matchesLowStock;
  });

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navegación para editar
  const handleEdit = (id) => {
    navigate(`/inventory/edit/${id}`);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await inventoryService.delete(id);
        loadInventory();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        {/* Search al inicio */}
        <SearchContainer >
            <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar producto..."
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
        </SearchContainer>

        {/* Filtros y botón al final */}
        <Box display="flex" alignItems="center" gap={2}>
            <InventoryFilter
            filters={filters}
            onFilterChange={setFilters}
            searchText={searchText}
            onSearchChange={setSearchText}
            filterOptions={{ categorias, marcas, puntos_venta }}
            onClearFilters={() => setFilters({
                categorias: [],
                marcas: [],
                puntos_venta: [],
                conStockBajo: false
            })}
            />
            <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/inventory/new')}
            >
            Nuevo Producto
            </Button>
        </Box>
        </Box>


      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Punto Venta</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.marca}</TableCell>
                  <TableCell>${Number(item.precioVenta).toFixed(2)}</TableCell>
                  <TableCell sx={{ 
                    color: item.stockTotal <= item.stockMinimo ? 'error.main' : 'inherit',
                    fontWeight: item.stockTotal <= item.stockMinimo ? 'bold' : 'normal'
                  }}>
                    {item.stockTotal}/{item.stockMinimo}
                  </TableCell>
                  <TableCell>{item.puntoVenta}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(item.id)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default InventoryTable;
