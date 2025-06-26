import { Fragment, useState } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  Grid, 
  IconButton, 
  List, 
  ListItem, 
  ListItemAvatar,
  InputAdornment,
  ListItemText, 
  MenuItem,
  Typography,
  Badge,
  Avatar,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocalShipping as ShippingIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  DateRange as DateRangeIcon,
  CalendarToday as CalendarIcon,
  SwapHoriz as TransferIcon,
  Check as CheckIcon
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { alertData } from "app/mockData/alerts";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuración del calendario
const localizer = momentLocalizer(moment);

// Datos simulados mejorados
const stockByStore = [
  { name: "Metrópolis", stock: 2450, capacity: 3000, lowStockItems: 12 },
  { name: "Centro", stock: 1800, capacity: 2500, lowStockItems: 8 },
  { name: "Norte", stock: 950, capacity: 2000, lowStockItems: 15 }
];

const expirationData = [
  { product: "Leche Entera 1L", lot: "LT-2023-05", store: "Metrópolis", quantity: 120, expiration: "2023-06-15", daysLeft: 5 },
  { product: "Yogur Natural 500g", lot: "YG-2023-04", store: "Centro", quantity: 80, expiration: "2023-06-20", daysLeft: 10 },
  { product: "Queso Gouda 200g", lot: "QD-2023-03", store: "Norte", quantity: 45, expiration: "2023-06-10", daysLeft: 0 },
  { product: "Mantequilla 250g", lot: "MT-2023-05", store: "Metrópolis", quantity: 60, expiration: "2023-06-25", daysLeft: 15 },
  { product: "Crema Fresca 200ml", lot: "CR-2023-04", store: "Centro", quantity: 30, expiration: "2023-06-05", daysLeft: -5 }
];

const productMovement = [
  { month: "Mar", transfers: 15, returns: 3, adjustments: 2 },
  { month: "Abr", transfers: 22, returns: 5, adjustments: 1 },
  { month: "May", transfers: 18, returns: 4, adjustments: 3 }
];

// STYLED COMPONENTS
const DashboardContainer = styled("div")(({ theme }) => ({
  margin: "2rem",
  [theme.breakpoints.down("sm")]: { margin: "1rem" }
}));

const AlertCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2]
}));

const CalendarContainer = styled("div")({
  height: 700,
  marginTop: 16
});

const SeverityBadge = styled("span")(({ severity, theme }) => {
  const colorMap = {
    alta: theme.palette.error.main,
    media: theme.palette.warning.main,
    baja: theme.palette.info.main
  };
  
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    backgroundColor: colorMap[severity] || theme.palette.grey[500],
    color: theme.palette.common.white,
    marginRight: theme.spacing(1)
  };
});

const AlertIcon = ({ tipo }) => {
  const iconProps = { fontSize: "small" };
  const colorMap = {
    caducidad: "error",
    stock: "warning",
    cliente: "info",
    entrega: "secondary"
  };
  
  switch(tipo) {
    case "caducidad":
      return <ScheduleIcon {...iconProps} color={colorMap[tipo]} />;
    case "stock":
      return <InventoryIcon {...iconProps} color={colorMap[tipo]} />;
    case "cliente":
      return <PersonIcon {...iconProps} color={colorMap[tipo]} />;
    case "entrega":
      return <ShippingIcon {...iconProps} color={colorMap[tipo]} />;
    default:
      return <WarningIcon {...iconProps} />;
  }
};

