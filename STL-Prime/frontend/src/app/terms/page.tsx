import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Termos de Serviço | STL Prime',
    description: 'Leia os Termos de Serviço da plataforma STL Prime para entender seus direitos e responsabilidades.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#3347FF] transition-colors text-sm font-bold">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Link>
                    <span className="font-black text-[#2B2B2B]">Termos de Serviço</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 md:px-6 py-16">
                <div className="mb-10">
                    <p className="text-sm font-bold text-[#3347FF] uppercase tracking-widest mb-2">Legal</p>
                    <h1 className="text-4xl font-black text-[#2B2B2B] mb-4">Termos de Serviço</h1>
                    <p className="text-gray-500">Última atualização: Março de 2025</p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 space-y-8">

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">1. Aceitação dos Termos</h2>
                        <p>Ao acessar e utilizar a plataforma <strong>STL Prime</strong>, operada pela Data Frontier Labs, você concorda em cumprir e estar vinculado aos presentes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso serviço.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">2. Descrição do Serviço</h2>
                        <p>A STL Prime é um marketplace digital para compra, venda e download de arquivos de modelagem 3D (formatos STL, 3MF e similares). Oferecemos planos de assinatura (<strong>Pro</strong> e <strong>Premium</strong>) com benefícios adicionais, além de acesso gratuito a uma seleção de modelos.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">3. Conta de Usuário</h2>
                        <p>Para utilizar determinadas funcionalidades, é necessário criar uma conta. Você é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas na sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">4. Conduta do Criador e Upload de Arquivos</h2>
                        <p>Ao publicar um modelo na plataforma, o criador garante que:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Detém todos os direitos de propriedade intelectual sobre o arquivo;</li>
                            <li>O conteúdo não infringe direitos autorais, marcas registradas ou outros direitos de terceiros;</li>
                            <li>O arquivo não contém malware, vírus ou código malicioso;</li>
                            <li>O conteúdo não é ilegal, prejudicial, ameaçador, abusivo ou de outra forma censurável.</li>
                        </ul>
                        <p className="mt-2">A STL Prime reserva-se o direito de remover conteúdo que viole estas diretrizes a qualquer momento.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">5. Pagamentos e Reembolsos</h2>
                        <p>Os pagamentos são processados de forma segura através da plataforma <strong>Stripe</strong>. Após a confirmação da compra de um arquivo digital, não oferecemos reembolsos, exceto em casos de falha técnica comprovada no arquivo adquirido. As assinaturas podem ser canceladas a qualquer momento, com acesso mantido até o fim do período vigente.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">6. Propriedade Intelectual da Plataforma</h2>
                        <p>Todo o conteúdo da plataforma STL Prime, incluindo design, logotipos, textos e software, é de propriedade exclusiva da Data Frontier Labs e protegido por leis de direitos autorais. É proibida a reprodução sem autorização prévia e por escrito.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">7. Limitação de Responsabilidade</h2>
                        <p>A STL Prime não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar o serviço, incluindo, mas não se limitando a, perda de dados ou defeitos nos arquivos de terceiros disponibilizados na plataforma.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">8. Alterações nos Termos</h2>
                        <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos os usuários sobre alterações significativas por e-mail ou através de aviso na plataforma. O uso continuado do serviço após tais alterações constitui aceitação dos novos Termos.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-3">9. Contacto</h2>
                        <p>Para questões relacionadas a estes Termos de Serviço, entre em contacto através de: <strong>suporte@stlprime.com</strong></p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
                    <Link href="/privacy" className="text-sm font-bold text-[#3347FF] hover:underline">
                        Política de Privacidade →
                    </Link>
                    <Link href="/" className="text-sm font-bold text-gray-400 hover:text-[#2B2B2B] transition-colors">
                        ← Voltar ao Início
                    </Link>
                </div>
            </main>
        </div>
    );
}
