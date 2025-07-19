// นำเข้า libraries และ components ที่จำเป็น
import React, { useState, useEffect } from "react"; // นำเข้า React และ hooks
import { Button, Modal, message, Select } from "antd"; // นำเข้า components จาก Ant Design
import { PlusOutlined, EditOutlined, DeleteOutlined, SortAscendingOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons"; // นำเข้า icons
import { GetAllSchedule, DeleteScheduleByID, GetPatients, GetTreatment, GetTstatus } from "../../../services/https/schedule"; // นำเข้าฟังก์ชันสำหรับเรียก API
import { SchedulesInterface } from "../../../interfaces/schedule/ISchedule"; // นำเข้า interface สำหรับ Schedule
import { PatientsInterface } from "../../../interfaces/individual/IPatient"; // นำเข้า interface สำหรับ Patient
import { TreatmentsInterface } from "../../../interfaces/schedule/ITreatment"; // นำเข้า interface สำหรับ Treatment
import { TstatusInterface } from "../../../interfaces/schedule/ITstatus"; // นำเข้า interface สำหรับ Treatment Status
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate สำหรับการนำทาง
import dayjs from "dayjs"; // นำเข้า dayjs สำหรับการจัดรูปแบบวันที่
import './record.css'; // นำเข้าไฟล์ CSS
import new_logo from "../../../assets/stock/new_logo.png"; // นำเข้าภาพโลโก้
import { Pagination } from 'antd'; // นำเข้า Pagination component จาก Ant Design

// กำหนด functional component ชื่อ ScheduleRecord
const ScheduleRecord: React.FC = () => {
  const navigate = useNavigate(); // เริ่มต้นการนำทาง

  // สร้าง state variables สำหรับจัดการ schedules, patients, treatments, และ statuses
  const [schedules, setSchedules] = useState<SchedulesInterface[]>([]); // เก็บข้อมูล schedules ทั้งหมด
  const [patients, setPatients] = useState<PatientsInterface[]>([]); // เก็บข้อมูล patients ทั้งหมด
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null); // ติดตาม patient ที่เลือก
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]); // เก็บข้อมูล treatments ทั้งหมด
  const [statuses, setStatuses] = useState<TstatusInterface[]>([]); // เก็บข้อมูล treatment statuses ทั้งหมด
  const [filteredSchedules, setFilteredSchedules] = useState<SchedulesInterface[]>([]); // เก็บข้อมูล schedules ที่กรองแล้ว
  const [sortOption, setSortOption] = useState<string>("Sort by : "); // ติดตามตัวเลือกการจัดเรียงปัจจุบัน
  const [messageApi, contextHolder] = message.useMessage(); // เริ่มต้น message API สำหรับการแจ้งเตือน
  const [open, setOpen] = useState(false); // ควบคุมการแสดงผลของ modal
  const [confirmLoading, setConfirmLoading] = useState(false); // ควบคุมสถานะการโหลดสำหรับการยืนยัน
  const [modalText, setModalText] = useState<string>(""); // ข้อความสำหรับ modal
  const [deleteId, setDeleteId] = useState<number | null>(null); // ติดตาม ID ของ schedule ที่จะลบ

  // สถานะสำหรับการแบ่งหน้า
  const [currentPage, setCurrentPage] = useState<number>(1); // หมายเลขหน้าปัจจุบัน
  const [pageSize] = useState<number>(5); // จำนวนแถวต่อหน้า

  // คำนวณดัชนีสำหรับการแบ่งหน้า
  const indexOfLastRecord = currentPage * pageSize; // ดัชนีของแถวสุดท้ายในหน้าปัจจุบัน
  const indexOfFirstRecord = indexOfLastRecord - pageSize; // ดัชนีของแถวแรกในหน้าปัจจุบัน
  const currentRecords = filteredSchedules.slice(indexOfFirstRecord, indexOfLastRecord); // รับข้อมูลที่แสดงในหน้าปัจจุบัน

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยทั้งหมด
  const getAllPatients = async () => {
    try {
      let patientRes = await GetPatients(); // เรียก API เพื่อดึงข้อมูลผู้ป่วย
      if (patientRes) {
        setPatients(patientRes); // อัปเดต state ของ patients
        //console.log('Patients retrieved:', patientRes); // แสดงข้อมูลผู้ป่วยที่ดึงมาใน console
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย"); // แจ้งข้อผิดพลาดเมื่อดึงข้อมูลไม่สำเร็จ
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลการรักษาทั้งหมด
  const getAllTreatments = async () => {
    try {
      let treatmentRes = await GetTreatment(); // เรียก API เพื่อดึงข้อมูลการรักษา
      if (treatmentRes) {
        setTreatments(treatmentRes); // อัปเดต state ของ treatments
        console.log('Treatments retrieved:', treatmentRes); // แสดงข้อมูลการรักษาที่ดึงมาใน console
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษา"); // แจ้งข้อผิดพลาดเมื่อดึงข้อมูลไม่สำเร็จ
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลนัดหมายทั้งหมด
  const getAllSchedules = async () => {
    try {
      let scheduleRes = await GetAllSchedule(); // เรียก API เพื่อดึงข้อมูลนัดหมาย
      if (scheduleRes) {
        
        setSchedules(scheduleRes);          // set ข้อมูล schedules ทั้งหมด
        setFilteredSchedules(scheduleRes);  // set ข้อมูล schedules ( ของตัว filter )
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลนัดหมาย"); // แจ้งข้อผิดพลาดเมื่อดึงข้อมูลไม่สำเร็จ
    }
  };

  // ฟังก์ชันเพื่อแสดง modal สำหรับยืนยันการลบ
  const showModal = (record: SchedulesInterface) => {
    if (record.ID !== undefined) { // ตรวจสอบว่า ID ของรายการมีอยู่
      setModalText(`คุณต้องการลบข้อมูลการนัดหมาย "ID =${record.ID}" หรือไม่ ?`); // กำหนดข้อความใน modal
      setDeleteId(record.ID); // ตั้งค่า ID ที่จะลบ
      setOpen(true); // แสดง modal
    } else {
      messageApi.error("ไม่สามารถลบรายการที่ไม่มี ID ได้"); // แจ้งข้อผิดพลาดถ้า ID ไม่มี
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลสถานะการรักษาทั้งหมด
  const getAllTstatus = async () => {
    try {
      let tstatusRes = await GetTstatus();  // เรียก API เพื่อดึงข้อมูลสถานะการรักษา
      if (tstatusRes) {
        setStatuses(tstatusRes);      // เก็บค่า tstatus 
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถานะการรักษา");
    }
  };

  // useEffect สำหรับดึงข้อมูลเมื่อ component แรกเริ่ม
  useEffect(() => {
    getAllSchedules(); // ดึงข้อมูลนัดหมายทั้งหมด
    getAllPatients(); // ดึงข้อมูลผู้ป่วยทั้งหมด
    getAllTreatments(); // ดึงข้อมูลการรักษาทั้งหมด
    getAllTstatus(); // ดึงข้อมูลสถานะการรักษาทั้งหมด
  }, []);

  // ฟังก์ชันสำหรับการจัดเรียงข้อมูล
  const handleSort = (type: string) => {
    let sortedSchedules = [...filteredSchedules]; // ทำสำเนาข้อมูล filteredSchedules

    // ตรวจสอบประเภทการจัดเรียง
    if (type === "status") {
      // จัดเรียงตามสถานะ
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => {
        const statusA = statuses.find(status => status.ID === scheduleA.TstatusID)?.TStatusName || ""; // หา TStatusName ของ schedule A
        const statusB = statuses.find(status => status.ID === scheduleB.TstatusID)?.TStatusName || ""; // หา TStatusName ของ schedule B
        return statusA.localeCompare(statusB); // เปรียบเทียบเพื่อจัดเรียง
      });
    } else if (type === "scheduleId") {
      // จัดเรียงตาม ScheduleID
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => 
        (scheduleA.ID ?? 0) - (scheduleB.ID ?? 0) // เปรียบเทียบ ID
      );
    } else if (type === "patientName") {
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => {
        const patientA = patients.find(patient => patient.ID === scheduleA.PatientID)?.FirstName || "";
        const patientB = patients.find(patient => patient.ID === scheduleB.PatientID)?.FirstName || "";
        return patientA.localeCompare(patientB);  // เปรียบเทียบ patientA กับ patientB
      });
    } else if (type === "date") {
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => {
        const dateA = scheduleA.Date ? new Date(scheduleA.Date).getTime() : 0;
        const dateB = scheduleB.Date ? new Date(scheduleB.Date).getTime() : 0;
        return dateA - dateB; // เปรียบเทียบวันที่
      });
    }

    setFilteredSchedules(sortedSchedules); // อัปเดตข้อมูลที่กรองแล้วด้วยข้อมูลที่จัดเรียง
    setSortOption(type); // อัปเดตตัวเลือกการจัดเรียง
  };

  // ฟังก์ชันสำหรับยืนยันการลบข้อมูล
  const handleDeleteSchedule = async () => {
    if (deleteId) { // ตรวจสอบว่า deleteId มีค่า
      setConfirmLoading(true); // ตั้งค่าสถานะการโหลด
      try {
        await DeleteScheduleByID(deleteId); // เรียก API เพื่อลบข้อมูล
        messageApi.success("ลบข้อมูลนัดหมายเรียบร้อยแล้ว"); // แจ้งว่าลบข้อมูลสำเร็จ
        setOpen(false); // ปิด modal
        getAllSchedules(); // ดึงข้อมูลนัดหมายใหม่
      } catch (error) {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูลนัดหมาย"); // แจ้งข้อผิดพลาดถ้าลบไม่สำเร็จ
      } finally {
        setConfirmLoading(false); // ตั้งค่าสถานะการโหลดเป็น false
      }
    }
  };

  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const handleChangePage = (page: number) => {
    setCurrentPage(page); // อัปเดตหมายเลขหน้าปัจจุบัน
  };

  return (
    <>
      {contextHolder} {/* แสดง message API */}
      <div className="header"> {/* ส่วนหัวของตาราง */}
        <img src={new_logo} alt="logo" className="logo" /> {/* แสดงโลโก้ */}
        <h1>ตารางนัดหมาย</h1> {/* ชื่อหัวข้อ */}
        <Select defaultValue="Sort by :" style={{ width: 120 }} onChange={handleSort}> {/* Dropdown สำหรับการจัดเรียง */}
          <Select.Option value="scheduleId">ตาม ID นัดหมาย</Select.Option> {/* ตัวเลือกการจัดเรียงตาม ID */}
          <Select.Option value="patientName">ตามชื่อผู้ป่วย</Select.Option> {/* ตัวเลือกการจัดเรียงตามชื่อผู้ป่วย */}
          <Select.Option value="status">ตามสถานะ</Select.Option> {/* ตัวเลือกการจัดเรียงตามสถานะ */}
          <Select.Option value="date">ตามวันที่</Select.Option> {/* ตัวเลือกการจัดเรียงตามวันที่ */}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/schedules/create")}> {/* ปุ่มสำหรับเพิ่มนัดหมายใหม่ */}
          เพิ่มนัดหมาย
        </Button>
      </div>
      
      <div className="schedule-table"> {/* ตารางสำหรับแสดงข้อมูลนัดหมาย */}
        {currentRecords.map(schedule => ( // แสดงข้อมูลนัดหมายที่กรองแล้ว
          <div key={schedule.ID} className="schedule-row"> {/* แถวข้อมูลนัดหมาย */}
            <div>{schedule.ID}</div> {/* แสดง ID นัดหมาย */}
            {/* //<div>{schedule.ScheduleDate ? dayjs(schedule.ScheduleDate).format('DD/MM/YYYY') : "-"}</div> แสดงวันที่
            <div>{patients.find(patient => patient.ID === schedule.PatientID)?.FullName || "-"}</div> แสดงชื่อผู้ป่วย */}
            <div>{statuses.find(status => status.ID === schedule.TstatusID)?.TStatusName || "-"}</div> {/* แสดงสถานะ */}
            <Button icon={<EditOutlined />} onClick={() => navigate(`/schedules/edit/${schedule.ID}`)}> {/* ปุ่มสำหรับแก้ไขข้อมูลนัดหมาย */}
              แก้ไข
            </Button>
            <Button icon={<DeleteOutlined />} onClick={() => showModal(schedule)}> {/* ปุ่มสำหรับลบข้อมูลนัดหมาย */}
              ลบ
            </Button>
          </div>
        ))}
      </div>
      
      <Pagination
        current={currentPage} // หมายเลขหน้าปัจจุบัน
        pageSize={pageSize} // ขนาดของแต่ละหน้า
        total={filteredSchedules.length} // จำนวนทั้งหมดของข้อมูลที่กรองแล้ว
        onChange={handleChangePage} // ฟังก์ชันที่เรียกเมื่อเปลี่ยนหน้า
      />

      {/* Modal สำหรับยืนยันการลบ */}
      <Modal
        title="ยืนยันการลบ"
        open={open} // เปิดหรือปิด modal
        onOk={handleDeleteSchedule} // ฟังก์ชันที่เรียกเมื่อกดปุ่ม OK
        confirmLoading={confirmLoading} // ควบคุมสถานะการโหลด
        onCancel={() => setOpen(false)} // ฟังก์ชันที่เรียกเมื่อกดปุ่ม Cancel
      >
        <p>{modalText}</p> {/* ข้อความใน modal */}
      </Modal>
    </>
  );
};

export default ScheduleRecord; // ส่งออก ScheduleRecord component
