import type { Metadata } from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {cn} from '@/lib/utils';
// import { ThemeProvider } from "@/components/themes-provider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ['300','400','500','600','700'],
});

export const metadata: Metadata = {
  title: "Careplus ",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en" 
    style={{colorScheme: 'dark'}}
    className={(fontSans.variable, 'dark')} 
    suppressHydrationWarning
    >
      <head></head>
      <body
        className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)}
      >
          {children}
      </body>
    </html>
  );
}
