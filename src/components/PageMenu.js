import React, { useState } from 'react';
import { Menu } from 'antd';
const items = [
  {
    label: (
      <a href="/">
        📊Dashboard
      </a>
    ),
    key: 'dashboard',
  },
  {
    label: (
      <a href="/shopping-list">
        🛒 Shoppinglist
      </a>
    ),
    key: 'shopping-list',
  },
];
const PageMenu = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default PageMenu;