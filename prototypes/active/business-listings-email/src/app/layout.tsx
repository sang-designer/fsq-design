import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Listings – Weekly Insights",
  description: "Foursquare Business Listings email concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-['-apple-system','SF_Pro_Display','SF_Pro_Text','Helvetica_Neue','Helvetica','Arial',sans-serif]">
        {children}
      </body>
    </html>
  );
}
