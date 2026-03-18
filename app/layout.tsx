import './globals.css'

export const metadata = {
  title: 'OrcamentoPro',
  description: 'Gerador de orçamentos para profissionais',
}

export default function RootLayout({ children }: { children: React.ReactNode }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
