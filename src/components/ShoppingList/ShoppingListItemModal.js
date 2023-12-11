// components/ShoppingList/ShoppingListItemModal.js
import React, { useContext, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { toast } from 'react-toastify';
import { shoppingListContext } from '../../context/shoppingListContext';

const ShoppingListItemModal = ({ item, onClose }) => {
  const { addItem, editItem } = useContext(shoppingListContext);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();

    if (item) {
      form.setFieldsValue({
        name: item.name,
        quantity: item.quantity,
      });
    }
  }, [form, item]);

  const onFinish = async (values) => {
    const itemData = {
      name: values.name,
      quantity: values.quantity,
    };

    try {
      if (item) {
        await editItem(item.item_id, itemData);
        toast.success('Element updated successfully');
      } else {
        await addItem(itemData);
        toast.success('Element added successfully');
      }

      onClose();
    } catch (error) {
      console.error('Error submitting form', error);
        toast.error('Error submitting form');
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: 'Please enter the quantity' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {item ? 'Update Item' : 'Add Item'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default ShoppingListItemModal;
