import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
//import moment from "moment"; // ใช้ moment สำหรับการจัดการวันที่
import { TreatmentsInterface } from "../../../interfaces/dental/ITreatment";
import { GetTreatment, GetPatients } from "../../../services/https/dentalrecord/index";
import { useNavigate } from "react-router-dom";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";
import './AddDentalRecord.css';

const { Option } = Select;

interface FormValues {
  //date: moment.Moment | null;
  description?: string;
  fees: number;
  installment?: number; // เปลี่ยนเป็น optional
  numberOfInstallment?: string; // เปลี่ยนเป็น string
}

function AddDentalRecord() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
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

  const getPatients = async () => {
    try {
      const res = await GetPatients();
      if (res) {
        const patientOptions = res.map((patient: PatientsInterface) => ({
          value: patient.ID || 0,
          label: `${patient.Tel || ''} (${patient.FirstName || ''} ${patient.LastName || ''})`,
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

  const onFinish = async (values: FormValues) => {
    try {
      // ตรวจสอบค่าก่อนส่ง
      const payload = {
        ...values,
        fees: parseFloat(values.fees.toString()), // แปลงค่า fees เป็น number
        // ตรวจสอบว่า installment และ numberOfInstallments ไม่เป็น undefined และแปลงเป็น number หรือ string
        installment: values.installment ? parseFloat(values.installment.toString()) : null,
        numberOfInstallments: values.numberOfInstallment || null, // ใช้ค่า string โดยตรง
      };
  
      console.log("Payload:", payload); // เพิ่มการแสดงผล payload เพื่อตรวจสอบ
  
      const response = await fetch('http://localhost:8000/dental_records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
                  <Option value={item.ID} key={item.ID}>
                    {item.TreatmentName}
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
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' ,height: "40px"}} />
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
          label="ค่างวด"
          name="installment" // ใช้ตัวพิมพ์เล็กให้ตรงกับใน payload
        >
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item
          label="จำนวนงวด"
          name="numberOfInstallment" // ใช้ตัวพิมพ์เล็กให้ตรงกับใน payload
>
          <Input type="text" />
        </Form.Item>
        
        <Form.Item>
          <div className="form-buttons">
            <Button type="primary" htmlType="submit" className="submit-button">ยืนยัน</Button>
            <Button htmlType="button" onClick={() => form.resetFields()} className="reset-button">รีเซต</Button>
            <Button htmlType="button" onClick={() => navigate(-1)} className="cancel-button">ยกเลิก</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddDentalRecord;
