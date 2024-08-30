// src/App.tsx
import React from 'react';
//import logo from '../assets/TestLogo.png'
import './AppEq.css';
import logo2 from "../../assets/new_logo.jpg";
//import logo from '../assets/new_logo.jpg'

const AddEq: React.FC = () => {
  return (
    <div className="containerE">
      <main className="main-contentE">
        <section className="contentE">
        {/* <div className="container2">
           <img src={logo2} alt="Logo" />
        </div> */}
        <form className="formh">
        <div className="label1">เพิ่มอุปกรณ์</div>
        </form>
          <form className="form">
            <div className="form-row">
              <div className="form-group">
                <label>รหัส*</label>
                <input type="text" />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>หน่วย*</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>ชื่ออุปกรณ์*</label>
                <input type="text" />
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
                <label>จำนวน*</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>ต้นทุน/หน่วย (บาท)*</label>
                <input type="text" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>วันรับเข้า*</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>วันหมดอายุ*</label>
                <input type="date" />
              </div>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancel">ยกเลิก</button>
              <button type="button" className="reset">รีเซต</button>
              <button type="submit" className="submit">ตกลง</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddEq;