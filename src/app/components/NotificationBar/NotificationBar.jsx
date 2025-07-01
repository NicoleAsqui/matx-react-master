import { Fragment, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import styled from "@mui/material/styles/styled";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClearIcon from "@mui/icons-material/Clear";

import useSettings from "app/hooks/useSettings";
import NotificationContext from "app/contexts/NotificationContext";
import { getTimeDifference } from "app/utils/utils.js";
import { sideNavWidth, topBarHeight } from "app/utils/constant";
import { Paragraph, Small } from "../Typography";

const Notification = styled("div")(() => ({
  padding: "16px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  height: topBarHeight,
  boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
  "& h5": {
    marginLeft: "8px",
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "500",
  },
}));

const NotificationCard = styled(Box)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    "& .messageTime": { display: "none" },
    "& .deleteButton": { opacity: "1" },
  },
  "& .messageTime": { color: theme.palette.text.secondary },
  "& .icon": { fontSize: "1.25rem" },
}));

const DeleteButton = styled(IconButton)(() => ({
  opacity: "0",
  position: "absolute",
  right: 5,
  marginTop: 9,
  marginRight: "24px",
  background: "rgba(0, 0, 0, 0.01)",
}));

const CardLeftContent = styled("div")(({ theme }) => ({
  padding: "12px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "rgba(0, 0, 0, 0.01)",
  "& small": {
    fontWeight: "500",
    marginLeft: "16px",
    color: theme.palette.text.secondary,
  },
}));

const Heading = styled("span")(({ theme }) => ({
  fontWeight: "500",
  marginLeft: "16px",
  color: theme.palette.text.secondary,
}));

export default function NotificationBar({ container }) {
  const { settings } = useSettings();
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  const { notifications, deleteNotification } = useContext(NotificationContext);

  const handleDrawerToggle = () => setPanelOpen((prev) => !prev);

  // Mostrar solo las 5 alertas más recientes
  const latestNotifications = notifications?.slice(0, 5) || [];

  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle} aria-label="show notifications">
        <Badge color="secondary" badgeContent={notifications?.length || 0}>
          <NotificationsIcon sx={{ color: "text.primary" }} />
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          container={container}
          variant="temporary"
          anchor="right"
          open={panelOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: sideNavWidth } }}
        >
          <Box>
            <Notification>
              <NotificationsIcon color="primary" />
              <h5>Notificaciones</h5>
            </Notification>

            {latestNotifications.length > 0 ? (
              latestNotifications.map((notification) => (
                <NotificationCard key={notification.id}>
                  <DeleteButton
                    size="small"
                    className="deleteButton"
                    onClick={() => deleteNotification(notification.id)}
                    aria-label="delete notification"
                  >
                    <ClearIcon className="icon" />
                  </DeleteButton>

                  <Link
                    to={`/alerts/${notification.id}`}
                    onClick={handleDrawerToggle}
                    style={{ textDecoration: "none" }}
                  >
                    <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                      <CardLeftContent>
                        <Box display="flex" alignItems="center">
                          <Icon className="icon" color="primary">
                            notifications
                          </Icon>
                          <Heading>{notification.titulo || "Alerta"}</Heading>
                        </Box>

                        <Small className="messageTime">
                          {getTimeDifference(new Date(notification.timestamp))} ago
                        </Small>
                      </CardLeftContent>

                      <Box px={2} pt={1} pb={2}>
                        <Paragraph m={0}>{notification.descripcion}</Paragraph>
                        <Small color="text.secondary">
                          {`Tipo: ${notification.tipo}, Severidad: ${notification.severidad}`}
                        </Small>
                      </Box>
                    </Card>
                  </Link>
                </NotificationCard>
              ))
            ) : (
              <Box px={2} py={2}>
                <Paragraph>No hay notificaciones recientes.</Paragraph>
              </Box>
            )}

            {notifications?.length > 0 && (
              <Box px={2} pb={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    handleDrawerToggle();
                    navigate("/alerts");
                  }}
                >
                  Ver todas
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
}
