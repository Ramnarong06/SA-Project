import {
  Space,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  InputNumber,
} from "antd";
import { useNavigate, Link, useParams } from "react-router-dom";
//import { RequisitionInterface } from "../../interfaces/IRequisition";
import { RequisitionInterface } from "../../../interfaces/storage/IRequisition";
import { useEffect, useState } from "react";
//import { CreateRequisition, GetEquipmentById } from "../../services/https";
import { CreateRequisition, GetEquipmentById } from "../../../services/https/storage";
import new_logo from "../../../assets/new_logo.jpg";
import dayjs from "dayjs";
import "./RequestEq.css";

function RequisitionCreate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [equipment, setEquipment] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(dayjs()); // สร้าง state สำหรับเก็บเวลา ณ ปัจจุบัน

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      console.log("Current time:", now.format("YYYY-MM-DD HH:mm:ss")); // ตรวจสอบการอัปเดตของเวลาใน console
      setCurrentDate(now); // อัพเดทเวลาทุกวินาที
    }, 1000); 
  
    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  useEffect(() => {
    
    console.log('Equipment ID from URL:', id);

    const fetchData = async () => {
      if (id) {
        try {
          const res = await GetEquipmentById(id);
          if (res.status === 200) {
            setEquipment(res.data);
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

  
  const onFinish = async (values: RequisitionInterface) => {
    const requisitionData = {
      equipment_id: equipment.ID, // ส่ง Equipment ID จาก state
      requisition_quantity: values.RequisitionQuantity, // ส่งจำนวนที่ต้องการเบิก
      employee_id: values.EmployeeID, // ใช้ employee_id จากฟอร์ม
      note: values.Note, // ส่งบันทึกช่วยจำ (ถ้ามี)
      //Time: values.Time, // ส่งวันเวลาที่เบิก
    };

    let res = await CreateRequisition(requisitionData);

    console.log(requisitionData);

    messageApi.open({
      type: "success",
      content: res.data.message,
    });
      setTimeout(() => {
        console.log("เปลี่ยนหน้า");
        navigate("/Requisitions");
      }, 500);
  };
  

  return (
    <div className="equipment-create-container">
      {contextHolder}
      <Card className="equipment-card">
        <div className="logo-container">
          <img
            src={new_logo}
            alt="logo"
            className="logo"
          />
        </div>

        <form className="formhAdd">
          <div className="label1Add">เบิกอุปกรณ์</div>
        </form>

        <Row gutter={[15, 0]}>
          {/* ส่วนแสดงข้อมูลอุปกรณ์ */}
          <Divider style={{ borderTop: '1.6px dashed #42C2C2' }} />
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
          <Divider style={{ borderTop: '1.6px dashed #42C2C2' }} />
          
          </Row>
             {/* แสดงเวลาปัจจุบันใน UI */}
             <h4 style={{marginTop: '-12px', color: "#42C2C2" }}>วันเวลาที่เบิก :  {currentDate.format("YYYY-MM-DD HH:mm:ss")}</h4> 


        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            {/* จำนวน */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="จำนวน"
                name="RequisitionQuantity"
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

            {/* บันทึกช่วยจำ */}
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

            {/* ชื่อผู้เบิก */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
                label="บันทึกช่วยจำ"
                name="Note"
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}></Col>
            <Col span={24} style={{ textAlign: "end", alignSelf: "center" }} xs={24} sm={24} md={12} lg={12} xl={12}>
              <Space size="middle">
                <div className="form-buttons">
                  <Link to="/Equipments">
                    <button type="button" className="cancel">ยกเลิก</button>
                  </Link>
                  <button type="reset" className="reset">รีเซต</button>
                  <button type="submit" className="submit">ตกลง</button>
                </div>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default RequisitionCreate;