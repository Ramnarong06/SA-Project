import React, { useState } from "react";
import { 
UserOutlined,
DashboardOutlined, 
CalendarOutlined,
AppstoreOutlined,
ContainerOutlined,
DesktopOutlined,
MailOutlined,
MenuFoldOutlined,
MenuUnfoldOutlined,
PieChartOutlined,
DollarOutlined,
HomeOutlined,
ProductOutlined,
HeartOutlined } from "@ant-design/icons";

import type { MenuProps } from "antd";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  
} from "react-router-dom";

import { Breadcrumb, Layout, Menu, theme,Button } from "antd";
//import logo from "./assets/logo.png";
import logo2 from "./assets/TestLogo.png";

import Dashboard from "./pages/dashboard";
import Customer from "./pages/customer";
import Test from "./pages/Test";
import Storage from "./pages/storage/AddEq";
import Schedule from "./pages/schedule/create.tsx";
import Payment from "./pages/payment/PaymentPage.tsx";
import CustomerCreate from "./pages/customer/create";
import CustomerEdit from "./pages/customer/edit";

const { Header, Content, Footer, Sider } = Layout;



function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [

  // ระบบของพี่
  {
    key: 'old',
    label: 'ของพี่',
    icon: <HomeOutlined />,
    children: [
      {
        key: 'dashboard',
        label: (
          <Link to="/">
            dashboard
          </Link>
        ),
      },
      {
        key: 'customer',
        label: (
          <Link to="/customer">
            ข้อมูลสมาชิก
          </Link>
        ),
      },
      
    ],
  },

  // ระบบจัดการประวัติ
  {
    key: 'register',
    label: 'ทะเบียน',
    icon: <UserOutlined />,
    children: [
      {
        key: 'employee',
        label: (
          <Link to="/test">
            พนักงาน
          </Link>
        ),
      },
      {
        key: 'patient',
        label: (
          <Link to="002">
            ผู้ป่วย
          </Link>
        ),
      },
      
    ],
  },
  //  ระบบดูแลการนัดหมาย
  {
    key: 'Schedule',
    label: 'นัดหมาย',
    icon: <CalendarOutlined />,
    children: [
      {
        key: 'Schedule',
        label: (
          <Link to="003">
            กำหนดการ
          </Link>
        ),
      },
      {
        key: 'CreateSchedule',
        label: (
          <Link to="/schedule">
            สร้างการนัดหมาย
          </Link>
        ),
      },
    ],
  },


  // ระบบการชำระเงิน
  {
    key: 'finance',
    label: 'การเงิน',
    icon: <DollarOutlined />,
    children: [
      {
        key: 'payment',
        label: (
          <Link to="/payment">
            ชำระเงิน
          </Link>
        ),
      },
      {
        key: 'savepayment',
        label: (
          <Link to="006">
            บันทึกการชำระ
          </Link>
        ),
      },
    ],
  },

  // ระบบจัดการคลังวัสดุอุปกรณ์
  {
    key: 'storage',
    label: 'คลังวัสดุ',
    icon: <ProductOutlined />,
    children: [
      {
        key: 'equipment',
        label: (
          <Link to="/storage">
            อุปกรณ์
          </Link>
        ),
      },
      {
        key: 'Disbursement',
        label: (
          <Link to="008">
            รายการเบิก
          </Link>
        ),
      },
    ],
  },



  {
    key: 'treatment',
    label: 'การรักษา',
    icon: <HeartOutlined />,
    children: [
      {
        key: 'Addtreatment',
        label: (
          <Link to="009">
            เพิ่มการรักษา
          </Link>
        ),
      },
      {
        key: 'Savetreatment',
        label: (
          <Link to="010">
            บันทึกการรักษา
          </Link>
        ),
      },
    ],
  },


  // {
  //   key: 'sub2',
  //   label: 'Navigation Two',
  //   icon: <AppstoreOutlined />,
  //   children: [
  //     { key: '9', label: 'Option 9' },
  //     { key: '10', label: 'Option 10' },
  //     {
  //       key: 'sub3',
  //       label: 'Submenu',
  //       children: [
  //         { key: '11', label: 'Option 11' },
  //         { key: '12', label: 'Option 12' },
  //       ],
  //     },
  //   ],
  // },
];


const App: React.FC = () => {
  const page = localStorage.getItem("page");
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };


  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            background: "linear-gradient(180deg, #22225E 0%, #22225E 20%, #7DC9D1 80%, #42C2C2 100%)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <img
              src={logo2}
              alt="Logo"
              style={{ width: "60%"}}
            />
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={[page ? page : "dashboard"]}
            mode="inline"
            style={{
              background: "transparent",
            }}
          >
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
              style={{
                background: "transparent",
              }}
            />
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }} />
            <div
              style={{
                padding: 24,
                minHeight: "100%",
                background: colorBgContainer,
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/customer/create" element={<CustomerCreate />} />
                <Route path="/customer/edit/:id" element={<CustomerEdit />} />
                <Route path="/test" element={<Test />} />
                <Route path="/storage" element={<Storage />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/schedule" element={<Schedule />} />
              </Routes>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>
            System Analysis and Design 1/67
          </Footer> */}
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;

// function setCurrentPage(arg0: string): void {
//   throw new Error("Function not implemented.");
// }
