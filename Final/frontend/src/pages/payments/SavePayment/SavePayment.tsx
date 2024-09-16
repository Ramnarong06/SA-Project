// src/components/PaymentList.tsx
import React from 'react';
import './SavePayment.css';
import logo from '../assets/logo.jpg'
import {useNavigate} from 'react-router-dom'; 
//import Nologo from '../../assets/nologo.png';
//import { SavePaymentInterface } from '../../interfaces/InterfaceSavePayment';
import { SavePaymentInterface } from '../../../interfaces/ISavePayment';
import { useState, useEffect } from "react";
import { message } from "antd";
import { GetSavePayment } from '../../../services/https';

const SavePayment: React.FC = () => {
  const navigate = useNavigate();

  const [SaveRecord, setSaveRecord] = useState<SavePaymentInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();  

  /*const Clist =  () =>{
    navigate('/paymentPage');
  };*/

  const getSavePayment = async () => {
    let res = await GetSavePayment();
    if (res.status == 200) {
      setSaveRecord(res.data);  // Store the fetched data in the 'record' state
    } else {
      setSaveRecord([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // Use useEffect to fetch the data when the component mounts
  useEffect(() => {
    getSavePayment();
  // Set up an interval to fetch data every 5 seconds (5000 ms)
  const interval = setInterval(() => {
    getSavePayment(); // Refresh data every 5 seconds
  }, 5000);

  // Clean up the interval when the component unmounts
  return () => clearInterval(interval);
  }, []);

  return (
    <div className='savepayment-page'>
      <div className="saveheader">
        
        <h2 className='savecolor'>บันทึกชำระเงิน</h2>
      </div>
      <div>
      <table className="savepaymentlist-table">
        <thead>
          <tr className='savecolor'>
            <th>ชื่อ</th>
            <th>อายุ</th>
            <th>จำนวนเงิน</th>
            <th>งวด</th>
            <th>วิธีชำระ</th>
            <th>วันที่</th>
            <th>สถานะ</th>
            <th>ผู้รับเงิน</th>
          </tr>
        </thead>
        <tbody>
        {SaveRecord.map((rec) => (
          <tr key={rec.ID} className='savecolor'> 
            <td>{rec.FirstName} {rec.LastName}</td>
            <td>{rec.Age}</td>
            <td>{rec.PrintFees}</td>
            <td>{rec.NumberOfInstallment}</td>
            <td>{rec.MethodName}</td>
            <td>{rec.Date}</td>
            <td><span className="savestatus pending">{rec.StatusName}</span></td>
            <td>{rec.Efirst_name} {rec.Elast_name}</td>
          </tr>
           ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default SavePayment;
