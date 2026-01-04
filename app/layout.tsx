import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trilha dos Invasores",
  description: "Faça sua inscrição para a próxima aventura na Cachoeira do Brennand.",
  
  // 1. ÍCONE DA ABA (Favicon) - Vai usar sua logo circular
  icons: {
    icon: "/logo.png",
  },

  // 2. CONFIGURAÇÃO DO WHATSAPP 👇
  openGraph: {
    title: "Trilha dos Invasores - Cachoeira do Brennand",
    description: "Desafio, natureza e superação. Garanta sua vaga agora!",
    url: "https://invasores-trilhaa.vercel.app", 
    siteName: "Invasores",
    images: [
      {
        url: "/brennand-trilhaa.jpg", // ✅ Mantido o nome exato do seu arquivo
        width: 1200,
        height: 630,
        alt: "Trilha dos Invasores",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}