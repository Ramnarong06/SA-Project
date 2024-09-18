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
import Prelogo2 from "./assets/TestLogo.png";


//
import Schedule from "./pages/schedule/create/create.tsx";
import ViewSchedule from "./pages/schedule/view/view.tsx";
import EditSchedule from "./pages/schedule/edit/edit.tsx";
//
// import PaymentList from "./pages/payments/PaymentList/PaymentList.tsx";
// import SavePayment from "./pages/payments/SavePayment/SavePayment.tsx";
// import Payment from "./pages/payments/payment/PaymentPage.tsx";
//

// storage
import CreateEq from "./pages/storage/CreateEq/CreateEq";
import EditEq from "./pages/storage/EditEq/EditEq.tsx";
import Equipments from "./pages/storage/Equipments/Equipments.tsx";  
import Requisitions from "./pages/storage/Requisitions/Requisitions.tsx";
import RequestEq from "./pages/storage/RequestEq/RequestEq.tsx";
import LittleEq from "./pages/storage/LittleEq/LittleEq.tsx";
import AddEq from "./pages/storage/AddEq/AddEq.tsx";
import Restocks from "./pages/storage/Restocks/Restocks.tsx";

// individual
import Employee  from "./pages/individual/employee/index.tsx"
import Patient  from "./pages/individual/patient/index.tsx"
import PatientCreate from "./pages/individual/patient/create"
import EmployeeCreate from "./pages/individual/employee/create"
import EmployeeEdit from "./pages/individual/employee/edit"
import PatientEdit from "./pages/individual/employee/edit"
//


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
          <Link to="/employee/create">
            เพิ่มข้อมูลพนักงาน
          </Link>
        ),
      },
      {
        key: 'patient',
        label: (
          <Link to="/patient/create">
            เพิ่มข้อมูลผู้ป่วย
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
          <Link to="/viewschedule">
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
        key: 'paymentlist',
        label: (
          <Link to="paymentlist">
            paymentlist
          </Link>
        ),
      },
      {
        key: 'savepayment',
        label: (
          <Link to="savepayment">
            savepayment
          </Link>
        ),
      },
      {
        key: 'payment',
        label: (
          <Link to="payment">
            payment
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
          <Link to="equipments">
            equipments
          </Link>
        ),
      },
      {
        key: 'Disbursement',
        label: (
          <Link to="restocks">
            restocks
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
              src={Prelogo2}
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
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/viewschedule" element={<ViewSchedule />} />
                <Route path="/editschedule/edit/:id" element={<EditSchedule />} />
                
                //
                <Route path="/CreateEq" element={<CreateEq />} />
                <Route path="/EditEq" element={<EditEq />} />
                <Route path="/Equipments" element={<Equipments />} />
                <Route path="/Requisitions" element={<Requisitions />} />
                <Route path="/LittleEq" element={<LittleEq />} />
                <Route path="/AddEq" element={<AddEq />} />
                <Route path="/RequestEq" element={<RequestEq />} />
                <Route path="/Restocks" element={<Restocks />} />
                <Route path="/AddEq/:id" element={<AddEq />} />
                <Route path="/RequestEq/:id" element={<RequestEq />} />
                <Route path="/EditEq/:id" element={<EditEq />} />
                //
                <Route path="/" element={<div>Manage Patient Records</div>} />
                <Route path="/customer" element={<div>Manage Patient Records</div>} />
                <Route path="/employee/create" element={<EmployeeCreate/>} />
                <Route path="/employee/edit/:id" element={<EmployeeEdit/>} />
                <Route path="/manage-patients" element={<div>Manage Patient Records</div>} />
                <Route path="/employees" element={<Employee />} />
                <Route path="/patients" element={<Patient/>} />
                <Route path="/patient/create" element={<PatientCreate/>} />
                <Route path="/patient/edit/:id" element={<PatientEdit/>} />
                //
                <Route path="/employee" element={<Employee />} />
                <Route path="/patient" element={<Patient />} />
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


