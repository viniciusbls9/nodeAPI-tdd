import { describe, test, expect } from "vitest";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

describe("Create Appointment", () => {
  test("should be able to create an appointment", () => {
    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-11");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt,
        endsAt,
      })
    ).resolves.toBeInstanceOf(Appointment);
  });

  test("should not be able to create an appointment with overlapping dates", async () => {
    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-15");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    await createAppointment.execute({
      customer: "John Doe",
      startsAt,
      endsAt,
    });

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-08-14"),
        endsAt: getFutureDate("2022-08-18"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-08-08"),
        endsAt: getFutureDate("2022-08-17"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
