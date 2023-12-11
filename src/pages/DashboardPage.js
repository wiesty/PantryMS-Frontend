import React from 'react';
import { Row, Col } from 'antd';
import DashboardTable from '../components/Dashboard/DashboardTable';
import TotalProductsCard from '../components/Dashboard/TotalProductsCard';
import ExpiringSoonCard from '../components/Dashboard/ExpiringSoonCard';

const DashboardPage = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ marginRight: 16 }}>
              <img src="/pantrymtransparent.png" alt="PantryMS" style={{ maxWidth: 75 }} />
            </div>
            <div>
              <h1>PantryMS</h1>
            </div>
          </div>
          <TotalProductsCard />
        </Col>
        <Col span={12}>
          <ExpiringSoonCard />
        </Col>
      </Row>
      <DashboardTable />
    </div>
  );
};

export default DashboardPage;
