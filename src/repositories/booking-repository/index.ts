import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId },
    select: { 
      id: true,
      Room: true 
    },
  });
}

async function belongToUser(id: number, userId: number) {
  return await prisma.booking.findFirst({
    where: { id, userId }
  });
}

async function createBooking(booking: CreateBookingParams) {
  return await prisma.booking.create({
    data: booking
  });
}

async function updateBookingRoomById(id: number, roomId: number) {
  return await prisma.booking.update({
    where: { id },
    data: { roomId }
  });
}
export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">

const bookingRepository = {
  findByUserId,
  belongToUser,
  createBooking,
  updateBookingRoomById
};

export default bookingRepository;
