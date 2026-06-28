export interface CarouselItem {
  id: string;
  src: string;
  title: string;
  publishDate: string;
  linkUrl?: string;
  isClickable?: boolean;
}

const carouselImages: CarouselItem[] = [
  {
    id: "gold-class-ticket",
    src: "/courousel/18c52a65-bfa5-426b-862d-b0750f76fe4a.jpeg",
    title: "Gold Class Ticket Package",
    publishDate: "Jan 18, 2024",
  },
  {
    id: "premium-experience",
    src: "/courousel/480251c7-01bb-478e-a18d-dba2a8d62a39.jpeg",
    title: "Premium Cinema Experience",
    publishDate: "Feb 05, 2024",
  },
  {
    id: "vip-lounge",
    src: "/courousel/a2a41de6-0c10-4f87-95bd-4250d4bfaf3f.jpeg",
    title: "VIP Lounge Access",
    publishDate: "Mar 12, 2024",
  },
  {
    id: "imax-screening",
    src: "/courousel/a2be5498-2e0e-4583-9782-1cb863f4a025.jpeg",
    title: "IMAX Screening Experience",
    publishDate: "Apr 02, 2024",
  },
  {
    id: "family-package",
    src: "/courousel/bb9995f4-5df5-404f-93ce-dcbaec15c031.jpeg",
    title: "Family Movie Package",
    publishDate: "May 10, 2024",
  },
  {
    id: "student-discount",
    src: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
    title: "Student Discount Day",
    publishDate: "Jun 01, 2024",
  },
  {
    id: "blockbuster-night",
    src: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    title: "Blockbuster Night Event",
    publishDate: "Jun 18, 2024",
  },
  {
    id: "cinema-premiere",
    src: "/courousel/e4aad683-6365-4912-9a93-fe9454ff305c.jpeg",
    title: "Exclusive Cinema Premiere",
    publishDate: "Jul 01, 2024",
  },
];

export default carouselImages;
