import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import "./create.css";
import { TreatmentsInterface } from "../../../interfaces/ITreatment.ts";
import { SchedulesInterface } from "../../../interfaces/ISchedule.ts";
import { ImageUpload } from "../../../interfaces/IUpload.ts";
import { GetTreatment, GetPatients, CreateUser } from "../../../services/https/index.tsx"; // เพิ่ม GetPatients ที่นี่
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Schedule from "./create.tsx";
import ViewSchedule from "../view/view.tsx";
import { CreateSchedule } from "../../../services/https/index.tsx";

const { Option } = Select;

function ScheduleCreate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [patients, setPatients] = useState<{ value: string; label: string }[]>([]); // เพิ่ม state สำหรับคนไข้
  const [messageApi, contextHolder] = message.useMessage();

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

  // ฟังก์ชันดึงข้อมูลคนไข้จาก backend
  const getPatients = async () => {
    try {
      let res = await GetPatients(); // เรียกใช้ service ที่ดึงข้อมูลจาก API
      if (res) {
        const patientOptions = res.map((patient: any) => ({
          value: patient.Tel, // ใช้เบอร์โทรเป็น value
          label: `${patient.Tel} ( ${patient.FirstName} ${patient.LastName} ) `, // แสดงชื่อและเบอร์ใน dropdown
        }));
        setPatients(patientOptions);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const onFinish = async (values: SchedulesInterface) => {
    let res = await CreateSchedule(values);
    if (res.status) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setTimeout(function () {
        navigate("/viewschedule");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
      setTimeout(function () {
        navigate("/viewschedule");
      }, 200);
    }
  };

  useEffect(() => {
    getTreatment();
    getPatients(); // เรียก getPatients เพื่อดึงข้อมูลคนไข้จาก backend
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onCancel = () => {
    navigate("/viewschedule");
  };

  return (
    <div className="appointment-form">
      {contextHolder}
      <div className="header">
        <ClockCircleOutlined className="icon" />
        <h2>นัดหมายคนไข้ใน</h2>
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
            label="เบอร์โทร"
            name="tel"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทร!" }]}
            style={{ width: "100%" }}
          >
            <Select
              showSearch
              placeholder="ค้นหาเบอร์โทรหรือชื่อคนไข้"
              optionFilterProp="label" // ฟิลเตอร์ด้วย label (ค้นหาด้วยชื่อนามสกุล)
              options={patients} // ใช้ข้อมูล patients ที่ดึงมาจาก backend
              style={{ width: "100%", height: "40px", lineHeight: "40px" }}
            />
          </Form.Item>

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
        </div>

        <div className="form-row">
          <Form.Item
            label="วันนัดหมาย"
            name="Date"
            rules={[{ required: true, message: "กรุณาเลือกวันนัดหมาย!" }]}
            style={{ width: "100%" }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "48.5%", height: "40px", lineHeight: "40px" }}
            />
          </Form.Item>
        </div>

        <div className="patient-status">
          <a href="#">สำหรับคนไข้นอก</a>
        </div>

        <Form.Item>
          <div className="form-actions">
            <Button type="primary" htmlType="submit" className="submit-button">
              ยืนยัน
            </Button>

            <Button htmlType="button" className="cancel-button" onClick={onCancel}>
              ยกเลิก
            </Button>
          </div>
        </Form.Item>
      </Form>

      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/viewschedule" element={<ViewSchedule />} />
      </Routes>
    </div>
  );
}

export default ScheduleCreate;
