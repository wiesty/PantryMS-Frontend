import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import ProductModal from "./ProductModal";
import { productContext } from "../../context/productContext";
import { toast } from "react-toastify";
import productService from "../../services/productService";
import shoppingListService from "../../services/shoppingListService";

const DashboardTable = () => {
  const { products, setProducts } = useContext(productContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Type",
      dataIndex: "unit_type",
      key: "unit_type",
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (text) => new Date(text).toLocaleDateString("de-DE"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
          }}
        >
          <Button
            className="ant-btn ant-btn-primary"
            onClick={() => showDetails(record)}
          >
            Details
          </Button>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Button
            className="ant-btn ant-btn-dashed ant-btn-dangerous"
            onClick={() => deleteProduct(record.product_id)}
          >
            Delete 🗑
          </Button>
          <Button onClick={() => addProductToShoppingList(record.name)}>
            add to 🛒
          </Button>
        </span>
      ),
    },
  ];
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const showDetails = (record) => {
    Modal.info({
      title: "Product Details",
      content: (
        <div>
          <p>
            <strong>Name:</strong> {record.name}
          </p>
          <p>
            <strong>Category:</strong> {record.category}
          </p>
          <p>
            <strong>Quantity:</strong> {record.quantity}
          </p>
          <p>
            <strong>Expiration date:</strong>{" "}
            {new Date(record.expiration_date).toLocaleDateString("de-DE")}
          </p>
          <p>
            <strong>Unit type:</strong> {record.unit_type}
          </p>
          <p>
            <strong>Notification:</strong> {record.notify ? "Ja" : "Nein"}
          </p>
          {record.notification_threshold && (
            <p>
              <strong>Notification threshold:</strong>{" "}
              {record.notification_threshold}
            </p>
          )}
        </div>
      ),
    });
  };

  const showEditModal = (record) => {
    setSelectedProduct(record);
    setModalVisible(true);
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      const updatedProducts = products.filter(
        (product) => product.product_id !== productId
      );
      setProducts(updatedProducts);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Error deleting product");
    }
  };

  const addProductToShoppingList = async (productName) => {
    try {
      await shoppingListService.addShoppingListItem({
        name: productName,
        quantity: 1,
      });
      toast.success(`${productName} has been added to the shopping list`);
    } catch (error) {
      console.error("Error adding product to shopping list", error);
      toast.error(
        `Error adding ${productName} to the shopping list.`
      );
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products", error);
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // muss leer sein sonst loop, idk why

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ float: "right", marginTop: "16px", marginBottom: "16px" }}
      >
        + add product
      </Button>
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category}>
          <h2>{category}</h2>
          <Table
            key={category}
            dataSource={categoryProducts}
            columns={columns}
          />
        </div>
      ))}

      <Modal
        title={selectedProduct ? "Edit product" : "Add product"}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <ProductModal product={selectedProduct} onClose={handleModalClose} />
      </Modal>
    </div>
  );
};

export default DashboardTable;
