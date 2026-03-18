export default function Home(){
  return(
    <main style={{
      fontFamily: 'sans-serif',
      maxWidth: '600px',
      margin: '100px auto',
      textAlign: 'center',
    }}>

    <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e'}}>
      Orçamento<span style={{ color: '#e94560'}}>Pro</span>
    </h1>
    <p style={{ color: '#888', marginTop: '1rem'}}>
      Gerador de orçamentos para profissionais.
    </p>
    <a href="/novo" style={{
      display: 'inline-block',
      marginTop: '2rem',
      background: '#1a1a2e',
      color: 'white',
      padding: '12px 32px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 'bold',
    }}>
      Criar orçamento →
    </a>
    </main>
  )
}