import React, { useContext } from 'react';
import { Card, List, Empty, Typography } from 'antd';
import { productContext } from '../../context/productContext';
import moment from 'moment';


const ExpiringSoonCard = () => {
  const { products } = useContext(productContext);
  const { Text } = Typography;

  const productsExpiringSoon = products.filter((product) => {
    const expirationDate = moment(product.expiration_date);
    const daysUntilExpiration = expirationDate.diff(moment(), 'days');
    return daysUntilExpiration > 0 && daysUntilExpiration <= 7;
  });

  return (
    <Card title="📅 Products that expire within one week." style={{ width: '100%' }}>
      {productsExpiringSoon.length > 0 ? (
        <List
          dataSource={productsExpiringSoon}
          renderItem={(product) => (
            <List.Item>
              <Text strong>
              {product.name} - {`Expires on ${moment(product.expiration_date).format('DD.MM.YYYY')}`}
              </Text>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No products expire within one week. 😊" />
      )}
    </Card>
  );
};

export default ExpiringSoonCard;
