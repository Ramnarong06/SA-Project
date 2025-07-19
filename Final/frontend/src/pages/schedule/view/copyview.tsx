import React, { useEffect, useState } from 'react';
import { Calendar, List, Button, message } from 'antd';
import { EditOutlined, PlusOutlined, CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import './view.css';
import Schedule from "../create/create.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { GetSchedulesByDate, UpdateScheduleStatus } from "../../../services/https/schedule/index.tsx";
import new_logo from "../../../assets/stock/new_logo.png";
import check from '../../../assets/schedule/check.gif'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok'); // ตั้งค่า timezone เป็นกรุงเทพฯ

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());      // เก็บค่าวันที่เลือกใน box ปฎิทิน
  const [appointments, setAppointments] = useState<any[]>([]);                    // เก็บข้อมูลการนัดหมายของวันที่เลือก
  const [messageApi, contextHolder] = message.useMessage();
  const [UpdateId, setUpdateId] = useState<Number>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  const currentDate = dayjs().format('DD/MM/YYYY');
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
    const newDate = dayjs(date?.toDate()).add(1, 'day').tz('Asia/Bangkok').toDate(); // บวกวันที่เลือกไป 1 วัน
    //const newDate = dayjs(date?.toDate()).tz('Asia/Bangkok').startOf('day').toDate(); // ตั้งค่าให้ตรงเวลาในวันนั้น
    setSelectedDate(newDate);
  };

  const formatTel = (tel: string) => {
    if (!tel || tel.length !== 10) {
      return tel; // กรณีที่เบอร์โทรไม่ครบ 10 หลัก จะส่งคืนค่าเดิม
    }
  
    return `${tel.substring(0, 3)}-${tel.substring(3, 6)}-${tel.substring(6)}`;
  };
  
  return (
    <div>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={new_logo} alt="logo" className="logo1" />
      </div>
      <div className="schedule-header">
        <CalendarOutlined className="schedule-icon" />
        <span className="schedule-title">Schedule</span>
      </div>
      
      <div className="schedule-container">
        <div className="calendar-section">
          <Calendar fullscreen={false} onSelect={onDateChange} />
          <div className="add-button-container">
            <Link to="/viewschedule/schedulecreate">
              <button className="icon-btn add-btn">
                <div className="add-icon"></div>
                <div className="btn-txt"> Add </div>
              </button>
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
                <Button 
                  icon={<EditOutlined />} 
                  shape="circle"
                  size={"large"}
                  key="edit"
                  onClick={() => {
                    const adjustedDate = dayjs(item.Date).subtract(4, 'day').toDate(); // ลบวันออกไป 1 วัน
                    navigate(`/viewschedule/editschedule/edit/${item.ID}`, { state: { date: adjustedDate } });
                  }} 
                />,
                <Button
                  onClick={() => {
                    UpdateScheduleStatus(item.ID);
                    messageApi.open({
                      type: "success",
                      content: (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#22225E' }}>
                          <img src={`${check}?${Date.now()}`} alt="Success" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
                          <span>นัดหมายสำเร็จ</span>
                        </div>
                      ),
                      icon: ' ', // ใช้ null เพื่อลบไอคอนเริ่มต้น
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  }}
                  shape="circle"
                  icon={<CheckOutlined />}
                  size={"large"}
                />
              ]}
              style={{ borderBottom: 'none' }}
            >
              <List.Item.Meta
                title={<span style={{ color: "#22225E" }}>{item.TreatmentName}</span>}  // เปลี่ยนสีเฉพาะ title
                description={`${item.FirstName} ${item.LastName} เบอร์ ${formatTel(item.Tel)}`}  // แสดงทั้งชื่อจริงและนามสกุล
              />
            </List.Item>
            )}
            locale={{ emptyText: 'ไม่มีการนัดหมายในวันนี้' }}
          />
        </div>

        <Routes>
          <Route path="/viewschedule/schedulecreate" element={<Schedule />} />
        </Routes>
      </div>
    </div>
  );
};

export default ScheduleView;
