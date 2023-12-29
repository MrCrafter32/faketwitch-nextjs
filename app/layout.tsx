import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import '@/dist/output.css'
import { Toaster } from 'sonner'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className= {inter.className}>
        <Toaster theme='light' position='bottom-center'/>{children}</body>
    </html>
    </ClerkProvider>
  )
}
