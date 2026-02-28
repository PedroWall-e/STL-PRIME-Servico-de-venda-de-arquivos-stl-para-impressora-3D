export const MOCK_CATEGORIES = [
    { id: 'all', label: 'Tudo' },
    { id: 'showcase', label: '🎨 Showcase' },
    { id: 'doubt', label: '❓ Dúvidas' },
    { id: 'tutorial', label: '📚 Tutoriais' },
    { id: 'challenge', label: '🏆 Desafios' },
];

export const MOCK_POSTS = [
    {
        id: 'p1',
        slug: 'case-iot-montado-exterior',
        title: 'Case IoT Satelital montado em exterior (com testes de chuva)',
        author: { username: 'MakerPro', display_name: 'MakerPro Studio', avatar: 'https://i.pravatar.cc/150?u=maker', is_official: false },
        category: 'showcase',
        created_at: '2024-03-20T10:00:00Z',
        excerpt: 'Acabei de instalar o case da Data Frontier no meu telhado. Imprimi em PETG preto e até agora resistiu a duas tempestades fortes sem qualquer infiltração. Partilho as fotos do setup.',
        content: `Acabei de instalar o case da Data Frontier no meu telhado. Imprimi em PETG preto e até agora resistiu a duas tempestades fortes sem qualquer infiltração.\n\nUsei 4 perimetros externos e 40% de infill gyroid. A tampa rosqueada funcionou perfeitamente sem problemas de tolerância.\n\nRecomendo VIVAMENTE uma fita de teflon na rosca só por precaução adicional, embora provavelmente não precise.\n\nFicam aqui as fotos do antes e depois da chuva!`,
        images: [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800'
        ],
        stats: { likes: 45, useful: 12, fire: 8, comments: 14 }
    },
    {
        id: 'p2',
        slug: 'problema-adesao-cama-petg',
        title: 'Problema de adesão com PETG da marca XYZ',
        author: { username: 'JohnDoe', display_name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=jd', is_official: false, subscription_level: 1 },
        category: 'doubt',
        created_at: '2024-03-19T14:30:00Z',
        excerpt: 'Estou a tentar imprimir a engrenagem planetária mas a primeira camada de PETG está sempre a descolar nos cantos (warping). Estou a usar mesa a 70C e bico a 230C.',
        content: `Estou a tentar imprimir a engrenagem planetária mas a primeira camada de PETG está sempre a descolar nos cantos (warping). Estou a usar mesa a 70C e bico a 230C.\n\nJá limpei com IPA, já calibrei o Z-offset. O PLA imprime perfeitamente, mas este rolo de PETG está a dar cabo de mim.\n\nAlguém tem alguma dica para a Bambu Lab P1P?`,
        images: [],
        stats: { likes: 2, useful: 15, fire: 0, comments: 28 }
    },
    {
        id: 'p3',
        slug: 'guia-suportes-organicos',
        title: 'Guia: Como configurar suportes orgânicos perfeitos no PrusaSlicer',
        author: { username: 'DataFrontier_Lab', display_name: 'Data Frontier Labs', avatar: 'https://i.pravatar.cc/150?u=dflab', is_official: true, subscription_level: 3 },
        category: 'tutorial',
        created_at: '2024-03-15T09:00:00Z',
        excerpt: 'Neste pequeno tutorial vou explicar as nossas configurações exatas (Data Frontier) para conseguir suportes orgânicos que se removem com apenas um dedo e não deixam marcas.',
        content: `Neste pequeno tutorial vou explicar as nossas configurações exatas (Data Frontier) para conseguir suportes orgânicos que se removem com apenas um dedo e não deixam marcas.\n\nO segredo está no "Top contact Z distance". Por norma os valores por defeito estão em 0.15mm (para layer heights de 0.2mm). Nós alteramos sempre para **0.25mm** se a impressora for muito precisa (como a X1C ou MK4).\n\nOutro truque: ativem o "Top interface layers" para 3 camadas, com "Interface pattern spacing" de 0.2mm. Isto cria um teto denso no suporte onde a peça apoia, fazendo com que a parte inferior da peça fique lisa.\n\nPodem descarregar o nosso perfil de fatiamento 3MF na nossa página oficial!`,
        images: [
            'https://images.unsplash.com/photo-1631541909061-71e34a49cebe?auto=format&fit=crop&q=80&w=800'
        ],
        stats: { likes: 342, useful: 512, fire: 89, comments: 45 }
    },
    {
        id: 'p4',
        slug: 'desafio-abril-design',
        title: 'Desafio Mensal: Melhor organizador de secretária',
        author: { username: 'Admin', display_name: 'STL Prime Admin', avatar: '/logo.svg', is_official: true },
        category: 'challenge',
        created_at: '2024-03-01T00:00:00Z',
        excerpt: 'Bem-vindos a mais um desafio STL Prime! Este mês queremos ver quem projeta o melhor e mais criativo organizador de cabos/secretária. Prémio: 1 ano de STL Prime Pro.',
        content: `Bem-vindos a mais um desafio STL Prime! Este mês queremos ver quem projeta o melhor e mais criativo organizador de cabos/secretária.\n\n**Regras:**\n1. Design 100% original e publicado aqui no STL Prime\n2. Não pode exceder 200x200mm\n3. Impressão sem suportes (preferencial)\n\nO vencedor será escolhido por votação da comunidade e ganha **1 ano de STL Prime Pro + 2 Rolos de PETG Data Frontier**. Submetam nos comentários o link do vosso modelo até 31 de Março!`,
        images: [],
        stats: { likes: 120, useful: 0, fire: 45, comments: 89 }
    },
    {
        id: 'p5',
        slug: 'impressora-resina-vs-fdm-detalhe',
        title: 'Dúvida: Quando decidir entre Resina e FDM para peças mecânicas?',
        author: { username: 'PedroMaker', display_name: 'Pedro Silva', avatar: 'https://i.pravatar.cc/150?u=ps', is_official: false },
        category: 'doubt',
        created_at: '2024-03-25T15:20:00Z',
        excerpt: 'Estou a pensar imprimir o Braço Robótico da Data Frontier. Vale a pena imprimir as engrenagens em resina para melhor precisão ou o PETG em FDM é suficiente para o esforço?',
        content: `Estou a pensar imprimir o Braço Robótico da Data Frontier. Vale a pena imprimir as engrenagens em resina para melhor precisão ou o PETG em FDM é suficiente para o esforço?\n\nTenho medo que a resina seja muito quebradiça para as engrenagens do motor. Alguém já testou as duas abordagens neste modelo específico?`,
        images: [],
        stats: { likes: 8, useful: 24, fire: 2, comments: 12 }
    },
    {
        id: 'p6',
        slug: 'meu-primeiro-timelapse-x1c',
        title: 'Showcase: Meu primeiro timelapse na Bambu Lab X1C',
        author: { username: 'AnaDesign', display_name: 'Ana G.', avatar: 'https://i.pravatar.cc/150?u=ana', is_official: false },
        category: 'showcase',
        created_at: '2024-03-24T09:00:00Z',
        excerpt: 'Finalmente consegui configurar o timelapse suave. Vejam como ficou a impressão do Suporte de Monitor V2!',
        content: `Finalmente consegui configurar o timelapse suave. Vejam como ficou a impressão do Suporte de Monitor V2!\n\nA qualidade da X1C é surreal. Usei o filamento Silk Silver da Data Frontier e o resultado parece metal verdadeiro.\n\nPróximo passo: imprimir o Braço Robótico!`,
        images: [
            'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800'
        ],
        stats: { likes: 89, useful: 5, fire: 56, comments: 18 }
    },
];
