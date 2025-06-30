import {
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const AlertIcon = ({ tipo }) => {
  const iconProps = { fontSize: "small" };
  
  return tipo === "caducidad" ? (
    <ScheduleIcon {...iconProps} color="error" />
  ) : (
    <InventoryIcon {...iconProps} color="warning" />
  );
};

export default AlertIcon;