
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Logo + descrição */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Placeholder para logo — substitua por <img src="/logo.png" /> se tiver */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm" aria-hidden style={{background: '#7F634B', color: 'white'}}>
              <span className="font-semibold">C</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Clínica <span className="font-normal">[NOME]</span></h3>
              <p className="text-sm text-gray-600">Atendimento humanizado · Saúde e bem-estar</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 max-w-sm">Profissionais qualificados, equipamentos modernos e atendimento focado na experiência do paciente. Agende sua consulta e cuide do que importa.</p>
        </div>

        {/* Contatos principais */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">Contato</h4>
          <a href="tel:PLACEHOLDER_PHONE" className="text-sm hover:underline">Telefone: <span className="font-medium">(XX) XXXX-XXXX</span></a>
          <a href="mailto:jiamsdoam@gmail.com" className="text-sm hover:underline">E-mail: <span className="font-medium">jiamsdoam@gmail.com</span></a>
          <address className="not-italic text-sm text-gray-600">Endereço: <span className="font-medium">Rua Exemplo, 123 — Bairro, Cidade</span></address>

          <div className="mt-3">
            <h5 className="text-sm font-medium">Horário</h5>
            <p className="text-sm text-gray-600">Seg — Sex: 8:00 — 18:00 · Sáb: 8:00 — 12:00</p>
          </div>
        </div>

        {/* Redes sociais + mapa / agendamento */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium">Siga-nos</h4>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" target="_blank" rel="noreferrer" className="p-2 rounded-md hover:opacity-90 transition-shadow" style={{background: 'rgba(127,99,75,0.08)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <path d="M17.5 6.5h.01"></path>
              </svg>
            </a>

            <a href="#" aria-label="Facebook" target="_blank" rel="noreferrer" className="p-2 rounded-md hover:opacity-90 transition-shadow" style={{background: 'rgba(127,99,75,0.08)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h2z"></path>
              </svg>
            </a>

            <a href="#" aria-label="LinkedIn" target="_blank" rel="noreferrer" className="p-2 rounded-md hover:opacity-90 transition-shadow" style={{background: 'rgba(127,99,75,0.08)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-2-2"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>

          <div className="mt-4">
            <a href="#" className="inline-block text-sm font-medium py-2 px-4 rounded-md" style={{background: '#7F634B', color: 'white'}}>Agende sua consulta</a>
            <p className="text-xs text-gray-500 mt-2">Ou clique para ver nosso mapa e instruções de chegada.</p>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <div>© {year} Clínica <span className="font-medium">[NOME]</span>. Todos os direitos reservados.</div>
          <div className="text-center md:text-right">Criação e suporte: <span className="font-medium">Danilo Vaz</span></div>
        </div>
      </div>
    </footer>
  )
}
