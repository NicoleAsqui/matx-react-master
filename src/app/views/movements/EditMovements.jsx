import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField, Button, MenuItem, Grid, Typography, Container, Box
} from "@mui/material";
import movementsService from "../../services/movementsService";

const EditMovements = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchMovement = async () => {
      try {
        const data = await movementsService.getById(id);
        setFormData(data);
      } catch (err) {
        console.error("Error al cargar movimiento:", err);
      }
    };
    fetchMovement();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const total = formData.cantidad * formData.costoUnitario;
    const dataToSend = { ...formData, costoTotal: total };
    try {
      await movementsService.update(id, dataToSend);
      navigate("/movements");
    } catch (err) {
      console.error("Error al actualizar movimiento:", err);
    }
  };

  const handleCancel = () => {
    navigate("/movements");
  };

  if (!formData) return <p>Cargando...</p>;

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Editar Movimiento
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
              Actualizar
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EditMovements;
