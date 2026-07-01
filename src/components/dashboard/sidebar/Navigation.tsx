import {
  LayoutDashboard,
  Film,
  Building2,
  Tv,
  Grid3X3,
  DollarSign,
  Calendar,
  Ticket,
  CreditCard,
  RefreshCw,
  Users,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  PieChart,
  Settings,
  User,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export interface SidebarItemType {
  title: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export interface SidebarGroupType {
  title: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  items: SidebarItemType[];
}

export const navigationConfig: SidebarGroupType[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Cinema Management",
    items: [
      { title: "Movies", href: "/admin/cinema/movies", icon: Film },
      { title: "Theaters", href: "/admin/cinema/theaters", icon: Building2 },
      { title: "Screens", href: "/admin/cinema/screens", icon: Tv },
      {
        title: "Seat Templates",
        href: "/admin/cinema/seat-templates",
        icon: Grid3X3,
      },
      {
        title: "Seat Pricing",
        href: "/admin/cinema/seat-pricing",
        icon: DollarSign,
      },
      { title: "Showtimes", href: "/admin/cinema/showtimes", icon: Calendar },
    ],
  },
  {
    title: "Booking Management",
    items: [
      { title: "Bookings", href: "/admin/bookings", icon: Ticket },
      { title: "Payments", href: "/admin/bookings/payments", icon: CreditCard },
      { title: "Refunds", href: "/admin/bookings/refunds", icon: RefreshCw },
    ],
  },
  {
    title: "Customer Management",
    items: [
      { title: "Users", href: "/admin/customers/users", icon: Users },
      {
        title: "Roles & Permissions",
        href: "/admin/customers/roles",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Reports & Analytics",
    items: [
      { title: "Revenue", href: "/admin/reports/revenue", icon: TrendingUp },
      { title: "Sales Report", href: "/admin/reports/sales", icon: BarChart3 },
      {
        title: "Occupancy Report",
        href: "/admin/reports/occupancy",
        icon: PieChart,
      },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", href: "/admin/system/settings", icon: Settings },
      { title: "Profile", href: "/admin/system/profile", icon: User },
    ],
  },
];
