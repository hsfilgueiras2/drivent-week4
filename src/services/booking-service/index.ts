import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBookingByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError();

  const result = await bookingRepository.findByUserId(userId);
  if (!result) throw notFoundError();
  return result;
}

async function createBooking(userId: number, roomId: number) {
  await validityCheck(userId, roomId);

  const data = { userId, roomId };
  const newBooking = await bookingRepository.createBooking(data);
  const body = { bookingId: newBooking.id };

  return body;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await validityCheck(userId, roomId);

  const booking = await bookingRepository.belongToUser(bookingId, userId);
  if (!booking) throw forbiddenError();

  const result = await bookingRepository.updateBookingRoomById(bookingId, roomId);
  const body = { bookingId: result.id };
  return body;
}

async function validityCheck(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError();
  
  const notPaid = (ticket.status !== "PAID");
  const isRemote = (ticket.TicketType.isRemote);
  const noHotel = (!ticket.TicketType.includesHotel);
  if (notPaid || isRemote || noHotel) throw forbiddenError();

  const room = await roomRepository.findById(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length === room.capacity) throw forbiddenError();
}

const bookingService = {
  getBookingByUserId,
  createBooking,
  updateBooking
};

export default bookingService;
