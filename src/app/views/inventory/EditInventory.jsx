import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import ProductForm from '../../components/inventory/ProductForm';
import inventoryService from '../../services/inventoryService';

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await inventoryService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error(`Error loading product ${id}:`, error);
        navigate('/inventory');
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await inventoryService.update(id, formData);
      navigate('/inventory');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!product) return <div>Cargando...</div>;

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Editar Producto
        </Typography>
        <ProductForm 
          product={product} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/inventory')} 
          isEditing 
        />
      </Box>
    </Container>
  );
};

export default EditInventory;