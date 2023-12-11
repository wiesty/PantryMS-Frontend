// components/ShoppingList/ShoppingListTable.js
import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import ShoppingListItemModal from './ShoppingListItemModal';
import { shoppingListContext } from '../../context/shoppingListContext';
import { toast } from 'react-toastify';
import shoppingListService from '../../services/shoppingListService';

const ShoppingListTable = () => {
  const { items, setItems } = useContext(shoppingListContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Button className="ant-btn ant-btn-dashed ant-btn-dangerous" onClick={() => deleteItem(record.item_id)}>Delete</Button>
        </span>
      ),
    },
  ];

  const showEditModal = (record) => {
    setSelectedItem(record);
    setModalVisible(true);
  };

  const deleteItem = async (itemId) => {
    try {
      await shoppingListService.deleteShoppingListItem(itemId);
      const updatedItems = items.filter((item) => item.item_id !== itemId);
      setItems(updatedItems);
      toast.success('item deleted successfully');
    } catch (error) {
      console.error('Error deleting shopping list item', error);
      toast.error('Error deleting item');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
    fetchItems();
  };

  const fetchItems = async () => {
    try {
      const fetchedItems = await shoppingListService.getAllShoppingListItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching shopping list items', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []); // muss leer sein sonst loop

  return (
      <div>
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          style={{ float: 'right', marginTop: '16px', marginBottom: '16px' }}
        >
          + Add item
        </Button>
        <Table dataSource={items} columns={columns} />

        <Modal
          title={selectedItem ? 'Edit Item' : 'Add Item'}
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <ShoppingListItemModal item={selectedItem} onClose={handleModalClose} />
        </Modal>
      </div>
  );
};

export default ShoppingListTable;
