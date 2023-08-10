export interface Doctor {
  _id?: string;
  first_name: string;
  second_name: string;
  position: string;
  description: string;
  appointmentDays: string | string[];
  timeSchedule: string;
  avatar: any;
  createdAt: string;
}
