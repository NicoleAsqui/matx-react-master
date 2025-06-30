import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import ProductForm from '../../components/inventory/ProductForm';
import inventoryService from '../../services/inventoryService';

const NewInventory = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await inventoryService.create(formData);
      navigate('/inventory');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Nuevo Producto
        </Typography>
        <ProductForm 
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/inventory')} 
        />
      </Box>
    </Container>
  );
};

export default NewInventory;