export default function AlertsDashboard() {
  // Estados para filtros y visualización
  const [tabValue, setTabValue] = useState(0);
  const [filterType, setFilterType] = useState("todas");
  const [filterStore, setFilterStore] = useState("todas");
  const [dateRange, setDateRange] = useState("3m");
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [alerts, setAlerts] = useState(alertData);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [transferData, setTransferData] = useState({
    product: "",
    fromStore: "",
    toStore: "",
    quantity: 0,
    reason: ""
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filtrar alertas según selección
  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === "todas" || alert.tipo === filterType;
    const storeMatch = filterStore === "todas" || 
      (alert.detalles.punto_venta && alert.detalles.punto_venta.includes(filterStore));
    
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case "1m": startDate.setMonth(now.getMonth() - 1); break;
      case "3m": startDate.setMonth(now.getMonth() - 3); break;
      case "6m": startDate.setMonth(now.getMonth() - 6); break;
      case "1y": startDate.setFullYear(now.getFullYear() - 1); break;
      default: startDate = new Date(0);
    }
    
    const dateMatch = dateRange === "all" || new Date(alert.timestamp) >= startDate;
    
    return typeMatch && storeMatch && dateMatch;
  });
  
  // Marcadores de alertas
  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, leida: true } : alert
    ));
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, leida: true })));
  };
  
  const toggleExpand = (id) => {
    setExpandedAlert(expandedAlert === id ? null : id);
  };
  
  // Contadores
  const unreadCount = alerts.filter(alert => !alert.leida).length;
  const stores = [...new Set(alerts.map(a => a.detalles.punto_venta).filter(Boolean))];
  
  // Tipos de alertas para filtro
  const alertTypes = [
    { value: "todas", label: "Todas las alertas" },
    { value: "caducidad", label: "Caducidad" },
    { value: "stock", label: "Stock bajo" },
    { value: "cliente", label: "Cambios en clientes" },
    { value: "entrega", label: "Problemas de entrega" }
  ];
  
  // Rangos de fecha
  const dateRanges = [
    { value: "1m", label: "Último mes" },
    { value: "3m", label: "Últimos 3 meses" },
    { value: "6m", label: "Últimos 6 meses" },
    { value: "1y", label: "Último año" },
    { value: "all", label: "Todo el historial" }
  ];
  
  // Preparar eventos para el calendario
  const calendarEvents = expirationData.map(item => ({
    title: `${item.product} (${item.quantity}u) - ${item.store}`,
    start: new Date(item.expiration),
    end: new Date(item.expiration),
    allDay: true,
    resource: item
  }));
  
  // Manejar transferencia de productos
  const handleTransferSubmit = () => {
    // Aquí iría la lógica para registrar la transferencia
    console.log("Transferencia registrada:", transferData);
    setOpenTransferDialog(false);
    setTransferData({
      product: "",
      fromStore: "",
      toStore: "",
      quantity: 0,
      reason: ""
    });
  };

  return (
    <DashboardContainer>
      <Grid container spacing={3}>
        {/* Header y filtros */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">Gestión de Distribución </Typography>
              <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
                <NotificationsIcon fontSize="large" color="action" />
              </Badge>
            </Box>
            
            <Box display="flex" alignItems="center">
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                sx={{ mr: 2 }}
              >
                Marcar todas como leídas
              </Button>
              <Button 
                variant="contained" 
                startIcon={<TransferIcon />}
                onClick={() => setOpenTransferDialog(true)}
              >
                Transferir Stock
              </Button>
            </Box>
          </Box>
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Resumen Distribución" icon={<BarChartIcon />} />
            <Tab label="Lista de Alertas" icon={<ListIcon />} />
            <Tab label="Calendario Caducidades" icon={<CalendarIcon />} />
          </Tabs>
          
          {tabValue !== 2 && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de alerta</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Tipo de alerta"
                  >
                    {alertTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Punto de venta</InputLabel>
                  <Select
                    value={filterStore}
                    onChange={(e) => setFilterStore(e.target.value)}
                    label="Punto de venta"
                  >
                    <MenuItem value="todas">Todos los puntos</MenuItem>
                    {stores.map(store => (
                      <MenuItem key={store} value={store}>{store}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Rango de fecha</InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label="Rango de fecha"
                    startAdornment={
                      <InputAdornment position="start">
                        <DateRangeIcon />
                      </InputAdornment>
                    }
                  >
                    {dateRanges.map(range => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => {
                    setFilterType("todas");
                    setFilterStore("todas");
                    setDateRange("3m");
                  }}
                >
                  Limpiar filtros
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
        
        {/* Contenido según pestaña seleccionada */}
        {tabValue === 0 ? (
          /* Pestaña de resumen gráfico */
          <Fragment>
            <Grid item xs={12} md={6}>
              <AlertCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Niveles de Stock por Tienda
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stockByStore}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" fill="#8884d8" name="Stock Actual" />
                      <Bar dataKey="capacity" fill="#82ca9d" name="Capacidad Minima" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </AlertCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <AlertCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Productos Próximos a Caducar
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell>Tienda</TableCell>
                          <TableCell>Cantidad</TableCell>
                          <TableCell>Días restantes</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {expirationData
                          .sort((a, b) => a.daysLeft - b.daysLeft)
                          .map((row) => (
                            <TableRow key={`${row.product}-${row.lot}`}>
                              <TableCell>{row.product}</TableCell>
                              <TableCell>{row.store}</TableCell>
                              <TableCell>{row.quantity}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={row.daysLeft <= 0 ? `Vencido (${Math.abs(row.daysLeft)} días)` : `${row.daysLeft} días`} 
                                  color={row.daysLeft <= 0 ? "error" : row.daysLeft <= 7 ? "warning" : "success"}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </AlertCard>
            </Grid>
            
            <Grid item xs={12}>
              <AlertCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Movimiento de Productos entre Tiendas
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={productMovement}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="transfers" stroke="#8884d8" name="Transferencias" />
                      <Line type="monotone" dataKey="returns" stroke="#ff6384" name="Devoluciones" />
                      <Line type="monotone" dataKey="adjustments" stroke="#ffce56" name="Ajustes" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </AlertCard>
            </Grid>
          </Fragment>
        ) : tabValue === 1 ? (
          /* Pestaña de lista de alertas */
          <Grid item xs={12}>
            <AlertCard>
              <List>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <Fragment key={alert.id}>
                      <ListItem 
                        secondaryAction={
                          <IconButton edge="end" onClick={() => toggleExpand(alert.id)}>
                            {expandedAlert === alert.id ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                          </IconButton>
                        }
                        sx={{ 
                          backgroundColor: !alert.leida ? 'action.hover' : 'inherit',
                          borderLeft: !alert.leida ? `4px solid ${theme => theme.palette.warning.main}` : 'none',
                          '&:hover': { backgroundColor: 'action.selected' }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "transparent" }}>
                            <AlertIcon tipo={alert.tipo} />
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <SeverityBadge severity={alert.severidad}>
                                {alert.severidad.toUpperCase()}
                              </SeverityBadge>
                              <Typography variant="subtitle1" component="span">
                                {alert.titulo}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              {new Date(alert.timestamp).toLocaleString()}
                              <Box component="span" mx={1}>•</Box>
                              {alert.descripcion}
                            </Typography>
                          }
                          onClick={() => markAsRead(alert.id)}
                        />
                      </ListItem>
                      
                      {expandedAlert === alert.id && (
                        <Box sx={{ 
                          p: 3, 
                          backgroundColor: (theme) => theme.palette.grey[50],
                          borderLeft: (theme) => `4px solid ${theme.palette.divider}`
                        }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Detalles completos de la alerta:
                          </Typography>
                          
                          {alert.tipo === "caducidad" && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Producto:</strong> {alert.detalles.producto}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Lote:</strong> {alert.detalles.lote}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Caduca:</strong> {new Date(alert.detalles.fecha_caducidad).toLocaleDateString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Punto de venta:</strong> {alert.detalles.punto_venta}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Stock actual:</strong> {alert.detalles.stock_actual} unidades
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      )}
                      
                      <Divider component="li" />
                    </Fragment>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay alertas que coincidan con los filtros seleccionados
                    </Typography>
                  </Box>
                )}
              </List>
            </AlertCard>
          </Grid>
        ) : (
          /* Pestaña de calendario de caducidades */
          <Grid item xs={12}>
            <AlertCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Calendario de Caducidades</Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<DateRangeIcon />}
                      sx={{ mr: 2 }}
                      onClick={() => setDateRange("1m")}
                    >
                      Este mes
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<DateRangeIcon />}
                      onClick={() => setDateRange("3m")}
                    >
                      Próximos 3 meses
                    </Button>
                  </Box>
                </Box>
                
                <CalendarContainer>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    onSelectEvent={event => setSelectedEvent(event)}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    popup
                  />
                </CalendarContainer>
                
                {selectedEvent && (
                  <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
                    <DialogTitle>Detalles de Caducidad</DialogTitle>
                    <DialogContent>
                      <Typography variant="body1" gutterBottom>
                        <strong>Producto:</strong> {selectedEvent.resource.product}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Lote:</strong> {selectedEvent.resource.lot}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Tienda:</strong> {selectedEvent.resource.store}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Cantidad:</strong> {selectedEvent.resource.quantity} unidades
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Fecha de caducidad:</strong> {moment(selectedEvent.start).format('LL')}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Días restantes:</strong> 
                        <Chip 
                          label={selectedEvent.resource.daysLeft <= 0 ? 
                            `Vencido (${Math.abs(selectedEvent.resource.daysLeft)} días)` : 
                            `${selectedEvent.resource.daysLeft} días`} 
                          color={selectedEvent.resource.daysLeft <= 0 ? "error" : 
                                 selectedEvent.resource.daysLeft <= 7 ? "warning" : "success"}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button 
                        onClick={() => setSelectedEvent(null)}
                        color="primary"
                      >
                        Cerrar
                      </Button>
                      <Button 
                        variant="contained" 
                        startIcon={<SwapHoriz />}
                        disabled={selectedEvent.resource.daysLeft <= 0}
                      >
                        Transferir Producto
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </CardContent>
            </AlertCard>
          </Grid>
        )}
      </Grid>
      
      {/* Diálogo para transferir stock */}
      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)}>
        <DialogTitle>Transferir Stock entre Tiendas</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Producto"
                fullWidth
                value={transferData.product}
                onChange={(e) => setTransferData({...transferData, product: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Desde Tienda</InputLabel>
                <Select
                  value={transferData.fromStore}
                  onChange={(e) => setTransferData({...transferData, fromStore: e.target.value})}
                  label="Desde Tienda"
                >
                  {stores.map(store => (
                    <MenuItem key={`from-${store}`} value={store}>{store}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Hacia Tienda</InputLabel>
                <Select
                  value={transferData.toStore}
                  onChange={(e) => setTransferData({...transferData, toStore: e.target.value})}
                  label="Hacia Tienda"
                >
                  {stores.map(store => (
                    <MenuItem key={`to-${store}`} value={store}>{store}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                value={transferData.quantity}
                onChange={(e) => setTransferData({...transferData, quantity: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Motivo"
                multiline
                rows={3}
                fullWidth
                value={transferData.reason}
                onChange={(e) => setTransferData({...transferData, reason: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransferDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleTransferSubmit}
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Confirmar Transferencia
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
}