import { prisma } from "@/config";

async function findById(id: number) {
  return await prisma.room.findUnique({
    where: { id },
    include: { Booking: true }
  });
}

const roomRepository = {
  findById
};

export default roomRepository;
