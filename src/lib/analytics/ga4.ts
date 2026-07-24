declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const GA4_ENABLED = !!GA_MEASUREMENT_ID;

export function pageview(path: string, title?: string) {
  if (!GA4_ENABLED || typeof window === 'undefined') return;
  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_path: path,
    page_title: title,
  });
}

export function event(
  action: string,
  params?: Record<string, unknown>,
) {
  if (!GA4_ENABLED || typeof window === 'undefined') return;
  window.gtag('event', action, params);
}

export function trackInteraction(
  category: string,
  action: string,
  label?: string,
  value?: number,
) {
  event('interaction', {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string = 'USD',
  items?: Array<{ item_id: string; item_name: string; price: number; quantity: number }>,
) {
  event('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items,
  });
}

export function trackBooking(
  bookingId: string,
  movieTitle: string,
  seatsCount: number,
  totalPrice: number,
) {
  event('booking_completed', {
    booking_id: bookingId,
    movie_title: movieTitle,
    seats_count: seatsCount,
    value: totalPrice,
    currency: 'USD',
  });
}
