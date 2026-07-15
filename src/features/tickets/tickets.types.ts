export type TicketStatus = "ACTIVE" | "USED" | "REFUNDED" | "EXPIRED";

export interface Ticket {
  id: string;
  bookingId: string;
  bookingSeatId: string;
  accountId: string;
  qrCode: string;
  status: TicketStatus;
  validatedAt: string | null;
  validatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  booking: {
    bookingCode: string;
    totalPrice: number;
    status: string;
    account?: {
      id: string;
      email: string;
      profile?: {
        firstName: string;
        lastName: string;
      } | null;
    };
    showtime: {
      startTime: string;
      movie: {
        title: string;
        durationMinutes: number;
        language: string;
        poster: { url: string } | null;
      };
      screen: {
        name: string;
        type: string;
        theater: {
          name: string;
          location: string;
        };
      };
    };
  };
  bookingSeat: {
    seat: {
      seatRow: string;
      seatNumber: number;
      seatType: string;
    };
    price: number;
  };
}
