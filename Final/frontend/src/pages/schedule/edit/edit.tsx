import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TreatmentsInterface } from "../../../interfaces/ITreatment";
import { SchedulesInterface } from "../../../interfaces/ISchedule";
import { GetTreatment, UpdateSchedule, GetScheduleById } from "../../../services/https";
import dayjs from "dayjs";
import ViewSchedule from "../view/view.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate,useParams } from "react-router-dom";


const { Option } = Select;

function ScheduleEdit() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [schedule, setSchedule] = useState<SchedulesInterface>();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams(); // รับ id จาก URL

  // ฟังก์ชันดึงข้อมูลการรักษา
  const getTreatment = async () => {
    try {
      let res = await GetTreatment();
      if (res) {
        setTreatments(res);
      }
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // ฟังก์ชันดึงข้อมูลการนัดหมายที่ต้องแก้ไข
  const getScheduleById = async () => {
    try {
      let res = await GetScheduleById(Number(id));
      if (res) {
        setSchedule(res);
        // ตั้งค่าเริ่มต้นในฟอร์มเมื่อดึงข้อมูลมาได้
        form.setFieldsValue({
          TreatmentID: res.TreatmentID,
          Date: dayjs(res.Date)
        });
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };
  

  
  const onFinish = async (values: SchedulesInterface) => {
    if (!schedule) return; 
    
    const updatedValues: SchedulesInterface = {
              
              ...values, // อัปเดตค่าที่ถูกกรอกใหม่
              ID: schedule.ID, // ระบุ ID ของการนัดหมายที่ต้องการอัปเดต
              PatientID: schedule.PatientID,
              TstatusID: schedule.TstatusID
          };
    let res = await UpdateSchedule(updatedValues);

    if (res && res.status === true) {
      messageApi.open({
        type: "error", // แก้เป็น success
        content: "อัปเดตข้อมูลสำเร็จ",
      });
      
    } else {
      messageApi.open({
        type: "success", // แก้เป็น error
        content: res.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
      });
    }
    
    setTimeout(function () {
      navigate("/viewschedule");
    }, 800);

  };


  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onCancel = () => {
    navigate("/viewschedule");
  };

  // เรียกใช้ข้อมูลเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    getTreatment(); // ดึงข้อมูลการรักษา
    getScheduleById(); // ดึงข้อมูลนัดหมายมาแสดงในฟอร์ม
  }, []);

  return (
    <div className="appointment-form">
      {contextHolder}
      <div className="headercreateschedule">
        <ClockCircleOutlined className="icon" />
        <h2>แก้ไขนัดหมายผู้ป่วยใน</h2>
      </div>

      <Form
        form={form}
        name="appointment"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="form-row">
          <Form.Item
            name="TreatmentID"
            label="การรักษา"
            rules={[{ required: true, message: "กรุณาเลือกการรักษา!" }]}
            style={{ width: "100%" }}
          >
            <Select
              placeholder="เลือกการรักษา"
              allowClear
              style={{ width: "100%", height: "40px", lineHeight: "40px" }}
            >
              {treatments.map((item) => (
                <Option value={item.ID} key={item.TreatmentName}>
                  {item.TreatmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="วันนัดหมาย"
            name="Date"
            rules={[{ required: true, message: "กรุณาเลือกวันนัดหมาย!" }]}
            style={{ width: "100%" }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%", height: "40px", lineHeight: "40px" }}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <div className="form-actions">
            <Button type="primary" htmlType="submit" className="submit-button-schedule-create">
              ยืนยัน
            </Button>

            <Button htmlType="button" className="cancel-button-schedule-create" onClick={onCancel}>
              ยกเลิก
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Routes>
        <Route path="/viewschedule" element={<ViewSchedule />} />
      </Routes>
    </div>
    
  );
}

export default ScheduleEdit;
