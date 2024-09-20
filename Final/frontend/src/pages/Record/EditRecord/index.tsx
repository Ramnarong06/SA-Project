import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import moment from "moment";
import { TreatmentsInterface } from "../../../interfaces/dental/ITreatment";
import { GetTreatment, GetPatients, GetDentalRecordByID } from "../../../services/https/dentalrecord/index";
import { useParams, useNavigate } from "react-router-dom";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";
import './AddTreatmentRecord.css';
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";

const { Option } = Select;

interface FormValues {
  date: moment.Moment | null;
  description?: string;
  fees: number;
  installment?: number; // เปลี่ยนเป็น optional
  numberOfInstallment?: string; // เปลี่ยนเป็น string
}

function EditDentalRecord() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();  // ดึง id ของการรักษาจาก URL
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getTreatment();
    getPatients();
    if (id) {
      loadDentalRecord(id);
    }
  }, [id]);

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

  const loadDentalRecord = async (recordID: string) => {
    try {
      const id = parseInt(recordID, 10); // แปลง recordID เป็นตัวเลข
      const record = await GetDentalRecordByID(id); // ใช้ตัวเลขที่แปลงแล้ว
      if (record) {
        form.setFieldsValue({
          patientID: record.PatientID,
          TreatmentID: record.TreatmentID,
          date: moment(record.Date),
          description: record.Description,
          fees: record.Fees,
          installment: record.Installment,
          numberOfInstallment: record.NumberOfInstallment,
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลการรักษา:", error);
    }
  };

  const onFinish = async (values: FormValues) => {
    try {
      const installment = values.installment !== undefined ? parseFloat(values.installment.toString()) : 0;
      const numberOfInstallment = values.numberOfInstallment || ''; // เปลี่ยนให้เป็น string
  
      if (installment < 0) {
        messageApi.open({
          type: 'error',
          content: 'ค่างวดต้องมากกว่าหรือเท่ากับ 0',
        });
        return;
      }
  
      const payload: DentalRecordInterface = {
        ID: id ? parseInt(id) : 0, // ใช้ ID จาก URL params
        Date: values.date ? values.date.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : '',
        Description: values.description || '',
        Fees: parseFloat(values.fees.toString()),
        Installment: installment,
        NumberOfInstallment: numberOfInstallment, // ส่งเป็น string
        TreatmentID: form.getFieldValue('TreatmentID'),
        StatusID: 1,
        PatientID: form.getFieldValue('patientID'),
        EmployeeID: 1,
        Treatment: {
          ID: form.getFieldValue('TreatmentID'),
          Name: '',
        },
        Status: {
          ID: 2,
          Name: '',
        },
        Patient: {
          ID: form.getFieldValue('patientID'),
          FirstName: '',
          LastName: '',
        },
        Employee: {
          ID: 1,
          FirstName: '',
          LastName: '',
        },
      };
  
      console.log("Payload:", payload);
  
      const response = await fetch(`http://localhost:8000/dental_record/${id}`, { // ใช้ ID ใน URL
        method: 'PATCH', // ใช้วิธี PATCH สำหรับการอัปเดต
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
        });
        navigate('/DentalRecord'); // เปลี่ยนเส้นทางหลังจากสำเร็จ
      } else {
        const result = await response.json();
        messageApi.open({
          type: 'error',
          content: result.error || 'ไม่สามารถแก้ไขข้อมูลได้',
        });
        console.error('Server response error:', result);
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์',
      });
      console.error('Request error:', error);
    }
  };
  
  return (
    <div className="add-treatment-record">
      {contextHolder}
      <header>
        <h1>แก้ไขบันทึกการรักษา</h1>
      </header>
      <Form
        form={form}
        name="edit-treatment-record"
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
          label="ค่างวด"
          name="installment"
        >
          <Input type="number" step="0.01" min="0" />
        </Form.Item>
        <Form.Item
          label="จำนวนงวด"
          name="numberOfInstallment"
        >
          <Input type="text" /> {/* ใช้ type="text" สำหรับค่าที่เป็น string */}
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

export default EditDentalRecord;
