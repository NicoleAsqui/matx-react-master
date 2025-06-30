import { Fragment, useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Card, 
  Badge,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Typography,
  Grid,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import { 
  Notifications as NotificationsIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  CalendarToday as CalendarIcon,
  Inventory as InventoryIcon
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { BarChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart } from "recharts";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Componentes separados
import AlertFilter from "../../components/alert/AlertFilter";
import AlertList from "../../components/alert/AlertList";
import alertsService from "../../services/alertsService";

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

// Datos de ejemplo para el calendario
const generateExpirationData = () => {
  const products = [
    "Vino Tinto Reserva", 
    "Whisky 12 años", 
    "Vodka Premium", 
    "Ron Añejo",
    "Cerveza Artesanal",
    "Ginebra Premium"
  ];
  const stores = ["Metrópolis", "Centro", "Norte", "Sur"];
  
  return products.flatMap(product => {
    return stores.map(store => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + Math.floor(Math.random() * 60) - 15);
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

const storesList = ["Metrópolis", "Centro", "Norte", "Sur"];

const DistributionDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filterType, setFilterType] = useState("todas");
  const [filterStore, setFilterStore] = useState("todas");
  const [dateRange, setDateRange] = useState("3m");
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Cargar alertas al montar el componente
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertsService.getAll();
        setAlerts(data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Error al cargar las alertas");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Función para filtrar por fecha
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

  // Datos para gráficos
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
  const markAsRead = async (id) => {
    try {
      await alertsService.markAsRead(id);
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, leida: true } : alert
      ));
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await alertsService.markAllAsRead();
      setAlerts(alerts.map(alert => ({ ...alert, leida: true })));
    } catch (err) {
      console.error("Error marking all alerts as read:", err);
    }
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

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Box m={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
            <AlertFilter
              filterType={filterType}
              setFilterType={setFilterType}
              filterStore={filterStore}
              setFilterStore={setFilterStore}
              dateRange={dateRange}
              setDateRange={setDateRange}
              stores={storesList}
              alertTypes={alertTypes}
              dateRanges={dateRanges}
            />
          )}
        </Grid>
        
        {/* Contenido según pestaña */}
        {tabValue === 0 ? (
          <Fragment>
            {/* Gráfico 1: Distribución de Alertas por Producto */}
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

            {/* Gráfico 2: Productos en Riesgo de Caducidad */}
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
                                const diasRestantes = Math.floor(
                                  (new Date(alert.detalles.fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24));
                                acc.push({
                                  producto: alert.detalles.producto,
                                  stock_actual: alert.detalles.stock_actual,
                                  dias_restantes: diasRestantes
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

            {/* Gráfico 3: Stock Crítico por Producto */}
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

            {/* Gráfico 4: Tendencia de Alertas por Mes */}
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
        ) : tabValue === 1 ? (
          <Grid item xs={12}>
            <AlertCard>
              <AlertList
                alerts={filteredAlerts}
                expandedAlert={expandedAlert}
                setExpandedAlert={setExpandedAlert}
                markAsRead={markAsRead}
              />
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
                      let backgroundColor = '#3174ad';
                      if (event.resource.daysLeft <= 0) {
                        backgroundColor = '#f44336';
                      } else if (event.resource.daysLeft <= 7) {
                        backgroundColor = '#ff9800';
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
};

export default DistributionDashboard;