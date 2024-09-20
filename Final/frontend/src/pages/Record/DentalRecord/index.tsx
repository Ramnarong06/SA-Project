import React, { useState, useEffect } from "react";
import { Button, Modal, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GetDentalRecords, GetPatients, DeleteDentalRecordByID } from "../../../services/https/dentalrecord";
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import './DentalRecord.css';

const DentalRecord: React.FC = () => {
  const navigate = useNavigate();
  const [dentalRecords, setDentalRecords] = useState<DentalRecordInterface[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DentalRecordInterface[]>([]);
  const [patients, setPatients] = useState<PatientsInterface[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number>();

  const getDentalRecords = async () => {
    try {
      let res = await GetDentalRecords();
      if (res) {
        setDentalRecords(res);
        setFilteredRecords(res); // แสดงทุก record โดยเริ่มต้น
        console.log('Dental records retrieved:', res);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getPatients = async () => {
    try {
      const res = await GetPatients();
      if (res) {
        setPatients(res);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย");
    }
  };

  const handlePatientChange = (value: number | null | undefined) => {
    console.log('Value received from Select:', value);
    
    setSelectedPatient(value ?? null);
    
    if (value === null || value === undefined) {
      setFilteredRecords([...dentalRecords]); // แสดงบันทึกทั้งหมด
    } else {
      const filteredData = dentalRecords.filter(record => record.PatientID === value);
      setFilteredRecords(filteredData);
    }
  };

  useEffect(() => {
    getDentalRecords(); // ดึงข้อมูลบันทึกการรักษาเมื่อ component โหลด
    getPatients(); // ดึงข้อมูลผู้ป่วยเมื่อ component โหลด
  }, []);

  const showModal = (record: DentalRecordInterface) => {
    setModalText(`คุณต้องการลบข้อมูลบันทึกการรักษา "${record.ID}" หรือไม่ ?`);
    setDeleteId(record.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let res = await DeleteDentalRecordByID(deleteId);
      if (res) {
        messageApi.success("ลบข้อมูลสำเร็จ");
        getDentalRecords(); // ดึงข้อมูลใหม่หลังจากการลบ
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="treatment-records">
      <header className="header">
        <h1>บันทึกการรักษา</h1>
        <div className="controls">
          <div className="controls-group">
            <Select
              showSearch
              placeholder="ค้นหาเบอร์โทรหรือชื่อผู้ป่วย"
              style={{ width: 250, height: "40px", marginRight: 40 }}
              onChange={handlePatientChange}
              allowClear
              onClear={() => handlePatientChange(null)} // จัดการเมื่อกดกากบาท
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label).toLowerCase().includes(input.toLowerCase())
              }
            >
              {patients.map(patient => (
                <Select.Option
                  key={patient.ID}
                  value={patient.ID}
                  label={`${patient.FirstName} ${patient.LastName} ${patient.Tel}`}
                >
                  {patient.FirstName} {patient.LastName} - {patient.Tel}
                </Select.Option>
              ))}
            </Select>

            <button
              className="add-record-button"
              onClick={() => navigate("/AddDentalRecord")}
            >
              <PlusOutlined /> เพิ่มบันทึก
            </button>
          </div>
        </div>
      </header>

      <table className="records-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Fees</th>
            <th>Treatment ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map(record => (
            <tr key={record.ID}>
              <td>{record.ID}</td>
              <td>{record.PatientID}</td>
              <td>{dayjs(record.Date).format("YYYY-MM-DD")}</td>
              <td>{record.Description}</td>
              <td>{record.Fees}</td>
              <td>{record.TreatmentID}</td>
              <td>
                <Button
                  onClick={() => navigate(`/EditRecord/${record.ID}`)}
                  shape="circle"
                  icon={<EditOutlined />}
                  size={"large"}
                />
                <Button
                  onClick={() => showModal(record)}
                  style={{ marginLeft: 10 }}
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size={"large"}
                  danger
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {contextHolder}

      <Modal
        title="ยืนยันการลบ"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
};

export default DentalRecord;
