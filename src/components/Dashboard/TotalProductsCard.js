import React, { useContext } from 'react';
import { Card, Statistic } from 'antd';
import { productContext } from '../../context/productContext';

const TotalProductsCard = () => {
  const { products } = useContext(productContext);

  const totalProducts = `🧺` + products.length;

  return (
    <Card title="Total products" style={{ width: '100%', marginBottom: 16 }}>
      <Statistic value={totalProducts} />
    </Card>
  );
};

export default TotalProductsCard;
