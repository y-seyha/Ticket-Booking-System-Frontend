import { apiRequest } from "@/lib/config/axios";
import { Ticket, TicketStatus } from "./tickets.types";

export const ticketsApi = {
  getMyTickets: (status?: TicketStatus) =>
    apiRequest<Ticket[]>(
      "get",
      `/tickets${status ? `?status=${status}` : ""}`,
    ),

  getTicketById: (id: string) =>
    apiRequest<Ticket>("get", `/tickets/${id}`),

  getTicketsByBooking: (bookingId: string) =>
    apiRequest<Ticket[]>("get", `/tickets/booking/${bookingId}`),

  lookupByQrCode: (qrCode: string) =>
    apiRequest<Ticket>("get", `/tickets/qr/${qrCode}`),

  validateTicket: (qrCode: string) =>
    apiRequest<Ticket>("post", `/tickets/validate`, { qrCode }),
};
