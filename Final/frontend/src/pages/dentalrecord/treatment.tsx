import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { GetTreatment, GetPatients } from "../../services/https";
import { TreatmentsInterface } from "../../interfaces/ITreatment";
import { PatientsInterface } from "../../interfaces/IPatient";
import './AddTreatmentRecord.css';

const { Option } = Select;

const AddTreatmentRecord: React.FC = () => {
  const [form] = Form.useForm();
  const [patients, setPatients] = useState<{ value: number, label: string }[]>([]); // ใช้ value เป็น number
  const [treatments, setTreatments] = useState<{ value: number, label: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const getTreatment = async () => {
    try {
      const res = await GetTreatment();
      if (res) {
        const treatmentOptions = res.map((treatment: TreatmentsInterface) => ({
          value: treatment.ID || 0, // ตรวจสอบว่า ID มีค่า
          label: treatment.TreatmentName || '', // ตรวจสอบว่า TreatmentName มีค่า
        }));
        setTreatments(treatmentOptions);
      }
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  const getPatients = async () => {
    try {
      const res = await GetPatients();
      if (res) {
        const patientOptions = res.map((patient: PatientsInterface) => ({
          value: patient.ID || 0, // ใช้ ID เป็น value
          label: `${patient.Tel || ''} (${patient.FirstName || ''} ${patient.LastName || ''})`, // แสดงข้อมูลผู้ป่วย
        }));
        setPatients(patientOptions);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    getTreatment();
    getPatients();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const response = await fetch('/api/dental_records', { // ตรวจสอบ URL ที่ถูกต้อง
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          patientID: values.patientID, // ใช้ patientID จากฟอร์ม
        }),
      });

      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        });
        form.resetFields();
      } else {
        const result = await response.json();
        messageApi.open({
          type: 'error',
          content: result.error || 'ไม่สามารถบันทึกข้อมูลได้',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์',
      });
    }
  };

  return (
    <div className="add-treatment-record">
      {contextHolder}
      <header>
        <h1>เพิ่มบันทึกการรักษา</h1>
      </header>
      <Form
        form={form}
        name="add-treatment-record"
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="form-row">
          <div className="form-group">
            <Form.Item
              label="ชื่อผู้ป่วย"
              name="patientID"
              rules={[{ required: true, message: "กรุณากรอก" }]}
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="ค้นหาเบอร์โทรหรือชื่อผู้ป่วย"
                optionFilterProp="label"
                options={patients}
                style={{ width: "100%", height: "40px", lineHeight: "40px" }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </div>
          <div className="form-group">
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
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label="วันที่รักษา"
          name="date"
          rules={[{ required: true, message: 'กรุณาเลือกวันที่!' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="รายละเอียด"
          name="description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="ค่ารักษา"
          name="fees"
          rules={[{ required: true, message: 'กรุณากรอกค่ารักษา!' }]}
        >
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item
          label="ส่วนลด"
          name="discount"
        >
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item>
          <div className="form-buttons">
            <Button type="primary" htmlType="submit" className="submit-button">ยืนยัน</Button>
            <Button htmlType="button" onClick={() => form.resetFields()} className="reset-button">รีเซต</Button>
            <Button htmlType="button" onClick={() => window.history.back()} className="cancel-button">ยกเลิก</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTreatmentRecord;
