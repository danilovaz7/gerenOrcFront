
export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="w-screen bg-white text-gray-800">
            <div className=" px-2 py-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                <div className="flex w-full flex-col gap-2 justify-center items-center">
                    <h4 className="text-md font-medium">Contato</h4>
                    <a href="tel:PLACEHOLDER_PHONE" className="text-sm hover:underline">Telefone: <span className="font-medium">(13) 99806-6235</span></a>
                    <a href="mailto:jiamsdoam@gmail.com" className="text-sm hover:underline">E-mail: <span className="font-medium">clinicaleutz@outlook.com</span></a>
                    <address className="not-italic text-sm text-gray-600">Endereço: <span className="font-medium">Alameda Armênio Mendes, 66 - Sala 805</span></address>
                </div>

                <div className="flex items-center gap-3">
                    <p>Siga-nos</p>
                    <a
                        href="https://www.instagram.com/dracamillaleutz"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-md hover:opacity-90 transition-shadow"
                        style={{ background: 'rgba(127,99,75,0.08)' }}
                        title="Instagram"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <path d="M17.5 6.5h.01"></path>
                        </svg>
                    </a>
                    <p>Avalie-nos</p>
                    <a
                        href="https://g.page/seu-local-ou-avaliacoes" // coloque sua URL real aqui
                        aria-label="Avaliações da clínica (abre em nova aba)"
                        title="Avaliações"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 p-2 rounded-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F634B] bg-[rgba(127,99,75,0.08)] text-[#4a3f35] hover:shadow-sm"
                    >
                        {/* ícone (estrela + balão) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 17.3l-5.6 3.1 1.1-6.4L2 9.7l6.4-.9L12 3l3.6 5.8 6.4.9-4.5 4.3 1.1 6.4z" />
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                        </svg>

                        {/* texto visível em telas maiores, oculto em mobile (acessível via aria-label) */}
                        <span className="hidden sm:inline-block font-medium">Avaliações</span>
                    </a>
                </div>

            </div>

            <div className="w-full border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
                    <div>© {year} Clínica <span className="font-medium">Leutz</span>. Todos os direitos reservados.</div>
                    <div className="text-center md:text-right">Criação e suporte: <a href="https://www.instagram.com/danilovaz.dev" className="font-medium text-gray-500">@danilovaz.dev</a></div>
                </div>
            </div>
        </footer>
    )
}
