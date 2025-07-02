
import { Fragment } from "react";
import { 
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";

const AlertDetails = ({ alert, onClose }) => {
  return (
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
            <strong>Tienda:</strong> {alert.detalles.puntoVenta}
          </Typography>
          {alert.tipo === "caducidad" && (
            <Fragment>
              <Typography variant="body2">
                <strong>Lote:</strong> {alert.detalles.lote}
              </Typography>
              <Typography variant="body2">
                <strong>Caduca:</strong> {new Date(alert.detalles.fechaCaducidad).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Stock actual:</strong> {alert.detalles.stockActual} unidades
              </Typography>
              <Typography variant="body2">
                <strong>Cliente asignado:</strong> {alert.detalles.clienteAsignado}
              </Typography>
            </Fragment>
          )}
          {alert.tipo === "stock" && (
            <Fragment>
              <Typography variant="body2">
                <strong>Stock actual:</strong> {alert.detalles.stockActual} unidades
              </Typography>
              <Typography variant="body2">
                <strong>Stock mínimo:</strong> {alert.detalles.stockMinimo} unidades
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
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            Cerrar detalles
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlertDetails;