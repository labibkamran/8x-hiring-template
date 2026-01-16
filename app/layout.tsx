/**
 * Root Layout
 * 
 * Main application layout wrapper that provides global context providers,
 * fonts, and base structure. Dark mode is default with optional light mode.
 */

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Genify.ai",
  description: "Next-generation AI tools for creative professionals.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Footer />
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
