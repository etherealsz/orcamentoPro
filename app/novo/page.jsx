'use client'
import { useState, useCallback } from 'react'

export default function NovoOrcamento() {
  const [empresa, setEmpresa] = useState('')
  const [cliente, setCliente] = useState('')
  const [itens, setItens] = useState([
    { descricao: '', quantidade: 1, preco: '' }
  ])

  function adicionarItem() {
    setItens([...itens, { descricao: '', quantidade: 1, preco: '' }])
  }

  function removerItem(i) {
    setItens(itens.filter((_, index) => index !== i))
  }

  function atualizarItem(i, campo, valor) {
    const novosItens = [...itens]
    novosItens[i][campo] = valor
    setItens(novosItens)
  }

  const subtotal = itens.reduce((acc, item) => {
    return acc + (parseFloat(item.preco) || 0) * (parseInt(item.quantidade) || 0)
  }, 0)

  const iva = subtotal * 0.23
  const total = subtotal + iva

  const gerarPDF = useCallback(async () => {
    const jsPDF = (await import('jspdf')).default
    const doc = new jsPDF()

    const data = new Date().toLocaleDateString('pt-PT')
    const numero = 'ORC-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0')

    doc.setFillColor(26, 26, 46)
    doc.rect(0, 0, 210, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(empresa || 'A tua empresa', 14, 20)

    doc.setFontSize(10)
    doc.setTextColor(180, 180, 200)
    doc.text('N\u00ba ' + numero + '  \u00b7  ' + data, 14, 40)

    doc.setTextColor(100, 100, 110)
    doc.setFontSize(9)
    doc.text('OR\u00c7AMENTO PARA', 14, 55)
    doc.setTextColor(26, 26, 46)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(cliente || 'Cliente', 14, 63)

    doc.setFillColor(26, 26, 46)
    doc.rect(14, 72, 182, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DESCRI\u00c7\u00c3O', 18, 77.5)
    doc.text('QTD', 120, 77.5)
    doc.text('PRE\u00c7O UNIT.', 140, 77.5)
    doc.text('TOTAL', 178, 77.5, { align: 'right' })

    let y = 86
    doc.setFont('helvetica', 'normal')
    itens.forEach((item, i) => {
      if (!item.descricao) return
      const bg = i % 2 === 0 ? [247, 246, 242] : [255, 255, 255]
      doc.setFillColor(bg[0], bg[1], bg[2])
      doc.rect(14, y - 4, 182, 9, 'F')
      doc.setTextColor(40, 40, 50)
      doc.setFontSize(9)
      doc.text(item.descricao, 18, y + 1)
      doc.text(String(item.quantidade), 122, y + 1)
      doc.text(parseFloat(item.preco || 0).toFixed(2) + ' \u20ac', 142, y + 1)
      const linha = (parseFloat(item.preco) || 0) * (parseInt(item.quantidade) || 0)
      doc.text(linha.toFixed(2) + ' \u20ac', 194, y + 1, { align: 'right' })
      y += 10
    })

    y += 6
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 130)
    doc.text('Subtotal', 140, y)
    doc.text(subtotal.toFixed(2) + ' \u20ac', 194, y, { align: 'right' })
    y += 7
    doc.text('IVA (23%)', 140, y)
    doc.text(iva.toFixed(2) + ' \u20ac', 194, y, { align: 'right' })
    y += 8
    doc.setDrawColor(200, 200, 210)
    doc.line(140, y - 3, 196, y - 3)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 26, 46)
    doc.text('TOTAL', 140, y + 4)
    doc.text(total.toFixed(2) + ' \u20ac', 194, y + 4, { align: 'right' })

    doc.save('orcamento-' + numero + '.pdf')
  }, [empresa, cliente, itens, subtotal, iva, total])

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
        Orçamento<span style={{ color: '#e94560' }}>Pro</span>
      </h1>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>A tua empresa</h2>
        <input style={inputStyle} placeholder="Nome da empresa" value={empresa} onChange={e => setEmpresa(e.target.value)} />
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Cliente</h2>
        <input style={inputStyle} placeholder="Nome do cliente" value={cliente} onChange={e => setCliente(e.target.value)} />
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Serviços e materiais</h2>
        {itens.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
            <input style={inputStyle} placeholder="Descrição" value={item.descricao} onChange={e => atualizarItem(i, 'descricao', e.target.value)} />
            <input style={inputStyle} type="number" placeholder="Qtd" value={item.quantidade} onChange={e => atualizarItem(i, 'quantidade', e.target.value)} />
            <input style={inputStyle} type="number" placeholder="Preço" value={item.preco} onChange={e => atualizarItem(i, 'preco', e.target.value)} />
            <button onClick={() => removerItem(i)} style={btnRemoverStyle}>×</button>
          </div>
        ))}
        <button onClick={adicionarItem} style={btnAdicionarStyle}>+ Adicionar linha</button>
      </section>

      <section style={{ ...sectionStyle, textAlign: 'right' }}>
        <p style={{ color: '#888', marginBottom: '4px' }}>Subtotal: <strong>{subtotal.toFixed(2)} €</strong></p>
        <p style={{ color: '#888', marginBottom: '4px' }}>IVA (23%): <strong>{iva.toFixed(2)} €</strong></p>
        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e' }}>Total: {total.toFixed(2)} €</p>
      </section>

      <button style={btnPrimaryStyle} onClick={gerarPDF}>Gerar PDF →</button>
    </main>
  )
}

const sectionStyle = { background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #e8e6e0' }
const titleStyle = { fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '1rem' }
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e8e6e0', fontSize: '14px', outline: 'none', fontFamily: 'sans-serif' }
const btnRemoverStyle = { background: 'none', border: '1px solid #e8e6e0', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', color: '#888', width: '36px' }
const btnAdicionarStyle = { width: '100%', padding: '8px', background: 'none', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', color: '#888', fontSize: '13px', marginTop: '4px' }
const btnPrimaryStyle = { width: '100%', padding: '14px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }