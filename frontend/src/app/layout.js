import "./globals.css";

import RootProvider from "./RootProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Layout } from "@/components/Layout";

export const metadata = {
  metadataBase: new URL("https://itsablog.in"),

  title: {
    default: "ItsABlog | Read • Review • Reflect",
    template: "%s | ItsABlog",
  },

  description:
    "ItsABlog is a modern social platform for readers to discover books, write meaningful reviews, create curated lists, and connect with passionate book lovers.",

  keywords: [
    "books",
    "book reviews",
    "reading platform",
    "book community",
    "literature",
    "reading tracker",
    "book clubs",
    "reader social app",
    "book recommendations",
    "ItsABlog",
  ],

  authors: [
    {
      name: "ItsABlog",
    },
  ],

  creator: "ItsABlog",

  publisher: "ItsABlog",

  applicationName: "ItsABlog",

  category: "books",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://itsablog.in",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://itsablog.in",
    siteName: "ItsABlog",

    title: "ItsABlog | Read • Review • Reflect",

    description:
      "Discover books, write thoughtful reviews, build curated reading lists, and connect with a passionate literary community.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ItsABlog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "ItsABlog | Read • Review • Reflect",

    description:
      "A modern social reading platform for passionate readers and reviewers.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: "/itsablog.ico",
    shortcut: "/itsablog.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#09090b",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* PWA + Mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="format-detection" content="telephone=no" />

        {/* Theme */}
        <meta name="theme-color" content="#09090b" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "WebSite",

              name: "ItsABlog",

              url: "https://itsablog.in",

              description:
                "A modern social platform for readers to discover books, review literature, and join reading communities.",

              potentialAction: {
                "@type": "SearchAction",

                target: "https://itsablog.in/explore?q={search_term_string}",

                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <RootProvider>
          <AuthProvider>
            <ThemeProvider>
              <Layout>{children}</Layout>
            </ThemeProvider>
          </AuthProvider>
        </RootProvider>
      </body>
    </html>
  );
}
