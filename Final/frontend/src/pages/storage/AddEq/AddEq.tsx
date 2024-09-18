import {
  Space,
  Col,
  Row,
  Divider,
  Form,
  Card,
  message,
  InputNumber,
} from "antd";

import { useNavigate, Link, useParams } from "react-router-dom";
//import { RestockInterface } from "../../interfaces/IRestock";
import { RestockInterface } from "../../../interfaces/storage/IRestock";
//import { CreateRestock, GetEquipmentById } from "../../services/https";
import { CreateRestock, GetEquipmentById } from "../../../services/https/storage";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
//import new_logo from "../../assets/new_logo.png";
import "./AddEq.css";


function RestockCreate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // ดึง id จาก URL
  const [messageApi, contextHolder] = message.useMessage();
  const [equipment, setEquipment] = useState<any>(null); // เก็บข้อมูลอุปกรณ์
  const [currentDate, setCurrentDate] = useState(dayjs()); // สร้าง state สำหรับเก็บเวลา ณ ปัจจุบัน

  // อัพเดทเวลา ณ ปัจจุบันทุกวินาที
  /*useEffect1(() => {
    const interval = setInterval(() => {
    setCurrentDate(dayjs()); // อัพเดทเวลาทุกวินาที
  }, 1000); // อัพเดททุก 1 วินาที
  return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);*/

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      console.log("Current time:", now.format("YYYY-MM-DD HH:mm:ss")); // ตรวจสอบการอัปเดตของเวลาใน console
      setCurrentDate(now); // อัพเดทเวลาทุกวินาที
    }, 1000); 
  
    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);
  

  useEffect(() => {
    // ตรวจสอบค่า id
    console.log('Equipment ID from URL:', id);

    // เรียกข้อมูลอุปกรณ์เมื่อมี id
    const fetchData = async () => {
      if (id) {
        try {
          const res = await GetEquipmentById(id);
          if (res.status === 200) {
            setEquipment(res.data); // เก็บข้อมูลอุปกรณ์
            console.log('Fetched equipment data:', res.data);
          } else {
            messageApi.open({
              type: "error",
              content: 'ไม่สามารถดึงข้อมูลอุปกรณ์ได้',
            });
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
          messageApi.open({
            type: "error",
            content: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
          });
        }
      }
    };
    fetchData();
  }, [id]);

  const onFinish = async (values: RestockInterface) => {
    const restockData = {
      equipment_id: equipment.ID,
      restock_quantity: values.RestockQuantity,
      employee_id: values.EmployeeID,
    };

    try {
      const res = await CreateRestock(restockData);
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        console.log("เปลี่ยนหน้า");
        navigate("/Restocks");
      }, 500);
    } catch (error) {
      console.error('Error creating restock:', error);
      messageApi.open({
        type: "error",
        content: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล',
      });
    }
  };

  return (
    <div className="equipment-create-container">
      {contextHolder}
      <Card className="equipment-card">
        <div className="logo-container">
          
        </div>
        <form className="formhAdd">
          <div className="label1Add">เติมอุปกรณ์</div>
        </form>
        <Row gutter={[16, 0]}>
          {/* ส่วนแสดงข้อมูลอุปกรณ์ */}
          <Divider style={{ borderTop: '1.6px dashed #42C2C2'}}/>
          <div className="equipment-info">
            <div className="equipment-row">
              <div className="label">รหัส:</div>
              <div className="value">{equipment ? equipment.ID : "กำลังโหลด..."}</div>
            </div>
            <div className="equipment-row">
              <div className="label">ชื่ออุปกรณ์:</div>
              <div className="value">{equipment ? equipment.EquipmentName : "กำลังโหลด..."}</div>
            </div>
            <div className="equipment-row">
              <div className="label">หน่วย:</div>
              <div className="value">{equipment ? equipment.Unit : "กำลังโหลด..."}</div>
            </div>
            <div className="equipment-row">
              <div className="label">ต้นทุน/หน่วย (บาท):</div>
              <div className="value">{equipment ? equipment.Cost : "กำลังโหลด..."}</div>
            </div>
            <div className="equipment-row">
              <div className="label">ในคลัง:</div>
              <div className="value">{equipment ? equipment.Quantity : "กำลังโหลด..."}</div>
            </div>
          </div>
          <Divider style={{ borderTop: '1.6px dashed #42C2C2'}}/>
           {/* แสดงเวลาปัจจุบันใน UI */}
          <h4 style={{marginTop: '-12px', color: "#42C2C2" }}>รับเข้า :  {currentDate.format("YYYY-MM-DD HH:mm:ss")}</h4> 
        </Row>
       
        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="จำนวน"
                name="RestockQuantity"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกจำนวน!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* ชื่อผู้เติม */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="รหัสพนักงาน"
                name="EmployeeID"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสพนักงาน!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row><Col xs={24} sm={24} md={12} lg={12} xl={12}><p> </p></Col></Row>

          <Row>
            <Col span={24} style={{ textAlign: "end", alignSelf: "center" }}>
              <Space size="middle">
                <div className="form-buttons">
                  <Link to="/LittleEq">
                    <button type="button" className="cancel">
                      ยกเลิก
                    </button>
                  </Link>
                  <button type="reset" className="reset">
                    รีเซต
                  </button>
                  <button type="submit" className="submit">
                    ตกลง
                  </button>
                </div>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default RestockCreate;
