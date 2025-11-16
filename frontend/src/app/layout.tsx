import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Header, Footer, Container } from "@/components/layout";
import { ToastContainer } from "@/components";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "E-Store | Elevated Luxury Marketplace",
  description:
    "Discover a curated selection of premium products crafted for modern living. Experience refined shopping with elevated service.",
  keywords: ["luxury", "premium", "e-commerce", "shopping", "curated"],
  authors: [{ name: "E-Store" }],
  robots: "index, follow",
  openGraph: {
    title: "E-Store | Elevated Luxury Marketplace",
    description:
      "Discover a curated selection of premium products crafted for modern living. Experience refined shopping with elevated service.",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-cream-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-50 transition-colors duration-300`}
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
