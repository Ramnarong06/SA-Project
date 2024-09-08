import React, { useEffect, useState } from 'react';
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
import { GetSchedulesByDate, UpdateScheduleStatus } from '../../services/https/index.tsx';


const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isChecked, setIsChecked] = useState(true);
  const [notChecked, setnotChecked] = useState(false);
  

  const handleChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(e.target.checked);
  };

  const fetchAppointments = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];  // แปลงวันที่เป็น YYYY-MM-DD
    const data = await GetSchedulesByDate(formattedDate);     // เรียก API
    if (data && data.length > 0) {
      setAppointments(data);  // อัปเดตข้อมูลนัดหมาย
    } else {
      setAppointments([]);    // ถ้าไม่มีข้อมูลนัดหมาย ให้ล้าง appointments
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  

  const onDateChange = (date: any) => {
    setSelectedDate(date?.toDate());
  };

  return (
    <div>
      <div className="schedule-header">
        <CalendarOutlined className="schedule-icon" />
        <span className="schedule-title">Schedule</span>
      </div>

      <div className="schedule-container">
        <div className="calendar-section">
          <Calendar fullscreen={false} onSelect={onDateChange} />
          <div className="add-button-container">
            <Link to="/schedule">
              <Button className="add-button" type="primary" shape="circle" icon={<PlusOutlined />} />
            </Link>
          </div>
        </div>

        <div className="appointments-section">
          <List
            itemLayout="horizontal"
            dataSource={appointments}
            
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button icon={<EditOutlined />} key="edit" />,
                  <Checkbox key="status" checked={notChecked} onChange={handleChange} />  
                ]}
              >
                <List.Item.Meta
                  title={item.TreatmentName}
                  description={`${item.FirstName} ${item.LastName}`}  // แสดงทั้งชื่อจริงและนามสกุล
                />
              </List.Item>
            )}
            locale={{ emptyText: 'ไม่มีการนัดหมายในวันนี้' }}  // ข้อความเมื่อไม่มีนัดหมาย
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