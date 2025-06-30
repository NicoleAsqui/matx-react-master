
import styled from "@mui/material/styles/styled";

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

export default SeverityBadge;