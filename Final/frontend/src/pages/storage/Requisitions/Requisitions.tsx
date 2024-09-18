import { useState, useEffect } from "react";
import {Table, Col, Row, Divider, message} from "antd";
import type { ColumnsType } from "antd/es/table";
//import { GetRequisitions} from "../../services/https/index";
import { GetRequisitions} from "../../../services/https/storage";
//import { RequisitionInterface } from "../../interfaces/IRequisition";
import { RequisitionInterface } from "../../../interfaces/storage/IRequisition";
import "./Requisitions.css"; // Import the CSS file
import new_logo from "../../../assets/new_logo.jpg";
import requisitionss from "../../../assets/requisitionss.jpg";

function Requisition() {
  //const navigate = useNavigate();
  const [equipments, setRequisitions] = useState<RequisitionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<RequisitionInterface> = [
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
      dataIndex: "RequisitionQuantity",
      key: "requisition_quantity",
      align: 'center',
    },
    {
      title: "วันเวลาที่เบิก",
      dataIndex: "Time",
      key: "time",
      align: 'center',
    },
    {
      title: "บันทึกช่วยจำ",
      dataIndex: "Note",
      key: "note",
      align: 'center',
    },
    {
      title: "ชื่อผู้เบิก",
      dataIndex: "EmployeeName",
      key: "employee_name",
      align: 'center',
    },
  ];

  const getRequisitions = async () => {
    let res = await GetRequisitions();
    if (res.status === 200) {
      setRequisitions(res.data);
    } else {
      setRequisitions([]);
    }
    };
      useEffect(() => {
      getRequisitions();
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
            <img src={requisitionss} alt="logo" style={{ marginTop: '-35px', width: '108px', marginLeft: '0px', /* ขยับไปทางขวา */}} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={9} lg={9}>
          <h1 style={{ marginTop: '-12px'}}>รายการเบิก</h1>
        </Col>
        <Divider style={{ marginTop: '-40px', marginBottom: '30px' }}  />
      </Row>


      {/*<Row style={{ marginBottom: 12 }}>
      <Col span={1}></Col>
      <Col span={22}>
      <Search
        placeholder="ค้นหาชื่ออุปกรณ์" 
        onSearch={onSearch} 
        enterButton 
        style={{ maxWidth: 300, backgroundColor: "#ffffff", borderColor: "#42C2C2" }} 
        className="custom-search"
      />
      </Col>*/}
    
      <div style={{ marginTop: 1 }}>
        <Table rowKey="ID" columns={columns} dataSource={equipments} style={{ width: "95%", margin: "0 auto" }} pagination={{ pageSize:5 }} 
        scroll={{ x: 1000 }} />
      </div>

    </>
  );
}

export default Requisition;