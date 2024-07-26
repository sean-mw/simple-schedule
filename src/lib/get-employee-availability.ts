import { EmployeeWithAvailability } from "@/components/EmployeeAvailability";
import { Availability, Employee } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

async function getEmployeeAvailability(
  token?: string
): Promise<EmployeeWithAvailability[]> {
  const employyeesParams = token ? { token } : {};
  const employeesResponse: AxiosResponse<Employee[]> = await axios.get(
    "/api/employees",
    {
      params: employyeesParams,
    }
  );

  const availabilitiesParams = token
    ? { email: employeesResponse.data[0].email }
    : {};
  const availabilitiesResponse: AxiosResponse<
    { email: string; availabilities: Availability[] }[]
  > = await axios.get("/api/availabilities", {
    params: availabilitiesParams,
  });

  const employeesData = employeesResponse.data.map((employee) => ({
    ...employee,
    availabilities: availabilitiesResponse.data
      .filter((ar) => ar.email === employee.email)
      .flatMap((ar) => {
        return ar.availabilities.map((availability) => ({
          ...availability,
          day: new Date(availability.day),
          startTime: new Date(availability.startTime),
          endTime: new Date(availability.endTime),
        }));
      }),
  }));

  return employeesData;
}

export default getEmployeeAvailability;
