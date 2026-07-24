export interface DashboardSummary {
  revenueToday: { value: number; currency: string };
  revenueThisMonth: { value: number; currency: string };
  revenueGrowth: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalUsers: number;
  newUsersThisMonth: number;
  activeMovies: number;
  avgOccupancyRate: number;
  foodRevenueToday: { value: number; currency: string };
  topMovie: { id: string; title: string; revenue: number; bookings: number } | null;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  ticketRevenue: number;
  foodRevenue: number;
  count: number;
}

export interface RevenueResponse {
  groupBy: string;
  dataPoints: RevenueDataPoint[];
}

export interface BookingStat {
  status: string;
  count: number;
}

export interface BookingByDay {
  date: string;
  total: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  expired: number;
}

export interface BookingResponse {
  byStatus: BookingStat[];
  byDay: BookingByDay[];
  avgTicketPrice: number;
  totalRevenue: number;
}

export interface UserStat {
  role: string;
  count: number;
}

export interface UserRegistration {
  date: string;
  count: number;
}

export interface UserResponse {
  byRole: UserStat[];
  registrations: UserRegistration[];
  activeUsersLast30Days: number;
}

export interface MoviePerformance {
  id: string;
  title: string;
  language: string;
  status: string;
  totalShowtimes: number;
  totalBookings: number;
  totalRevenue: number;
  totalSeatsSold: number;
  avgRevenuePerBooking: number;
}

export interface FoodCategoryStat {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface FoodItemStat {
  id: string;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

export interface FoodBeverageResponse {
  totalItemsSold: number;
  totalRevenue: number;
  byCategory: FoodCategoryStat[];
  topItems: FoodItemStat[];
}

export interface OccupancyOverall {
  totalCapacity: number;
  totalOccupied: number;
  occupancyRate: number;
  totalShowtimes: number;
}

export interface OccupancyDetail {
  id?: string;
  title?: string;
  name?: string;
  city?: string;
  capacity: number;
  occupied: number;
  occupancyRate: number;
  showtimes: number;
}

export interface OccupancyHour {
  hour: number;
  capacity: number;
  occupied: number;
  occupancyRate: number;
  showtimes: number;
}

export interface OccupancyResponse {
  overall: OccupancyOverall;
  byMovie: OccupancyDetail[];
  byTheater: OccupancyDetail[];
  byHour: OccupancyHour[];
}

export interface PeakTime {
  hour?: number;
  count: number;
}

export interface PeakDay {
  day: string;
  dayIndex: number;
  count: number;
}

export interface PeakTimesResponse {
  byHour: PeakTime[];
  byDayOfWeek: PeakDay[];
  peakHour: number;
  peakDay: number;
  totalBookings: number;
}

export interface AnalyticsEventItem {
  id: string;
  name: string;
  category: string | null;
  label: string | null;
  value: number | null;
  metadata: Record<string, unknown> | null;
  accountId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  sessionId: string | null;
  pageUrl: string | null;
  source: string;
  createdAt: string;
  account?: { email: string } | null;
}

export interface AnalyticsEventListResponse {
  data: AnalyticsEventItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventSummary {
  total: number;
  topEvents: { name: string; count: number }[];
  bySource: { source: string; count: number }[];
}
