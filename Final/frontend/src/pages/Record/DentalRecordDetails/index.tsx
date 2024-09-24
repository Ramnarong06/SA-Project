import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetDentalRecordByID } from "../../../services/https/dentalrecord";
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";
import { Button, Spin, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import './DentalRecordDetails.css'; // เพิ่มสไตล์ของหน้า

const DentalRecordDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ดึง ID จาก URL
  const [dentalRecord, setDentalRecord] = useState<DentalRecordInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // จัดการสถานะ loading
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับดึงข้อมูลบันทึกการรักษาตาม ID
  const fetchDentalRecord = async (recordId: string) => {
    try {
      const res = await GetDentalRecordByID(Number(recordId));
      if (res) {
        setDentalRecord(res);
        setLoading(false);
      } else {
        console.error("ไม่พบข้อมูลบันทึกการรักษา");
        setLoading(false);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลบันทึกการรักษา:", error);
      setLoading(false);
    }
  };
  

  // ดึงข้อมูลเมื่อ component ถูก mount
  useEffect(() => {
    if (id) {
      fetchDentalRecord(id);
    }
  }, [id]);

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (!dentalRecord) {
    return <p>ไม่พบข้อมูลบันทึกการรักษา</p>;
  }

  return (
    <div className="dental-record-details"> {/* ใช้ class จาก CSS */}
      <header className="header">
        <h1>รายละเอียดบันทึกการรักษา</h1>
        <Button
          onClick={() => navigate(-1)}
          className="button button-cancel"
          icon={<ArrowLeftOutlined />} // เพิ่มไอคอนลูกศร
          size={"large"}
        >
          
        </Button>      </header>

      <div className="form-container"> {/* ใช้ class สำหรับจัดวางฟอร์ม */}
      <Descriptions 
  title="ข้อมูลบันทึกการรักษา" 
  bordered 
  layout="horizontal" // ปรับเป็นแนวนอน
  column={2} // แสดงข้อมูล 2 คอลัมน์ในแต่ละแถว
>
  <Descriptions.Item label="RecordID">{dentalRecord.ID}</Descriptions.Item>
  <Descriptions.Item label="Date">
    {new Date(dentalRecord.Date).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })}
  </Descriptions.Item>
  <Descriptions.Item label="PatientID">{dentalRecord.PatientID}</Descriptions.Item>
  <Descriptions.Item label="PatientName">
    {dentalRecord.Patient ? `${dentalRecord.Patient.FirstName} ${dentalRecord.Patient.LastName}` : "ไม่พบข้อมูล"}
  </Descriptions.Item>
  <Descriptions.Item label="TreatmentID">{dentalRecord.TreatmentID}</Descriptions.Item>
  <Descriptions.Item label="TreatmentName">
    {dentalRecord.Treatment ? dentalRecord.Treatment.TreatmentName : "ไม่พบข้อมูล"}
  </Descriptions.Item>
  <Descriptions.Item label="Fees">{dentalRecord.Fees}</Descriptions.Item>
  <Descriptions.Item label="Description" style={{ width: '350px' }}>
  <div className="description">{dentalRecord.Description}</div>
</Descriptions.Item>
  <Descriptions.Item label="Installment">{dentalRecord.Installment}</Descriptions.Item>
  <Descriptions.Item label="Number of Installment">{dentalRecord.NumberOfInstallment}</Descriptions.Item>
  <Descriptions.Item label="EmployeeID">{dentalRecord.EmployeeID}</Descriptions.Item>
  <Descriptions.Item label="EmployeeName">
    {dentalRecord.Employee ? `${dentalRecord.Employee.FirstName} ${dentalRecord.Employee.LastName}` : "ไม่พบข้อมูล"}
  </Descriptions.Item>
</Descriptions>
      </div>
    </div>
  );
};

export default DentalRecordDetails;
