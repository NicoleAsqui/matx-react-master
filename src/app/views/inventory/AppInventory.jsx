import { Box, styled } from "@mui/material";
import InventoryTable from "../../components/inventory/InventoryTable";
import { Breadcrumb, SimpleCard } from "app/components";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

const AppInventory = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[
          { name: "Inventario", path: "/inventory" }, 
          { name: "Gestión" }
        ]} />
      </Box>

      <SimpleCard title="Inventario de Productos">
        <InventoryTable />
      </SimpleCard>
    </Container>
  );
};

export default AppInventory;