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
  InputLabel
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
  LocalOffer as LocalOfferIcon,
  LocalShipping as ShippingIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  DateRange as DateRangeIcon
} from "@mui/icons-material";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { alertData } from "app/mockData/alerts";
// Datos para gráficos
const alertStatsByType = [
  { name: "Caducidad", value: 12, color: "#ff6384" },
  { name: "Stock bajo", value: 8, color: "#36a2eb" },
  { name: "Cambio clientes", value: 5, color: "#ffce56" },
  { name: "Problemas entrega", value: 3, color: "#4bc0c0" }
];

const alertStatsByStore = [
  { name: "Metrópolis", caducidad: 7, stock: 4, clientes: 3, entrega: 1 },
  { name: "Centro", caducidad: 3, stock: 2, clientes: 1, entrega: 1 },
  { name: "Norte", caducidad: 2, stock: 2, clientes: 1, entrega: 1 }
];

const trendData = [
  { month: "Mar", caducidad: 2, stock: 3, clientes: 1 },
  { month: "Abr", caducidad: 5, stock: 2, clientes: 2 },
  { month: "May", caducidad: 7, stock: 4, clientes: 3 }
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

const AlertItem = styled(ListItem)(({ theme, unread }) => ({
  backgroundColor: unread ? theme.palette.action.hover : "inherit",
  borderLeft: unread ? `4px solid ${theme.palette.warning.main}` : "none",
  "&:hover": {
    backgroundColor: theme.palette.action.selected
  }
}));

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
  
  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filtrar alertas según selección
  const filteredAlerts = alerts.filter(alert => {
    // Filtrar por tipo
    const typeMatch = filterType === "todas" || alert.tipo === filterType;
    
    // Filtrar por tienda
    const storeMatch = filterStore === "todas" || 
      (alert.detalles.puntoVenta && alert.detalles.puntoVenta.includes(filterStore)) ||
      (alert.detalles.cliente && alert.detalles.cliente.includes(filterStore));
    
    // Filtrar por rango de fecha
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case "1m":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Todas las fechas
    }
    
    const dateMatch = dateRange === "all" || 
      new Date(alert.timestamp) >= startDate;
    
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
  const stores = [...new Set(alerts.map(a => 
    a.detalles.puntoVenta || (a.detalles.cliente && a.detalles.cliente.includes("Tienda") ? a.detalles.cliente : null)
  ).filter(Boolean))];
  
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

  return (
    <DashboardContainer>
      <Grid container spacing={3}>
        {/* Header y filtros */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
                <NotificationsIcon fontSize="large" color="action" />
              </Badge>
              <Typography variant="h4">Dashboard de Alertas</Typography>
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
            </Box>
          </Box>
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Resumen Gráfico" icon={<BarChartIcon />} />
            <Tab label="Lista de Alertas" icon={<ListIcon />} />
          </Tabs>
          
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
        </Grid>
        
        {/* Contenido según pestaña seleccionada */}
        {tabValue === 0 ? (
          /* Pestaña de resumen gráfico */
          <Fragment>
            <Grid item xs={12} md={6}>
              <AlertCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alertas por tipo
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={alertStatsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {alertStatsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </AlertCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <AlertCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alertas por tienda (últimos 3 meses)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={alertStatsByStore}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="caducidad" stackId="a" fill="#ff6384" name="Caducidad" />
                      <Bar dataKey="stock" stackId="a" fill="#36a2eb" name="Stock bajo" />
                      <Bar dataKey="clientes" stackId="a" fill="#ffce56" name="Cambio clientes" />
                      <Bar dataKey="entrega" stackId="a" fill="#4bc0c0" name="Problemas entrega" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </AlertCard>
            </Grid>
            
            <Grid item xs={12}>
              <AlertCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tendencia de alertas en Metrópolis
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={trendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="caducidad" fill="#ff6384" name="Caducidad" />
                      <Bar dataKey="stock" fill="#36a2eb" name="Stock bajo" />
                      <Bar dataKey="clientes" fill="#ffce56" name="Cambio clientes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </AlertCard>
            </Grid>
          </Fragment>
        ) : (
          /* Pestaña de lista de alertas */
          <Grid item xs={12}>
            <AlertCard>
              <List>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <Fragment key={alert.id}>
                      <AlertItem 
                        unread={!alert.leida}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => toggleExpand(alert.id)}>
                            {expandedAlert === alert.id ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                          </IconButton>
                        }
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
                      </AlertItem>
                      
                      {expandedAlert === alert.id && (
                        <Box sx={{ 
                          p: 3, 
                          backgroundColor: (theme) => theme.palette.grey[50],
                          borderLeft: (theme) => `4px solid ${theme.palette.divider}`
                        }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Detalles completos de la alerta:
                          </Typography>
                          
                          {/* Detalles específicos según tipo de alerta */}
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
                                  <strong>Caduca:</strong> {new Date(alert.detalles.fechaCaducidad).toLocaleDateString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Punto de venta:</strong> {alert.detalles.puntoVenta}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Stock actual:</strong> {alert.detalles.stockActual} unidades
                                </Typography>
                                {alert.detalles.clienteAsignado && (
                                  <Typography variant="body2">
                                    <strong>Cliente asignado:</strong> {alert.detalles.clienteAsignado}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12}>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="warning"
                                  startIcon={<ScheduleIcon />}
                                  sx={{ mr: 2 }}
                                >
                                  Reprogramar entrega
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="error"
                                  startIcon={<CloseIcon />}
                                >
                                  Dar de baja lote
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                          
                          {alert.tipo === "cliente" && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Cliente:</strong> {alert.detalles.cliente}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Producto afectado:</strong> {alert.detalles.productoAfectado}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Compra promedio:</strong> {alert.detalles.compraPromedio}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Compra actual:</strong> {alert.detalles.compraActual}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Último pedido:</strong> {new Date(alert.detalles.ultimoPedido).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Tendencia:</strong> 
                                  <Chip 
                                    label={alert.detalles.tendencia} 
                                    size="small" 
                                    color={alert.detalles.tendencia === "bajando" ? "error" : "success"}
                                    sx={{ ml: 1 }}
                                  />
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="info"
                                  startIcon={<PersonIcon />}
                                  sx={{ mr: 2 }}
                                >
                                  Contactar al cliente
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  startIcon={<LocalOfferIcon />}
                                >
                                  Ofrecer promoción
                                </Button>
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
        )}
      </Grid>
    </DashboardContainer>
  );
}