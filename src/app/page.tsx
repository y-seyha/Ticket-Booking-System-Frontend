import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen ">
      {/* Example 1: Full Navbar (Defaults to true) */}
      <Navbar />
      <Footer />

      {/* Example 2: Modified Minimal Navbar */}
      {/* <Navbar
        showSearch={false}
        showTicket={false}
        showJoinNow={false}
        showNotification={false}
        showBottomNav={false}
        showCinemaDropdown={false}
      /> */}
    </div>
  );
}
