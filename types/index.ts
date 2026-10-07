export interface Patient {
    _id: string;
    name: string;
    gender: "Male" | "Female" | "Other";
    age: number;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    _id: string;
    patientId: {
        _id: string;
        name: string;
        gender: string;
        age: number;
        phone: string;
    };
    doctorName: string;
    appointmentDate: string;
    status: "Scheduled" | "Completed";
    createdAt: string;
    updatedAt: string;
}