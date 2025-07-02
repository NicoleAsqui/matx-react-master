import { Fragment } from "react";
import { 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import AlertIcon from "../../icons/AlertIcon";
import SeverityBadge from "../../icons/SeverityBadge";
import AlertDetails from './AlertDetails';

const AlertList = ({
  alerts,
  expandedAlert,
  setExpandedAlert,
  markAsRead
}) => {
  return (
    <List>
      {alerts.length > 0 ? (
        alerts.map((alert) => (
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
                        ? alert.detalles.diasRestantes <= 0 
                          ? "VENCIDO" 
                          : `${alert.detalles.diasRestantes} DÍAS`
                        : `-${alert.detalles.deficitStock} UNIDADES`}
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
                        ? `Caduca: ${new Date(alert.detalles.fechaCaducidad).toLocaleDateString()}` 
                        : `Stock actual: ${alert.detalles.stockActual}/${alert.detalles.stockMinimo}`}
                    </Typography>
                    <Box component="span" mx={1}>•</Box>
                    <Typography variant="body2" color="text.secondary">
                      {alert.detalles.puntoVenta}
                    </Typography>
                  </Box>
                }
                onClick={() => markAsRead(alert.id)}
              />
            </ListItem>
            
            {expandedAlert === alert.id && (
              <AlertDetails 
                alert={alert} 
                onClose={() => setExpandedAlert(null)}
              />
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
  );
};

export default AlertList;