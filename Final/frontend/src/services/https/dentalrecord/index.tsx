import { UsersInterface } from "../../interfaces/IUser";
import { DentalRecordInterface } from "../../interfaces/IDentalRecord";
import { TreatmentsInterface } from "../../interfaces/ITreatment";
import { PatientsInterface } from "../../interfaces/IPatient";

const apiUrl = "http://localhost:8000";

// User related functions
async function GetUsers() {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch users:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function GetGenders() {
  try {
    const response = await fetch(`${apiUrl}/genders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch genders:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching genders:", error);
    return [];
  }
}

async function DeleteUserByID(id: number | undefined) {
  if (id === undefined) {
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

async function GetUserById(id: number | undefined) {
  if (id === undefined) {
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch user:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  }
}

async function CreateUser(data: UsersInterface) {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to create user:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

async function UpdateUser(data: UsersInterface) {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to update user:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

// DentalRecord related functions
async function GetDentalRecords() {
  try {
    const response = await fetch(`${apiUrl}/dental_records`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch dental records:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching dental records:", error);
    return [];
  }
}

async function DeleteDentalRecordByID(id: number | undefined) {
  if (id === undefined) {
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/dental_record/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting dental record:", error);
    return false;
  }
}

async function CreateDentalRecord(data: DentalRecordInterface) {
  try {
    const response = await fetch(`${apiUrl}/dental_records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to create dental record:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error creating dental record:", error);
    return false;
  }
}

async function UpdateDentalRecord(data: DentalRecordInterface) {
  try {
    const response = await fetch(`${apiUrl}/dental_record/${data.ID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to update dental record:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error updating dental record:", error);
    return false;
  }
}

// services/https.ts

// Function to get all treatments
async function GetTreatment(): Promise<TreatmentsInterface[]> {
  try {
    const response = await fetch(`${apiUrl}/treatments`, { // ตรวจสอบ URL ที่ถูกต้อง
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch treatments:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return [];
  }
}

// Function to get all patients
async function GetPatients(): Promise<PatientsInterface[]> {
  try {
    const response = await fetch(`${apiUrl}/patients`, { // ตรวจสอบ URL ที่ถูกต้อง
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch patients:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}


export {
  GetUsers,
  CreateUser,
  GetGenders,
  DeleteUserByID,
  GetUserById,
  UpdateUser,
  GetDentalRecords,
  DeleteDentalRecordByID,
  CreateDentalRecord,
  UpdateDentalRecord,
  GetTreatment,
  GetPatients
};
