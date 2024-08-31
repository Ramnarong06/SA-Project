import React, { useState } from 'react';
import { Calendar, List, Button, Checkbox } from 'antd';
import { EditOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import './view.css';
import Schedule from "../../pages/schedule/create.tsx";
import Schedule2 from "../../pages/schedule/view.tsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    
  } from "react-router-dom";


const ScheduleView: React.FC = () => {
  // สร้าง state สำหรับเก็บวันที่ที่ผู้ใช้เลือก
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // ตัวอย่างข้อมูลการนัดหมาย สามารถปรับหรือเชื่อมโยงกับฐานข้อมูลได้ตามความต้องการ
  const appointments = [
    { name: 'ขูดหินปูน', doctor: 'นายแพทย์ ธนกร' },
    { name: 'ขูดหินปูน', doctor: 'นายแพทย์ นันทเดช' },
    { name: 'อุดฟัน', doctor: 'นายแพทย์ ธีรธรรม' },
    { name: 'อุดฟัน', doctor: 'นายแพทย์ ศิริพจน์' },
    { name: 'ขูดหินปูน', doctor: 'นายแพทย์ สุรพงษ์' },
    { name: 'ขูดหินปูน', doctor: 'นายแพทย์ ธนา' },
    { name: 'อุดฟัน', doctor: 'นายแพทย์ สมชาย' },
    { name: 'ขูดหินปูน', doctor: 'นายแพทย์ วิชัย' },
    { name: 'ขูดหินปูน', doctor: 'นายแพทย์ วิโรจน์' },
    { name: 'อุดฟัน', doctor: 'นายแพทย์ สุชาติ' },
  ];

  // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกวันที่จากปฏิทิน
  const onDateChange = (date: any) => {
    setSelectedDate(date); // อัปเดตวันที่ที่เลือก
  };

  return (
    <div>
      {/* ส่วนของหัวข้อ "Schedule" ที่มีไอคอน อยู่นอกสี่เหลี่ยมสีเทา */}
      <div className="schedule-header">
        <CalendarOutlined className="schedule-icon" /> {/* ไอคอนปฏิทิน */}
        <span className="schedule-title">Schedule</span> {/* ข้อความหัวข้อ */}
      </div>

      {/* คอนเทนเนอร์หลักที่ครอบคลุมทั้งปฏิทินและรายการนัดหมาย */}
      <div className="schedule-container">
        {/* ส่วนของปฏิทิน */}
        <div className="calendar-section">
            <Calendar fullscreen={false} onSelect={onDateChange} /> {/* ปฏิทินที่ไม่เต็มหน้าจอ */}
            <div className="add-button-container">
            <Link to="/schedule"><Button className="add-button" type="primary" shape="circle" icon={<PlusOutlined />} /></Link>
            </div>
        </div>
        
        {/* ส่วนของรายการนัดหมาย */}
        <div className="appointments-section">
          <List
            itemLayout="horizontal"  // จัดรูปแบบรายการเป็นแนวนอน
            dataSource={appointments}  // ข้อมูลรายการนัดหมาย
            renderItem={(item) => (
              <List.Item
                actions={[
                  // ปุ่มแก้ไขรายการนัดหมาย
                  <Button icon={<EditOutlined />} key="edit" />,
                  // ช่องทำเครื่องหมายสถานะ
                  <Checkbox key="status" />
                ]}
              >
                <List.Item.Meta
                  title={item.name}  // ชื่อรายการนัดหมาย
                  description={item.doctor}  // ชื่อแพทย์ผู้ดูแล
                />
              </List.Item>
            )}
          />
        </div>
        <Routes>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule2" element={<Schedule2 />} />
        </Routes>
      </div>
    </div>
  );
};

export default ScheduleView;
