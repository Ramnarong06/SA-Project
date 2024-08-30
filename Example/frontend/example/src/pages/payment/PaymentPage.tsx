// src/PaymentPage.tsx
import React, { useState } from 'react';
import './Payment.css';
import logo from '../../assets/new_logo.jpg'

const PaymentPage: React.FC = () => {
  const [amountToPay, setAmountToPay] = useState<number>(180000);
  const Name = 'สมหญิง สุขขี';

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToPay(parseFloat(event.target.value));
  };

  const handlePayNow = () => {
    alert(`Paying ${amountToPay.toLocaleString()} บาท`);
  };

  return (
    <div className="payment-page">
        <img className='logocenter' src={logo}/>
      <h2 className="page-title">ชำระเงิน</h2>
      <div className="content-container">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="patient-info">
            <p><strong>คุณ:</strong> {Name}</p>
            <p><strong>เพศ:</strong> หญิง</p>
            <p><strong>อายุ:</strong> 50</p>
            <p><strong>โทร:</strong> 061-000-0000</p>
            <p><strong>หมู่เลือด:</strong> โอ</p>
          </div>
          <div className="medical-info">
            <h3>โรคประจำตัว</h3>
            <ul>
              <li>ความดัน</li>
            </ul>
          </div>
          <div className="allergy-section">
            <h3>ประวัติแพ้ยา</h3>
            <ul>
              <li>ยาช่าเขียว</li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <table className="payment-table">
            <thead>
              <tr>
                <th>รายการ</th>
                <th>ทันตแพทย์</th>
                <th>วันที่</th>
                <th>ราคา</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ผู้ป่วยมีอาการปวดฟันอย่างรุนแรง</td>
                <td>น.พ. สุข ใจดี</td>
                <td>2025-06-22</td>
                <td>18,000</td>
              </tr>
            </tbody>
          </table>
          <div className="payment-summary">
            <div className="summary-item total">
              <p className="summary-title">ค่าใช้จ่าย</p>
              <p className="summary-value">รวม 180000.00 บาท</p>
            </div>
            <div className="summary-item installment">
              <p className="summary-title">ผ่อนจ่าย</p>
              <p className="summary-title">50000.00 บาท</p>
              <p className="summary-value"> งวด 1/6 งวด</p>
            </div>
          </div>
          <div className="payment-action">
            <button className="pay-button" onClick={handlePayNow}>
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
