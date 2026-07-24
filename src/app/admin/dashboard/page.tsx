'use client';

import { usePageTitle } from '@/hooks/usePageTitle';
import { StatCard } from '@/features/analytics/components/StatCard';
import { RevenueChart } from '@/features/analytics/components/RevenueChart';
import { BookingPieChart } from '@/features/analytics/components/BookingPieChart';
import { MoviePerformanceTable } from '@/features/analytics/components/MoviePerformanceTable';
import { DateRangePicker } from '@/features/analytics/components/DateRangePicker';
import { useState, useMemo } from 'react';
import {
  DollarSign, Ticket, Users, Film, TrendingUp, Percent, UtensilsCrossed, BarChart3,
} from 'lucide-react';
import {
  useDashboardSummary,
  useRevenue,
  useBookingStats,
  useMoviePerformance,
} from '@/features/analytics/hooks/useDashboard';

export default function DashboardPage() {
  usePageTitle('Dashboard');

  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const summary = useDashboardSummary();
  const revenue = useRevenue({ from, to, groupBy: 'day' as const });
  const bookings = useBookingStats({ from, to });
  const movies = useMoviePerformance({ from, to });

  const kpiCards = useMemo(() => [
    {
      title: "Today's Revenue",
      value: `$${summary.data?.revenueToday.value.toLocaleString() ?? '0'}`,
      subtitle: `$${summary.data?.revenueToday.value.toLocaleString() ?? '0'} today`,
      icon: DollarSign,
      trend: summary.data?.revenueGrowth,
      trendLabel: 'vs last month',
    },
    {
      title: 'Monthly Revenue',
      value: `$${summary.data?.revenueThisMonth.value.toLocaleString() ?? '0'}`,
      subtitle: `${summary.data?.confirmedBookings ?? 0} confirmed bookings`,
      icon: TrendingUp,
    },
    {
      title: 'Total Bookings',
      value: summary.data?.totalBookings ?? 0,
      subtitle: `${summary.data?.pendingBookings ?? 0} pending`,
      icon: Ticket,
    },
    {
      title: 'Active Users',
      value: summary.data?.totalUsers ?? 0,
      subtitle: `${summary.data?.newUsersThisMonth ?? 0} new this month`,
      icon: Users,
    },
    {
      title: 'Active Movies',
      value: summary.data?.activeMovies ?? 0,
      subtitle: summary.data?.topMovie?.title ? `Top: ${summary.data.topMovie.title}` : undefined,
      icon: Film,
    },
    {
      title: 'Occupancy Rate',
      value: `${summary.data?.avgOccupancyRate ?? 0}%`,
      subtitle: 'Avg across all showtimes',
      icon: Percent,
    },
    {
      title: "Today's F&B",
      value: `$${summary.data?.foodRevenueToday.value.toLocaleString() ?? '0'}`,
      icon: UtensilsCrossed,
    },
    {
      title: 'Avg Ticket Price',
      value: `$${bookings.data?.avgTicketPrice.toFixed(2) ?? '0.00'}`,
      icon: BarChart3,
    },
  ], [summary.data, bookings.data]);

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time overview of your cinema platform
          </p>
        </div>
        <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t); }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, i) => (
          <StatCard key={i} {...card} loading={summary.loading} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue.data?.dataPoints ?? []} loading={revenue.loading} />
        </div>
        <div>
          <BookingPieChart data={bookings.data?.byStatus ?? []} loading={bookings.loading} />
        </div>
      </div>

      <div>
        <MoviePerformanceTable data={movies.data ?? []} loading={movies.loading} />
      </div>
    </div>
  );
}
