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
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, PieChart, Pie, Cell } from "recharts";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuración del calendario
const localizer = momentLocalizer(moment);

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
  
  return tipo === "caducidad" ? (
    <ScheduleIcon {...iconProps} color="error" />
  ) : (
    <InventoryIcon {...iconProps} color="warning" />
  );
};

// Datos de ejemplo coherentes
const stores = ["Metrópolis", "Centro", "Norte", "Sur"];

const generateAlerts = () => {
  const products = [
    "Vino Tinto Reserva", 
    "Whisky 12 años", 
    "Vodka Premium", 
    "Ron Añejo",
    "Cerveza Artesanal",
    "Ginebra Premium"
  ];
  
  return Array.from({ length: 20 }, (_, i) => {
    const type = Math.random() > 0.5 ? "caducidad" : "stock";
    const store = stores[Math.floor(Math.random() * stores.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);

    // Generar días hasta caducidad (puede ser negativo)
    const daysUntilExpiry = Math.floor(Math.random() * 60) - 15; // Entre -15 y 45 días
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

    // Severidad basada en días o stock
    const severity = type === "caducidad" 
      ? daysUntilExpiry <= 0 ? "alta" : daysUntilExpiry <= 7 ? "media" : "baja"
      : Math.random() > 0.7 ? "alta" : Math.random() > 0.4 ? "media" : "baja";

    return {
      id: i + 1,
      tipo: type,
      severidad: severity,
      titulo: type === "caducidad" 
        ? `Caducidad próxima - ${product}` 
        : `Stock bajo - ${product}`,
      descripcion: type === "caducidad"
        ? `El producto ${product} ${daysUntilExpiry <= 0 ? "está vencido" : `caduca en ${daysUntilExpiry} días`}`
        : `Stock bajo del producto ${product}`,
      timestamp: timestamp.getTime(),
      leida: Math.random() > 0.7,
      detalles: {
        producto: product,
        punto_venta: store,
        ...(type === "caducidad" ? {
          lote: `LT-${Math.floor(1000 + Math.random() * 9000)}`,
          fecha_caducidad: expiryDate.toISOString(),
          dias_restantes: daysUntilExpiry,
          stock_actual: Math.floor(5 + Math.random() * 20), // Stock para caducidad
          cliente_asignado: `Cliente ${Math.floor(1 + Math.random() * 100)}`
        } : {
          stock_actual: Math.floor(Math.random() * 10), // Stock para alertas de stock
          stock_minimo: 15,
          deficit_stock: 15 - Math.floor(Math.random() * 10), // Campo adicional
          proveedor: `Proveedor ${Math.floor(1 + Math.random() * 5)}`
        })
      }
    };
  });
};
const generateExpirationData = () => {
  const products = [
    "Vino Tinto Reserva", 
    "Whisky 12 años", 
    "Vodka Premium", 
    "Ron Añejo",
    "Cerveza Artesanal",
    "Ginebra Premium"
  ];
  
  return products.flatMap(product => {
    return stores.map(store => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + Math.floor(Math.random() * 60) - 15); // +/- 15 días
      const daysLeft = Math.floor((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
      
      return {
        product,
        lot: `LT-${Math.floor(1000 + Math.random() * 9000)}`,
        store,
        quantity: Math.floor(10 + Math.random() * 100),
        expiration: expirationDate,
        daysLeft,
        category: product.includes("Vino") || product.includes("Cerveza") ? "Fermentados" :
                 product.includes("Whisky") || product.includes("Ron") ? "Destilados" : "Variados"
      };
    });
  });
};

const alertData = generateAlerts();
const expirationData = generateExpirationData();

// Filtros comunes
const alertTypes = [
  { value: "todas", label: "Todas las alertas" },
  { value: "caducidad", label: "Caducidad" },
  { value: "stock", label: "Stock bajo" }
];

const dateRanges = [
  { value: "1m", label: "Último mes" },
  { value: "3m", label: "Últimos 3 meses" },
  { value: "6m", label: "Últimos 6 meses" },
  { value: "1y", label: "Último año" },
  { value: "all", label: "Todo el historial" }
];

export default function DistributionDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [filterType, setFilterType] = useState("todas");
  const [filterStore, setFilterStore] = useState("todas");
  const [dateRange, setDateRange] = useState("3m");
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [alerts, setAlerts] = useState(alertData);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Función común para filtrar por fecha
  const filterByDate = (date) => {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case "1m": startDate.setMonth(now.getMonth() - 1); break;
      case "3m": startDate.setMonth(now.getMonth() - 3); break;
      case "6m": startDate.setMonth(now.getMonth() - 6); break;
      case "1y": startDate.setFullYear(now.getFullYear() - 1); break;
      default: startDate = new Date(0);
    }
    
    return dateRange === "all" || new Date(date) >= startDate;
  };

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === "todas" || alert.tipo === filterType;
    const storeMatch = filterStore === "todas" || alert.detalles.punto_venta === filterStore;
    const dateMatch = filterByDate(alert.timestamp);
    
    return typeMatch && storeMatch && dateMatch;
  });

  // Filtrar datos de caducidad para el calendario
  const filteredExpirationData = expirationData.filter(item => {
    const storeMatch = filterStore === "todas" || item.store === filterStore;
    const dateMatch = filterByDate(item.expiration);
    
    return storeMatch && dateMatch;
  });

  const filteredProductData = alerts
    .filter(alert => 
      (filterType === "todas" || alert.tipo === filterType) &&
      (filterStore === "todas" || alert.detalles.punto_venta === filterStore) &&
      filterByDate(alert.timestamp)
    )
    .reduce((acc, alert) => {
      const product = alert.detalles.producto;
      const existing = acc.find(item => item.name === product);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: product, value: 1 });
      }
      return acc;
    }, []);

  // Funciones de gestión
  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, leida: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, leida: true })));
  };

  const unreadCount = alerts.filter(alert => !alert.leida).length;

  // Preparar eventos para el calendario
  const calendarEvents = filteredExpirationData.map(item => ({
    title: `${item.product} (${item.quantity}u) - ${item.store}`,
    start: new Date(item.expiration),
    end: new Date(item.expiration),
    allDay: true,
    resource: item
  }));

  return (
    <DashboardContainer>
      <Grid container spacing={3}>
        {/* Header y filtros */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">Gestión de Distribución</Typography>
              <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2, mr: 2 }}>
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
            </Box>
          </Box>
          
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Resumen" icon={<BarChartIcon />} />
            <Tab label="Alertas" icon={<ListIcon />} />
            <Tab label="Caducidades" icon={<CalendarIcon />} />
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
                <InputLabel>Tienda</InputLabel>
                <Select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  label="Tienda"
                >
                  <MenuItem value="todas">Todas las tiendas</MenuItem>
                  {stores.map(store => (
                    <MenuItem key={store} value={store}>{store}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Período</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Período"
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
        
        {/* Contenido según pestaña */}
        {tabValue === 0 ? (
  <Fragment>
    {/* Gráfico 1: Distribución de Alertas por Producto - Siempre visible */}
    <Grid item xs={12} md={6}>
      <AlertCard>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Typography variant="h6">
            Distribución de Alertas por Producto en {filterStore}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Período: {dateRange === "1m" ? "Último mes" : 
                    dateRange === "3m" ? "Últimos 3 meses" : 
                    dateRange === "6m" ? "Últimos 6 meses" : 
                    dateRange === "1y" ? "Último año" : "Todo el historial"}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Tipo de alerta: {filterType === "todas" ? "Todas" : filterType === "caducidad" ? "Caducidad" : "Stock bajo"}
          </Typography>
        </Box>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredProductData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {filteredProductData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"][index % 5]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} alertas`, 
                  `(${((props.payload.percent || 0) * 100).toFixed(1)}%)`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </AlertCard>
    </Grid>

    {/* Gráfico 2: Productos en Riesgo de Caducidad - Solo visible para "todas" o "caducidad" */}
    {(filterType === "todas" || filterType === "caducidad") && (
      <Grid item xs={12} md={6}>
        <AlertCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Productos en Riesgo de Caducidad en {filterStore}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Período: {dateRange === "1m" ? "Último mes" : 
                       dateRange === "3m" ? "Últimos 3 meses" : 
                       dateRange === "6m" ? "Últimos 6 meses" : 
                       dateRange === "1y" ? "Último año" : "Todo el historial"}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredAlerts
                  .filter(alert => alert.tipo === "caducidad" && 
                         (filterStore === "todas" || alert.detalles.punto_venta === filterStore))
                  .reduce((acc, alert) => {
                    const found = acc.find(item => item.producto === alert.detalles.producto);
                    if (found) {
                      found.stock_actual += alert.detalles.stock_actual;
                    } else {
                      acc.push({
                        producto: alert.detalles.producto,
                        stock_actual: alert.detalles.stock_actual,
                        dias_restantes: Math.floor(
                          (new Date(alert.detalles.fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24)
                        )
                      });

                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.stock_actual - a.stock_actual)
                  .slice(0, 5)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="producto" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} unidades`, 
                    `${props.payload.dias_restantes} días restantes`
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="stock_actual" 
                  fill="#ef5350" 
                  name="Stock por caducar" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </AlertCard>
      </Grid>
    )}

    {/* Gráfico 3: Stock Crítico por Producto - Solo visible para "todas" o "stock" */}
    {(filterType === "todas" || filterType === "stock") && (
      <Grid item xs={12} md={6}>
        <AlertCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stock Crítico por Producto {filterStore}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Período: {dateRange === "1m" ? "Último mes" : 
                       dateRange === "3m" ? "Últimos 3 meses" : 
                       dateRange === "6m" ? "Últimos 6 meses" : 
                       dateRange === "1y" ? "Último año" : "Todo el historial"}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredAlerts
                  .filter(alert => alert.tipo === "stock" && 
                         (filterStore === "todas" || alert.detalles.punto_venta === filterStore))
                  .map(alert => ({
                    producto: alert.detalles.producto,
                    stock_actual: alert.detalles.stock_actual,
                    stock_minimo: alert.detalles.stock_minimo,
                    deficit: alert.detalles.stock_minimo - alert.detalles.stock_actual
                  }))
                  .sort((a, b) => b.deficit - a.deficit)
                  .slice(0, 5)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="producto" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} unidades`, 
                    name === "stock_actual" ? 
                      `${Math.round((props.payload.stock_actual / props.payload.stock_minimo) * 100)}% del mínimo` :
                      `Déficit: ${props.payload.deficit} unidades`
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="stock_actual" 
                  fill="#ffa726" 
                  name="Stock disponible" 
                />
                <Bar 
                  dataKey="stock_minimo" 
                  fill="#e0e0e0" 
                  name="Stock mínimo" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </AlertCard>
      </Grid>
    )}

    {/* Gráfico 4: Tendencia de Alertas por Mes - Siempre visible */}
    <Grid item xs={12}>
      <AlertCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tendencia de Alertas por Mes en {filterStore}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Tipo: {filterType === "todas" ? "Todos" : filterType === "caducidad" ? "Caducidad" : "Stock bajo"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Período: {dateRange === "1m" ? "Último mes" : 
                       dateRange === "3m" ? "Últimos 3 meses" : 
                       dateRange === "6m" ? "Últimos 6 meses" : 
                       dateRange === "1y" ? "Último año" : "Todo el historial"}
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={(() => {
                const counts = {};
                filteredAlerts.forEach(alert => {
                  const date = new Date(alert.timestamp);
                  const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                  if (!counts[key]) counts[key] = { 
                    month: key, 
                    caducidad: 0, 
                    stock: 0,
                    displayMonth: date.toLocaleString('default', { month: 'short', year: 'numeric' })
                  };
                  counts[key][alert.tipo]++;
                });
                return Object.values(counts)
                  .sort((a, b) => a.month.localeCompare(b.month))
                  .map(item => ({
                    ...item,
                    month: item.displayMonth
                  }));
              })()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {(filterType === "todas" || filterType === "caducidad") && (
                <Line 
                  type="monotone" 
                  dataKey="caducidad" 
                  stroke="#f44336" 
                  name="Caducidad" 
                  strokeWidth={2}
                />
              )}
              {(filterType === "todas" || filterType === "stock") && (
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="#ff9800" 
                  name="Stock bajo" 
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </AlertCard>
    </Grid>
  </Fragment>
)
: tabValue === 1 ? (
          <Grid item xs={12}>
            <AlertCard>
              <List>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <Fragment key={alert.id}>
                      <ListItem 
                        secondaryAction={
                          <IconButton edge="end" onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}>
                            {expandedAlert === alert.id ? <CloseIcon /> : <InventoryIcon />}
                          </IconButton>
                        }
                        sx={{ 
                          backgroundColor: !alert.leida ? 'action.hover' : 'inherit',
                          borderLeft: !alert.leida ? `4px solid ${alert.tipo === "caducidad" ? '#f44336' : '#ff9800'}` : 'none',
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
        {alert.tipo === "caducidad" 
          ? alert.detalles.dias_restantes <= 0 
            ? "VENCIDO" 
            : `${alert.detalles.dias_restantes} DÍAS`
          : `-${alert.detalles.deficit_stock} UNIDADES`}
      </SeverityBadge>
      <Typography variant="subtitle1" component="span">
        {alert.titulo}
      </Typography>
    </Box>
  }
  secondary={
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {alert.tipo === "caducidad" 
          ? `Caduca: ${new Date(alert.detalles.fecha_caducidad).toLocaleDateString()}` 
          : `Stock actual: ${alert.detalles.stock_actual}/${alert.detalles.stock_minimo}`}
      </Typography>
      <Box component="span" mx={1}>•</Box>
      <Typography variant="body2" color="text.secondary">
        {alert.detalles.punto_venta}
      </Typography>
    </Box>
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
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2">
                                <strong>Producto:</strong> {alert.detalles.producto}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Tienda:</strong> {alert.detalles.punto_venta}
                              </Typography>
                              {alert.tipo === "caducidad" && (
                                <Fragment>
                                  <Typography variant="body2">
                                    <strong>Lote:</strong> {alert.detalles.lote}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Caduca:</strong> {new Date(alert.detalles.fecha_caducidad).toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Stock actual:</strong> {alert.detalles.stock_actual} unidades
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Cliente asignado:</strong> {alert.detalles.cliente_asignado}
                                  </Typography>
                                </Fragment>
                              )}
                              {alert.tipo === "stock" && (
                                <Fragment>
                                  <Typography variant="body2">
                                    <strong>Stock actual:</strong> {alert.detalles.stock_actual} unidades
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Stock mínimo:</strong> {alert.detalles.stock_minimo} unidades
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Proveedor:</strong> {alert.detalles.proveedor}
                                  </Typography>
                                </Fragment>
                              )}
                            </Grid>
                            <Grid item xs={12}>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="secondary"
                                startIcon={<CloseIcon />}
                                onClick={() => setExpandedAlert(null)}
                                sx={{ mr: 2 }}
                              >
                                Cerrar detalles
                              </Button>
                            </Grid>
                          </Grid>
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
          <Grid item xs={12}>
            <AlertCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Calendario de Caducidades</Typography>
                </Box>
                
                <CalendarContainer>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    onSelectEvent={event => setSelectedEvent(event)}
                    views={['month', 'week', 'day', 'agenda']}
                    defaultView="month"
                    eventPropGetter={(event) => {
                      let backgroundColor = '#3174ad'; // Normal
                      if (event.resource.daysLeft <= 0) {
                        backgroundColor = '#f44336'; // Vencido
                      } else if (event.resource.daysLeft <= 7) {
                        backgroundColor = '#ff9800'; // Por vencer
                      }
                      return { style: { backgroundColor, color: 'white' } };
                    }}
                  />
                </CalendarContainer>
                
                {selectedEvent && (
                  <Dialog 
                    open={!!selectedEvent} 
                    onClose={() => setSelectedEvent(null)}
                    maxWidth="sm"
                    fullWidth
                  >
                    <DialogTitle>
                      <Box display="flex" alignItems="center">
                        <InventoryIcon color="primary" sx={{ mr: 1 }} />
                        Detalles de Caducidad
                      </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Producto
                          </Typography>
                          <Typography variant="body1">
                            {selectedEvent.resource.product}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Lote
                          </Typography>
                          <Typography variant="body1">
                            {selectedEvent.resource.lot}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Tienda
                          </Typography>
                          <Typography variant="body1">
                            {selectedEvent.resource.store}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Cantidad
                          </Typography>
                          <Typography variant="body1">
                            {selectedEvent.resource.quantity} unidades
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Fecha de caducidad
                          </Typography>
                          <Typography variant="body1">
                            {selectedEvent.resource.expiration.toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Estado
                          </Typography>
                          <Chip 
                            label={selectedEvent.resource.daysLeft <= 0 ? 
                              `Vencido (${Math.abs(selectedEvent.resource.daysLeft)} días)` : 
                              `${selectedEvent.resource.daysLeft} días restantes`} 
                            color={selectedEvent.resource.daysLeft <= 0 ? "error" : 
                                  selectedEvent.resource.daysLeft <= 7 ? "warning" : "success"}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button 
                        onClick={() => setSelectedEvent(null)}
                        color="primary"
                        variant="outlined"
                      >
                        Cerrar
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </CardContent>
            </AlertCard>
          </Grid>
        )}
      </Grid>
    </DashboardContainer>
  );
}