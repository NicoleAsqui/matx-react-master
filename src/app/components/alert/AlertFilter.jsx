import { 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";

const AlertFilter = ({
  filterType,
  setFilterType,
  filterStore,
  setFilterStore,
  dateRange,
  setDateRange,
  stores,
  alertTypes,
  dateRanges
}) => {
  return (
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
  );
};

export default AlertFilter;