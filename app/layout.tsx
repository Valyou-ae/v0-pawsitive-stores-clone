import type React from "react"
import {
  Inter,
  Bebas_Neue,
  Playfair_Display,
  Oswald,
  Pacifico,
  Raleway,
  Roboto_Slab,
  Dancing_Script,
  Montserrat,
} from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/app/client-layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "Genmock | AI-Powered Design & Mockup Generator",
  description:
    "Professional AI mockup generator for e-commerce sellers. Create stunning product designs and realistic mockups in seconds.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${playfair.variable} ${oswald.variable} ${pacifico.variable} ${raleway.variable} ${robotoSlab.variable} ${dancingScript.variable} ${montserrat.variable}`}
    >
      <body className="antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
