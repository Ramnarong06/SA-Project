
import { SchedulesInterface } from "../../interfaces/ISchedule";
import { PaymentInterface } from "../../interfaces/IPayment";
const apiUrl = "http://localhost:8000";
import axios from 'axios';
//
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

async function GetUsers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/users`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetPatients() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/patients`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetTreatment() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/treatments`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function DeleteUserByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE"
  };

  let res = await fetch(`${apiUrl}/users/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}
//
async function GetSchedulesByDate(date: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/getschedulebydate/${date}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

//
async function GetUserById(id: Number | undefined) {
  const requestOptions = {
    method: "GET"
  };

  let res = await fetch(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}
//
async function GetScheduleById(id: Number | undefined) {
  const requestOptions = {
    method: "GET"
  };

  let res = await fetch(`${apiUrl}/schedule/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function CreateSchedule(data: SchedulesInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/schedules`, requestOptions)
    .then((res) => {
      if (res.status == 201) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}



async function UpdateSchedule(data: SchedulesInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/updateschedules`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function UpdateScheduleStatus(id: Number | undefined) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(id),
  };

  let res = await fetch(`${apiUrl}/updateschedulestatus/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}
////////////////
const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};

async function GetAllDentalRecord() {
    return await axios

    .get(`${apiUrl}/api/record`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function UpdateDentalRecord(id:string) {
    return await axios

    .put(`${apiUrl}/uprecord/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetDentalRecordByID(id: string ) {

    return await axios
  
      .get(`${apiUrl}/api/PaymentRecord/${id}`, requestOptions)
  
      .then((res) => res)
  
      .catch((e) => e.response);
  }

async function GetReceiptByID(id:any) {
  return await axios
  
    .get(`${apiUrl}/api/Receipt/${id}`, requestOptions)
  
    .then((res) => res)
  
    .catch((e) => e.response);
}

async function GetSavePayment() {
  return await axios

    .get(`${apiUrl}/api/SaveRecord`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับการสร้าง Payment ใหม่
async function CreatePayment(data:PaymentInterface) {
  return await axios
    .post(`${apiUrl}/api/newPayment`,data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับการอัปเดต DentalRecord ด้วย PaymentID ใหม่
async function UpdateDentalRecordPayment(id: any, paymentID: any) {
  return await axios
    .put(`${apiUrl}/api/uprecordpay/${id}`, { paymentID: paymentID }, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetUsers,
  
  GetGenders,
  DeleteUserByID,
  GetUserById,
  
  GetTreatment,
  CreateSchedule,
  GetSchedulesByDate,
  UpdateScheduleStatus,
  UpdateSchedule,
  GetScheduleById,
  GetPatients,

  //
  GetAllDentalRecord,
    GetDentalRecordByID,
    GetReceiptByID,
    GetSavePayment,
    CreatePayment,
    UpdateDentalRecord,
    UpdateDentalRecordPayment,
};