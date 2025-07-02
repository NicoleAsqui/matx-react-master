import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, MenuItem, Grid, Typography, Container, Box
} from "@mui/material";
import movementsService from "../../services/movementsService";

const NewMovements = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    producto: "",
    tipo: "egreso",
    categoria: "",
    cantidad: 1,
    costoUnitario: 0,
    puntoVenta: "",
    responsable: "",
    cliente: "",
    motivo: "",
    aprobadoPor: ""
  });


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const total = formData.cantidad * formData.costoUnitario;
    const dataToSend = { ...formData, costoTotal: total };
    try {
      await movementsService.create(dataToSend);
      navigate("/movements");
    } catch (err) {
      console.error("Error al crear movimiento:", err);
    }
  };

  const handleCancel = () => {
    navigate("/movements");
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Nuevo Movimiento
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Producto" name="producto" value={formData.producto} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} required>
                <MenuItem value="egreso">Egreso</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Cantidad" name="cantidad" type="number" value={formData.cantidad} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Costo Unitario" name="costoUnitario" type="number" value={formData.costoUnitario} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Punto de Venta" name="puntoVenta" value={formData.puntoVenta} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Responsable" name="responsable" value={formData.responsable} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Cliente" name="cliente" value={formData.cliente} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Motivo" name="motivo" value={formData.motivo} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Aprobado Por" name="aprobadoPor" value={formData.aprobadoPor} onChange={handleChange} />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default NewMovements;
