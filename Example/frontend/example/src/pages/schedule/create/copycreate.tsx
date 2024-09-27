import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import "./create.css";
import { TreatmentsInterface } from "../../../interfaces/ITreatment.ts";
import { SchedulesInterface } from "../../../interfaces/ISchedule.ts";
import { ImageUpload } from "../../../interfaces/IUpload.ts";
import { GetTreatment, CreateUser } from "../../../services/https/index.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Schedule from "./create.tsx";
import ViewSchedule from "../view/view.tsx";
import { CreateSchedule } from "../../../services/https/index.tsx";

const { Option } = Select;

function ScheduleCreate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [profile, setProfile] = useState<ImageUpload>();
  const [messageApi, contextHolder] = message.useMessage();

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
            <Input placeholder="เบอร์โทร" />
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
