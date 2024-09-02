import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd'; // นำเข้าส่วนประกอบที่จำเป็นจาก Ant Design
import { ClockCircleOutlined } from '@ant-design/icons'; // นำเข้าไอคอนนาฬิกาจาก Ant Design
import './create.css'; // นำเข้าไฟล์ CSS
import Schedule from "../../pages/schedule/create.tsx";
import Schedule2 from "../../pages/schedule/view.tsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    
  } from "react-router-dom";

const App: React.FC = () => {
  const [form] = Form.useForm(); // สร้าง form instance สำหรับการจัดการฟอร์ม

  // ฟังก์ชันที่จะทำงานเมื่อฟอร์มถูกส่งและข้อมูลถูกต้อง
  const onFinish = (values: any) => {
    console.log('Success:', values); // แสดงค่าที่กรอกในฟอร์มบน console
  };

  // ฟังก์ชันที่จะทำงานเมื่อฟอร์มถูกส่งแต่มีข้อผิดพลาด
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo); // แสดงข้อผิดพลาดบน console
  };

  return (
    <div className="appointment-form">
      {/* แสดงโลโก้ของคลินิก */}
      {/* <img src="logo.png" alt="logo" className="logo" /> */}

      {/* หัวข้อของหน้า */}
      <div className="header">
        <ClockCircleOutlined className="icon" /> {/* แสดงไอคอนนาฬิกา */}
        <h2>นัดหมายผู้ป่วยใน</h2> {/* แสดงหัวข้อของฟอร์ม */}
      </div>

      {/* ฟอร์มการนัดหมาย */}
      <Form
        form={form} // เชื่อมฟอร์มกับ form instance ที่สร้างขึ้น
        name="appointment" // ตั้งชื่อฟอร์มเพื่อการอ้างอิงภายหลัง
        layout="vertical" // จัดเรียงฟอร์มในแนวตั้ง
        onFinish={onFinish} // ฟังก์ชันที่จะทำงานเมื่อฟอร์มถูกส่งและข้อมูลถูกต้อง
        onFinishFailed={onFinishFailed} // ฟังก์ชันที่จะทำงานเมื่อฟอร์มถูกส่งแต่มีข้อผิดพลาด
      >
        {/* แบ่งฟิลด์ฟอร์มออกเป็นสองคอลัมน์ */}
        <div className="form-row">
          {/* ฟิลด์สำหรับกรอกชื่อจริง */}
          <Form.Item
            label="ชื่อจริง"
            name="firstName"
            rules={[{ required: true, message: 'กรุณากรอกชื่อจริง!' }]}
          >
            <Input placeholder="ชื่อจริง" /> {/* ฟิลด์กรอกชื่อจริง */}
          </Form.Item>

          {/* ฟิลด์สำหรับกรอกนามสกุล */}
          <Form.Item
            label="นามสกุล"
            name="lastName"
            rules={[{ required: true, message: 'กรุณากรอกนามสกุล!' }]}
          >
            <Input placeholder="นามสกุล" /> {/* ฟิลด์กรอกนามสกุล */}
          </Form.Item>
        </div>

        <div className="form-row">
          {/* ฟิลด์สำหรับกรอกการรักษา */}
          <Form.Item
            label="การรักษา"
            name="treatment"
            rules={[{ required: true, message: 'กรุณากรอกการรักษา!' }]}
          >
            <Input placeholder="การรักษา" /> {/* ฟิลด์กรอกการรักษา */}
          </Form.Item>

          {/* ฟิลด์สำหรับเลือกวันนัดหมาย */}
          <Form.Item
            label="วันนัดหมาย"
            name="appointmentDate"
            rules={[{ required: true, message: 'กรุณาเลือกวันนัดหมาย!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%',padding: '8px'}} /> {/* ฟิลด์เลือกวันนัดหมาย */}
          </Form.Item>
        </div>

        {/* ลิงก์สำหรับผู้ป่วยนอก */}
        <div className="patient-status">
          <a href="#">สำหรับผู้ป่วยนอก</a> {/* แสดงลิงก์สำหรับผู้ป่วยนอก */}
        </div>

        {/* ปุ่มยืนยันและยกเลิก */}
        <Form.Item>
            <Link to="/schedule2">
            <div className="form-actions">
                <Button type="primary" htmlType="submit" className="submit-button">
                  ยืนยัน
                </Button>
                
                <Button htmlType="button" className="cancel-button">
                    ยกเลิก
                </Button>
            </div>
            </Link>
            <Routes>
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/schedule2" element={<Schedule2 />} />
            </Routes>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App; // ส่งออกคอมโพเนนต์ App เพื่อให้สามารถใช้งานในที่อื่นได้
