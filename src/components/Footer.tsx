
export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="w-screen bg-white text-gray-800">
            <div className="max-w-6xl mx-auto px-2 py-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                <div className="flex w-[100%] flex-col gap-2 justify-center items-center">
                    <h4 className="text-md font-medium">Contato</h4>
                    <div className="flex justify-center w-full items-center gap-2">
                        <a href="tel:PLACEHOLDER_PHONE" className="text-sm hover:underline">Telefone: <span className="font-medium">(13) 99806-6235</span></a>
                        <a href="mailto:jiamsdoam@gmail.com" className="text-sm hover:underline">E-mail: <span className="font-medium">clinicaleutz@outlook.com</span></a>
                        <address className="not-italic text-sm text-gray-600">Endereço: <span className="font-medium">Alameda Armênio Mendes, 66 - Sala 805</span></address>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-medium">Siga-nos</h4>
                    <div className="flex items-center gap-3">
                        <a href="#" aria-label="Instagram" target="_blank" rel="noreferrer" className="p-2 rounded-md hover:opacity-90 transition-shadow" style={{ background: 'rgba(127,99,75,0.08)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <path d="M17.5 6.5h.01"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook" target="_blank" rel="noreferrer" className="p-2 rounded-md hover:opacity-90 transition-shadow" style={{ background: 'rgba(127,99,75,0.08)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h2z"></path>
                            </svg>
                        </a>
                    </div>
                </div>

            </div>

            <div className="w-full border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
                    <div>© {year} Clínica <span className="font-medium">[NOME]</span>. Todos os direitos reservados.</div>
                    <div className="text-center md:text-right">Criação e suporte: <span className="font-medium">Instagram: @danilovazz_</span></div>
                </div>
            </div>
        </footer>
    )
}
