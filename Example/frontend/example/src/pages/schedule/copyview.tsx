import React, { useEffect, useState } from 'react';
import { Calendar, List, Button, message } from 'antd';
import { EditOutlined, PlusOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import './view.css';
import Schedule from "../../pages/schedule/create.tsx";
import Schedule2 from "../../pages/schedule/view.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { GetSchedulesByDate, UpdateSchedule, UpdateScheduleStatus } from '../../services/https/index.tsx';
import { SchedulesInterface } from '../../interfaces/ISchedule.ts';
import UpSchedule from "../schedule/update/update.css";

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  //
  const [UpdateId, setUpdateId] = useState<Number>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  //
  const navigate = useNavigate();

  const fetchAppointments = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];  // แปลงวันที่เป็น YYYY-MM-DD
    const data = await GetSchedulesByDate(formattedDate);     // เรียก API
    console.log(data)
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

  //ฟังก์ชันอัปเดตสถานะ
  // const handleStatusUpdate = async (ID: number) => {
  //   const result = await UpdateScheduleStatus(ID, 2); // เปลี่ยนสถานะเป็น 2
  //   if (result) {
  //     messageApi.open({
  //       type: "success",
  //       content: "Status updated successfully",
  //     });
  //     // อัปเดตตารางใหม่หลังจากเปลี่ยนสถานะสำเร็จ
  //     if (selectedDate) {
  //       fetchAppointments(selectedDate);
  //     }
  //   } else {
  //     messageApi.open({
  //       type: "error",
  //       content: "Failed to update status",
  //     });
  //   }
  // };

  

  const Finish = async (values: SchedulesInterface) => {
    let res = await UpdateSchedule(values); // ส่งค่า values ที่แก้ไขแล้ว
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(function () {
        navigate("/schedule");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
    }
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
            renderItem={(item,record) => (
              
              <List.Item
                actions={[
                  <Button 
                    icon={<EditOutlined />} 
                    key="edit"
                    onClick={() => navigate(`/editschedule/edit/${item.ID}`)} 
                  />,
                  <Button
                    onClick={() => {
                      UpdateScheduleStatus(item.ID);
                      setTimeout(() => {
                        window.location.reload(); 
                      }, 200);
                    }}
                    style={{ marginLeft: 10 }}
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size={"large"}
                    danger
                  />
                  
                ]}
              >
                
                <List.Item.Meta
                  title={item.TreatmentName}
                  description={`${item.FirstName} ${item.LastName}`}  // แสดงทั้งชื่อจริงและนามสกุล
                />
              <p>{item.id}</p>
              </List.Item>
            )}
            locale={{ emptyText: 'ไม่มีการนัดหมายในวันนี้' }}
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