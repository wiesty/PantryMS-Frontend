// App.js
import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProductProvider } from './context/productContext';
import { ShoppingListProvider } from './context/shoppingListContext';
import DashboardPage from './pages/DashboardPage';
import ShoppingListPage from './pages/ShoppingListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageMenu from './components/PageMenu';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ProductProvider>
      <ShoppingListProvider>
        <Router>
          <Layout>
            <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <PageMenu />
            </Header>
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 280, borderRadius: 10 }}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/shopping-list" element={<ShoppingListPage />} />
                </Routes>
              </div>
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            🧺 PantryMS v.1.0.9 by Wiesty
            </Footer>
          </Layout>
        </Router>
      </ShoppingListProvider>
    </ProductProvider>
  );
}

export default App;
