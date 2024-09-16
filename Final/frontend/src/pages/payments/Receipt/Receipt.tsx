import React from 'react';
import jsPDF from 'jspdf';
//import 'jspdf-autotable';

// import { ReceiptInterface } from '../../interfaces/interfaceReceipt';
// import { GetReceiptByID } from '../../services/https';
// import { useState, useEffect  } from 'react';
// import { Modal,message  } from 'antd';
//import { PaymentDentalRecordInterface } from '../../interfaces/interfacePaymentDentalRecoed';
import { PaymentDentalRecordInterface } from '../../../interfaces/IPaymentDentalRecord';
//import { ReceiptInterface } from '../../interfaces/interfaceReceipt';
import { ReceiptInterface } from '../../../interfaces/IReceipt';


export const generatePDF = async ( payment: PaymentDentalRecordInterface ,receipt:ReceiptInterface) => {

  // const name = "l6ou"
  // const RID = ID
    const doc = new jsPDF({
        orientation: 'portrait', // กำหนดทิศทางของเอกสารเป็นแนวตั้ง (หรือแนวนอนก็ได้)
        unit: 'mm', // หน่วยเป็นมิลลิเมตร
        format: [148, 210], // ขนาดกำหนดเอง กว้าง 148 mm สูง 210 mm (A5)
    });

    try {
      // โหลดฟอนต์ปกติ (THSarabunNew.ttf)
      const fontUrl = '/THSarabunNew.ttf';
      const fontResponse = await fetch(fontUrl);

      if (!fontResponse.ok) {
          throw new Error(`HTTP error! status: ${fontResponse.status}`);
      }

      const fontData = await fontResponse.arrayBuffer();
      const fontBase64 = arrayBufferToBase64(fontData);
      doc.addFileToVFS('THSarabunNew.ttf', fontBase64);
      doc.addFont('THSarabunNew.ttf', 'THSarabun', 'normal');

      // โหลดฟอนต์ตัวหนา (THSarabunNew-Bold.ttf)
      const fontBoldUrl = '/THSarabunNew Bold.ttf';
      const fontBoldResponse = await fetch(fontBoldUrl);

      if (!fontBoldResponse.ok) {
          throw new Error(`HTTP error! status: ${fontBoldResponse.status}`);
      }

      const fontBoldData = await fontBoldResponse.arrayBuffer();
      const fontBoldBase64 = arrayBufferToBase64(fontBoldData);
      doc.addFileToVFS('THSarabunNew-Bold.ttf', fontBoldBase64);
      doc.addFont('THSarabunNew-Bold.ttf', 'THSarabun', 'bold');

     

        // โลโก้
        const imgData = '/logo.jpg'; // URL จากpublic
        doc.addImage(imgData, 'JPG', 8,5, 15, 10);
        doc.setFontSize(8);
        // ที่อยู่บริษัท
        doc.setFont('THSarabun', 'normal');
        doc.text('111, ถนน มหาวิทยาลัย ตำบล สุรนารี อำเภอเมืองนครราชสีมา นครราชสีมา 30000',5,18);
        
        // หัวเรื่อง ใบเสร็จรับเงิน
        doc.setFont('THSarabun', 'bold');
        doc.setFontSize(30);
        doc.text('ใบเสร็จรับเงิน',140,15, { align: 'right' });
        doc.line(100,16,140,16);
        //เราใช้ doc.line(x1, y1, x2, y2) เพื่อวาดเส้นใต้ โดย
        // x1, y1: ตำแหน่งเริ่มต้นของเส้น
        // x2, y2: ตำแหน่งสิ้นสุดของเส้น

        // วันที่
        doc.setFont('THSarabun', 'normal');
        doc.setFontSize(12);
        doc.text(`วันที่ ${payment.Date2}`, 135, 35, { align: 'right' });
        doc.line(120,36,135,36);
        //doc.text('2025-08-02', 135, 35, { align: 'right' });

        // ข้อมูลลูกค้า
        doc.text(`ชื่อ: ${payment.FirstName} ${payment.LastName}`,12, 35);
        //doc.text(name + " "+'สุขขี', 15, 35);

        (doc as any).autoTable({
            startY: 40,
            //head: [['ลำดับ', 'รายการ', 'จำนวนเงิน']],
            body: [
              ['ลำดับ', 'รายการ', 'จำนวนเงิน'],
     
  
            ],
            styles: {
                font: 'THSarabun',
                fontStyle: 'bold',
                fontSize: 10.5,
            },
            /*headStyles: {
              halign: 'center', // ทำให้ข้อความในหัวตารางทั้งหมดชิดขวา
          },*/
            columnStyles: {
            0: { cellWidth: 15 }, // Width for the first column (ลำดับ)
            1: { cellWidth: 90, overflow: 'linebreak',halign: 'center' }, // Width for the second column (รายการ), with line wrapping
            2: { cellWidth:15, halign: 'center' }, // Width for the third column (จำนวนเงิน), right-aligned
            },
            theme: 'plain',
            tableLineWidth: 0.1,
            tableLineColor: [0, 0, 0],
        });

        // ตาราง
        (doc as any).autoTable({
          startY: 40,
          //head: [['ลำดับ', 'รายการ', 'จำนวนเงิน']],
          body: [
            ['','',''],
            ['1', `${payment.Description}`, `${payment.PrintFees}`],
            ['', '', ''],
            ['', '', ''],
          ],
          styles: {
              font: 'THSarabun',
              fontSize: 10,
          },
          /*headStyles: {
            halign: 'center', // ทำให้ข้อความในหัวตารางทั้งหมดชิดขวา
        },*/
          columnStyles: {
            0: { cellWidth: 15 }, // Width for the first column (ลำดับ)
            1: { cellWidth: 90, overflow: 'linebreak',halign: 'center' }, // Width for the second column (รายการ), with line wrapping
            2: { cellWidth: 15, halign: 'center' }, // Width for the third column (จำนวนเงิน), right-aligned
              //0: { fontSize: 14, },

          },
        //   plain
          theme: 'plain',
          tableLineWidth: 0.2,
          tableLineColor: [0, 0, 0],
      });
      const secondTableY = (doc as any).lastAutoTable.finalY;
      (doc as any).autoTable({
        startY: secondTableY+0.2,
        //head: [['ลำดับ', 'รายการ', 'จำนวนเงิน']],
        body: [
          ['', 'รวมเป็นเงิน', ` ${payment.PrintFees} บาท`],
       

        ],
        styles: {
          fontStyle: 'bold',
          font: 'THSarabun',
          fontSize: 12,
          // Light lavender background for the cells
        },
        /*headStyles: {
          halign: 'center', // ทำให้ข้อความในหัวตารางทั้งหมดชิดขวา
      },*/
        columnStyles: {
        0: { cellWidth: 15, halign: 'right', tableLineWidth: 0  }, // Right-align for the first column
        1: { cellWidth: 85, halign: 'right', overflow: 'linebreak', tableLineWidth: 0  }, // Right-align for the second column
        2: { cellWidth: 19.8, halign: 'right', overflow: 'linebreak', fillColor: [230, 230, 250] }, // จัดข้อความในคอลัมน์ที่สามชิดขวาและให้สีพื้นหลังเป็นสีลาเวนเดอร์อ่อน
        },
        theme: 'plain',
        tableLineWidth: 0,
    });
   
    // // วาดเส้นใต้ในตาราง
    //     const finalY = (doc as any).lastAutoTable.finalY;
    //     const startX = 10; // ตำแหน่งเริ่มต้นของเส้น X
    //     const endX = 190; // ตำแหน่งสิ้นสุดของเส้น X
    //     const yPosition = finalY + 10; // ตำแหน่ง Y ของเส้นใต้

    //     // วาดเส้นใต้
    //     doc.line(startX, yPosition, endX, yPosition);
        // doc.setFontSize(17);
        // doc.text('รวมเป็นเงิน', 155, 236);
        // doc.text('18000.00', 195, 236, { align: 'right' });

        // ข้อมูลเพิ่มเติมและลายเซ็น
        doc.setFontSize(12);
        doc.text(`ทันตแพทย์: ${payment.Efirstname} ${payment.Elastname}`, 10, secondTableY+20);
        doc.text(`ผู้รับเงิน: ${receipt.Pefirst_name} ${receipt.Pelast_name}`, 65, secondTableY+20, { align: 'right' });



        // เปิด PDF ในแท็บใหม่
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error loading font:', error);
    }
};

// ฟังก์ชันเพื่อแปลง ArrayBuffer เป็น Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const Receipt: React.FC = () => {
  
    return (
        <div>
            {/* <h1>Receipt</h1>
            <button onClick={generatePDF}>Generate PDF</button> */}
        </div>
    );
};

export default Receipt;
