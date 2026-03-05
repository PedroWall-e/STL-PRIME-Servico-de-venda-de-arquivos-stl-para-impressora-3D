import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Política de Privacidade | STL Prime',
    description: 'Saiba como a STL Prime coleta, utiliza e protege os seus dados pessoais.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#3347FF] transition-colors text-sm font-bold">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Link>
                    <span className="font-black text-[#2B2B2B]">Política de Privacidade</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 md:px-6 py-16">
                <div className="mb-10">
                    <p className="text-sm font-bold text-[#3347FF] uppercase tracking-widest mb-2">Legal</p>
                    <h1 className="text-4xl font-black text-[#2B2B2B] mb-4">Política de Privacidade</h1>
                    <p className="text-gray-500">Última atualização: Março de 2025</p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 space-y-8">

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">1. Quem somos</h2>
                        <p>A <strong>STL Prime</strong> é operada pela <strong>Data Frontier Labs</strong>. Esta Política de Privacidade explica como recolhemos, utilizamos, armazenamos e protegemos as informações pessoais dos utilizadores da nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD) — Lei nº 13.709/2018.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">2. Dados que recolhemos</h2>
                        <p>Ao utilizar a STL Prime, podemos recolher os seguintes dados:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Dados de identificação:</strong> nome completo, endereço de e-mail e nome de utilizador;</li>
                            <li><strong>Dados de pagamento:</strong> processados exclusivamente pela Stripe — não armazenamos dados de cartão de crédito;</li>
                            <li><strong>Dados de utilização:</strong> modelos visualizados, downloads, compras e interações na plataforma;</li>
                            <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador e sistema operativo (via logs de servidor).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">3. Como utilizamos os seus dados</h2>
                        <p>Utilizamos os seus dados para:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Gerir a sua conta e fornecer acesso aos serviços contratados;</li>
                            <li>Processar pagamentos e enviar recibos por e-mail;</li>
                            <li>Enviar comunicações transacionais (ex.: confirmação de compra, notificações da plataforma);</li>
                            <li>Melhorar a experiência da plataforma através de análises de uso agregadas;</li>
                            <li>Cumprir obrigações legais e regulamentares.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">4. Partilha de dados com terceiros</h2>
                        <p>Não vendemos os seus dados pessoais. Partilhamos informações apenas com parceiros essenciais para a operação do serviço:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Supabase</strong> — Armazenamento de base de dados e autenticação;</li>
                            <li><strong>Stripe</strong> — Processamento seguro de pagamentos;</li>
                            <li><strong>Resend</strong> — Envio de e-mails transacionais;</li>
                            <li><strong>Vercel</strong> — Alojamento e infraestrutura da aplicação.</li>
                        </ul>
                        <p className="mt-2">Todos os parceiros são obrigados a tratar os seus dados de acordo com as suas próprias políticas de privacidade e padrões de segurança.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">5. Conservação de dados</h2>
                        <p>Os seus dados são conservados enquanto a sua conta estiver ativa. Se solicitar a eliminação da conta, removeremos os seus dados pessoais no prazo de 30 dias, exceto quando exigido por lei para fins fiscais ou legais.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">6. Os seus direitos</h2>
                        <p>Ao abrigo da LGPD, tem direito a:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Aceder aos seus dados pessoais que conservamos;</li>
                            <li>Corrigir dados incorretos ou incompletos;</li>
                            <li>Solicitar a eliminação dos seus dados;</li>
                            <li>Opor-se ao tratamento dos seus dados para fins de marketing;</li>
                            <li>Portabilidade dos seus dados em formato legível por máquina.</li>
                        </ul>
                        <p className="mt-2">Para exercer estes direitos, contacte-nos em: <strong>privacidade@stlprime.com</strong></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">7. Segurança</h2>
                        <p>Implementamos medidas técnicas e organizacionais para proteger os seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos encriptação SSL/TLS em todas as comunicações e Row Level Security (RLS) no nosso banco de dados.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">8. Cookies</h2>
                        <p>Utilizamos cookies de sessão essenciais para autenticação e segurança. Não utilizamos cookies de rastreamento ou publicidade de terceiros.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">9. Contacto</h2>
                        <p>Para questões relacionadas com a sua privacidade ou para exercer os seus direitos, contacte o nosso Encarregado de Proteção de Dados em: <strong>privacidade@stlprime.com</strong></p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
                    <Link href="/terms" className="text-sm font-bold text-[#3347FF] hover:underline">
                        Termos de Serviço →
                    </Link>
                    <Link href="/" className="text-sm font-bold text-gray-400 hover:text-[#2B2B2B] transition-colors">
                        ← Voltar ao Início
                    </Link>
                </div>
            </main>
        </div>
    );
}
