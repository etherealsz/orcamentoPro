import './globals.css'

export const metadata = {
  title: 'OrcamentoPro',
  description: 'Gerador de orcamentos para profissionais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt'>
      <body>{children}</body>
    </html>
  )
}
