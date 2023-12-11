// EANModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EANModal = ({ visible, onClose, onProductSelect }) => {
  const [ean, setEAN] = useState('');
  const [loading, setLoading] = useState(false);
  const [productNames, setProductNames] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState(null);

  useEffect(() => {
    setProductNames([]);
    setSelectedProductName(null);
  }, [visible]);

  const searchProduct = async () => {
    if (!ean) {
      message.error('Please enter the EAN');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${ean}.json`);

      if (response.data.product) {
        setProductNames([response.data.product.product_name]);
      } else {
        setProductNames([]);
      }
    } catch (error) {
      console.error('Error searching product:', error);
      message.error('Error searching product');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = () => {
    if (selectedProductName) {
      onProductSelect(selectedProductName, true);
      onClose();
    }
  };

  return (
    <Modal
      title="EAN Eingabe"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="search" type="primary" loading={loading} onClick={searchProduct}>
          Search
        </Button>,
        <Button
          key="addManually"
          type="primary"
          disabled={!productNames.length}
          onClick={handleProductSelect}
        >
          {productNames.length ? 'Enter Quantity' : 'Add manually'}
        </Button>,
      ]}
    >
      <Input
        placeholder="EAN eingeben"
        value={ean}
        onChange={(e) => setEAN(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      {productNames.length > 0 && (
        <Select
          placeholder="Produkt auswählen"
          value={selectedProductName}
          onChange={(value) => setSelectedProductName(value, true)}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          {productNames.map((productName) => (
            <Option key={productName} value={productName}>
              {productName}
            </Option>
          ))}
        </Select>
      )}
    </Modal>
  );
};

export default EANModal;
