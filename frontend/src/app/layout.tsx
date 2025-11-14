import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Header, Footer, Container } from "@/components/layout";
import { ToastContainer } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Store | Quality Products at Great Prices",
  description:
    "Your one-stop shop for quality products at competitive prices. Shop electronics, fashion, home & more.",
  keywords: ["e-commerce", "shopping", "products", "store"],
  authors: [{ name: "E-Store" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "E-Store | Quality Products",
    description: "Your one-stop shop for quality products",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Container size="2xl" className="py-8">
                {children}
              </Container>
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
