import { Box, styled } from "@mui/material";
import InventoryTable from "./Inventory";
import { Breadcrumb, SimpleCard } from "app/components";


// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function AppInventory() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Table" }]} />
      </Box>

      <SimpleCard title="Inventario de Productos ">
        <InventoryTable />
      </SimpleCard>
    </Container>
  );
}
