import { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
//import { GetRestocks } from "../../services/https/index";
import { GetRestocks } from "../../../services/https/storage/index";
import "./Restocks.css"; // Import the CSS file
//import { RestockInterface } from "../../interfaces/IRestock";
import { RestockInterface } from "../../../interfaces/storage/IRestock";
import new_logo from "../../../assets/new_logo.jpg";
import restocks from "../../../assets/restocks.jpg";

function Restocks() {
  //const navigate = useNavigate();
  const [Restocks, setRestocks] = useState<RestockInterface[]>([]);
  const [messageApi] = message.useMessage();

  
  const [modal, contextHolder] = Modal.useModal();
  

  const columns: ColumnsType<RestockInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      align: 'center',
    },
    {
      title: "ชื่ออุปกรณ์",
      dataIndex: "EquipmentName",
      key: "equipment_name",
      align: 'center',
    },
    {
      title: "จำนวน",
      dataIndex: "RestockQuantity",
      key: "restock_quantity",
      align: 'center',
    },
    {
      title: "รับเข้า",
      dataIndex: "ReceivingDate",
      key: "receiving_date",
      align: 'center',
    },
    {
      title: "ชื่อผู้เติม",
      dataIndex: "EmployeeName",
      key: "employee_name",
      align: 'center',
    },
  ];


  const getRestocks = async () => {
    try {
      let res = await GetRestocks();
      if (res.status === 200) {
        setRestocks(res.data);
      } else {
        setRestocks([]);
        messageApi.open({
          type: "error",
          content: res.data.error || "Error fetching data",
        });
      }
    } catch (error: any) {  // แปลง error เป็น any เพื่อให้เข้าถึง property ต่างๆ
      console.error("Error fetching equipment:", error);
      
      // ตรวจสอบและแสดงข้อผิดพลาดที่สมบูรณ์
      messageApi.open({
        type: "error",
        content: error?.message || error?.response?.data?.error || "Unexpected error occurred",
      });
    }
  };
  
  useEffect(() => {
    getRestocks();
  }, []);


  return (
    <>
      {contextHolder}
      <div className="logo-container">
          <img
            src={new_logo} // replace with the correct path to your logo
            alt="logo"
            className="logo"
          />
      </div>

      <Row align="top">
        <Col>
          <div className="logo-icon">
            <img src={restocks} alt="logo" style={{ marginTop: '-35px', width: '108px', marginLeft: '0px', /* ขยับไปทางขวา */}} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={9} lg={9}>
          <h1 style={{ marginTop: '-12px'}}>รายการเติมสำเร็จ</h1>
        </Col>
        <Divider style={{ marginTop: '-35px', marginBottom: '30px' }}  />
      </Row>

      <Row style={{ marginBottom: 1 }}>
        <Col span={24} style={{ textAlign: "end", alignSelf: "center" }}>
        </Col>
      </Row>

      <div style={{ marginTop: 1 }}>
        <Table rowKey="ID" columns={columns} dataSource={Restocks} style={{ width: "95%", margin: "0 auto" }} 
        pagination={{ pageSize: 5 }} 
        scroll={{ x: 1000 }}/>
      </div>
    </>
  );
}

export default Restocks;