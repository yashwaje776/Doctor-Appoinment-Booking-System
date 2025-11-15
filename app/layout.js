import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme-provider"; 
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookMyDoc - Doctor Appointment Booking",
  description: "A smart platform to book appointments with doctors easily.",
};

export default function RootLayout({ children }) {
  return (
    
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        
        <head>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-100`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>

      </html>
    </ClerkProvider>
  );
}
