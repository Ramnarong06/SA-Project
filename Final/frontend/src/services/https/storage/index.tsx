//import { UsersInterface } from "../../interfaces/IUser";

//import { SignInInterface } from "../../interfaces/SignIn";

import axios from "axios";


/**/
//import { EquipmentInterface } from "../../interfaces/IEquipment";
import { EquipmentInterface } from "../../../interfaces/storage/IEquipment";
import { RestockInterface } from "../../../interfaces/storage/IRestock";
import { RequisitionInterface } from "../../../interfaces/storage/IRequisition";



const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};

async function GetEquipments() {

  return await axios

    .get(`${apiUrl}/equipments`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetEquipmentById(id: string) {

  return await axios

    .get(`${apiUrl}/equipment/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetEquipmentsLittle() {

  return await axios

    .get(`${apiUrl}/equipments/lowstock`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateEquipment(data: EquipmentInterface) {

  return await axios

    .post(`${apiUrl}/createEq`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

/*async function UpdateEquipmentById(id: string, data: EquipmentInterface) {

  return await axios

    .put(`${apiUrl}/equipment/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}*/

async function UpdateEquipmentById(id: string, data: EquipmentInterface) {
  try {
    const response = await axios.put(`${apiUrl}/equipment/${id}`, data, requestOptions);
    return response; // ส่งคืนการตอบสนองทั้งหมด
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // จัดการข้อผิดพลาดจาก axios
      return {
        status: error.response?.status || 500,
        data: error.response?.data || { error: 'Unknown error occurred' }
      };
    }
    // จัดการข้อผิดพลาดอื่นๆ
    return {
      status: 500,
      data: { error: 'Unexpected error occurred' }
    };
  }
}

async function DeleteEquipmentById(id: string) {

  return await axios

    .delete(`${apiUrl}/equipment/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetRequisitions() {

  return await axios

    .get(`${apiUrl}/requisitions`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateRequisition(data: RequisitionInterface) {

  return await axios

    .patch(`${apiUrl}/requisitions`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetRestocks() {

  return await axios

    .get(`${apiUrl}/restocks`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateRestock(data: RestockInterface) {

  return await axios

    .patch(`${apiUrl}/restocks`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

export {

  GetEquipments,
  GetEquipmentById,
  CreateEquipment,
  UpdateEquipmentById,
  DeleteEquipmentById,
  GetEquipmentsLittle,

  GetRequisitions,
  CreateRequisition,

  GetRestocks,
  CreateRestock,
  
};