import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

import { Span } from "./Typography";
import useSettings from "app/hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px 20px 29px"
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: ".5rem",
  display: mode === "compact" ? "none" : "block"
}));

export default function Brand() {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <StyledSpan mode={mode} className="sidenavHoverShow">
          QuickLook
        </StyledSpan>
      </Box>
    </BrandRoot>
  );
}
