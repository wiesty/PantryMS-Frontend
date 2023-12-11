import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Switch,
  AutoComplete,
  Col,
  Row,
} from "antd";
import { toast } from "react-toastify";
import { productContext } from "../../context/productContext";
import moment from "moment";
import axios from "axios";
import { debounce } from "lodash";

const { Option } = Select;

const categories = [
  "Fruits and Vegetables 🥦",
  "Dairy 🥛",
  "Meat and Sausages 🥩",
  "Ready Meals 🍱",
  "Sweets 🍬",
  "Ingredients 🥣",
  "Spices 🧂",
  "Leftovers 🥡",
  "Sauces 🍯",
  "Spread 🍓",
  "Beverages 🥤",
  "Eggs 🥚",
  "Freezer 🧊",
  "Fish 🐟",
  "Miscellaneous 🧺",
];

const ProductModal = ({ product, onClose }) => {
  const { addProduct, editProduct } = useContext(productContext);
  const [form] = Form.useForm();
  const [notifySwitch, setNotifySwitch] = useState(false);
  const [productNames, setProductNames] = useState([]);

  useEffect(() => {
    form.resetFields();

    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        expiration_date: moment(product.expiration_date),
        unit_type: product.unit_type,
        notify: product.notify,
        notification_threshold: product.notification_threshold,
      });
      setNotifySwitch(product.notify);
    } else {
      form.setFieldsValue({
        notify: false,
        notification_threshold: "not_set",
      });
      setNotifySwitch(false);
    }
  }, [form, product]);

  const onFinish = async (values) => {
    const formData = {
      name: values.name,
      category: values.category,
      quantity: values.quantity,
      expiration_date: values.expiration_date.format("YYYY-MM-DD"),
      unit_type: values.unit_type,
      notify: values.notify,
      notification_threshold: values.notification_threshold || "not_set",
    };

    try {
      if (product) {
        await editProduct(product.product_id, formData);
        form.resetFields();
        form.setFieldsValue({
          notify: false,
          notification_threshold: "not_set",
        });
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData);
        toast.success("Product added successfully");
      }

      onClose();
      form.resetFields();
      form.setFieldsValue({
        notify: false,
        notification_threshold: "not_set",
      });
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Error while submitting");
    }
  };

  const onSwitchChange = (checked) => {
    setNotifySwitch(checked);
  };

  const searchProduct = async (value) => {
    if (!value) {
      return;
    }

    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v2/product/${value}.json`
      );

      if (response.data.product) {
        setProductNames([response.data.product.product_name]);
      } else {
        setProductNames([]);
      }
    } catch (error) {
      console.error("Error searching product:", error);
      toast.error("No product found");
    } finally {
    }
  };

  const handleQuantityChange = (amount) => {
    const currentQuantity = parseFloat(form.getFieldValue("quantity"));
    let unitType = form.getFieldValue("unit_type");
  
    let updatedQuantity;
  
    switch (unitType) {
      case "Piece":
        updatedQuantity = currentQuantity + amount;
        break;
      case "Gram":
      case "Milliliter":
        updatedQuantity = currentQuantity + 50 * amount;
        break;
      case "Kilogram":
        updatedQuantity = currentQuantity * 1000 + 50 * amount;
        unitType = "Gram";
        break;
      case "Liter":
        updatedQuantity = currentQuantity * 1000 + 50 * amount;
        unitType = "Milliliter";
        break;
      default:
        updatedQuantity = currentQuantity;
    }
  
    form.setFieldsValue({ quantity: updatedQuantity.toString(), unit_type: unitType });
  };


  const debouncedSearchProduct = debounce(searchProduct, 750);

  const onAutoCompleteChange = (value) => {
    debouncedSearchProduct(value);
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <AutoComplete
          onSearch={onAutoCompleteChange}
          onSelect={(value) => form.setFieldsValue({ name: value })}
          placeholder="Enter EAN or product name"
        >
          {productNames.map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </AutoComplete>
      </Form.Item>
      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: "Please choose a category" }]}
      >
        <Select placeholder="Select a category">
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Expiration Date"
        name="expiration_date"
        rules={[
          { required: true, message: "Please provide an expiration date" },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please enter the quantity" }]}
      >
        <Input placeholder="Product quantity" />
      </Form.Item>
      <Form.Item
        label="Unit"
        name="unit_type"
        rules={[{ required: true, message: "Please choose a unit" }]}
      >
        <Select placeholder="Select a unit">
          <Option value="Piece">Piece</Option>
          <Option value="Gram">Gram</Option>
          <Option value="Kilogram">Kilogram</Option>
          <Option value="Milliliter">Milliliter</Option>
          <Option value="Liter">Liter</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Notification" name="notify" valuePropName="checked">
        <Switch onChange={onSwitchChange} defaultChecked={false} />
      </Form.Item>
      <Form.Item
        label="Notification Threshold"
        name="notification_threshold"
      >
        <Input value={"not_set"} disabled={!notifySwitch} />
      </Form.Item>
      <Form.Item>
        {product && (
          <Row justify="center" style={{ marginBottom: "15px" }}>
            <Col span={8}>
              <Button onClick={() => handleQuantityChange(1)}>
                + Add Quantity
              </Button>
            </Col>
            <Col span={8}>
              <Button onClick={() => handleQuantityChange(-1)}>
                - Reduce Quantity
              </Button>
            </Col>
          </Row>
        )}
        <Row justify="center">
          <Col span={8}>
            <Button type="primary" htmlType="submit">
              {product ? "Update Product" : "Add Product"}
            </Button>
          </Col>
        </Row>
        <Row justify="end">
          <Col span={4}>
            <Button onClick={onClose}>Cancel</Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
  };
  
  export default ProductModal;
  