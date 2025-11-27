import React, { useState, useEffect, useMemo } from 'react';
import { 
  Book, 
  Library, 
  FileText, 
  Settings, 
  Search, 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  FileCode, 
  Download, 
  Layout, 
  GitBranch,
  Layers,
  FolderOpen
} from 'lucide-react';

// --- MOCK DATA & TYPES ---

// Simulação de um File System lido de múltiplos repositórios
const INITIAL_FILE_SYSTEM = [
  // Repositório Principal (Monolito/Core)
  { id: '1', name: 'README.md', path: '/README.md', repo: 'Core-App', content: '# Core App\n\nBem-vindo ao sistema principal. Para instalar, rode `npm install`.' },
  { id: '2', name: 'CHANGELOG.md', path: '/CHANGELOG.md', repo: 'Core-App', content: '# Changelog\n\n## v1.0.0\n- Início do projeto' },
  { id: '3', name: 'PROJECT_CHARTER.md', path: '/PROJECT_CHARTER.md', repo: 'Core-App', content: '# Project Charter\n\nObjetivo: Dominar o mundo dos microserviços.' },
  { id: '4', name: '0001-escolha-banco-dados.md', path: '/docs/adr/0001-escolha-banco-dados.md', repo: 'Core-App', content: '# ADR 0001: Postgres\n\nDecidimos usar Postgres pela robustez.\n\n```mermaid\ngraph TD;\n    A[App] --> B[Postgres];\n```' },
  { id: '5', name: '0002-uso-kafka.md', path: '/docs/adr/0002-uso-kafka.md', repo: 'Core-App', content: '# ADR 0002: Kafka\n\nPara eventos assíncronos.' },
  { id: '6', name: 'c1-contexto.mmd', path: '/docs/diagrams/c1-contexto.mmd', repo: 'Core-App', content: 'graph TD; User --> System;' },
  { id: '7', name: 'setup-ambiente.md', path: '/docs/guides/setup-ambiente.md', repo: 'Core-App', content: '# Setup\n\n1. Instale Node\n2. Reze.' },
  
  // Repositório Secundário (Microserviço de Pagamento)
  { id: '8', name: 'README.md', path: '/README.md', repo: 'Service-Payment', content: '# Payment Service\n\nMicroserviço responsável por processar pagamentos.' },
  { id: '9', name: 'api-spec.md', path: '/docs/api/api-spec.md', repo: 'Service-Payment', content: '# API Specification\n\nEndpoints:\n- POST /pay\n- GET /status' },
  
  // Arquivo "Perdido" (Não mapeado nas regras padrões)
  { id: '10', name: 'anotacoes-reuniao.md', path: '/temp/anotacoes-reuniao.md', repo: 'Core-App', content: '# Reunião dia 20\n\nDiscutimos sobre a cor do botão.' },
];

// --- COMPONENTS ---

// Componente de Renderização de Markdown Simplificado
const MarkdownRenderer = ({ content }) => {
  // Simples parser para fins de protótipo. Em produção, usaria react-markdown
  const lines = content.split('\n');
  return (
    <div className="prose max-w-none text-slate-800">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) return <h1 key={idx} id={line.substring(2).replace(/\s+/g, '-').toLowerCase()} className="text-3xl font-bold mb-4 mt-6 text-slate-900 border-b pb-2">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={idx} id={line.substring(3).replace(/\s+/g, '-').toLowerCase()} className="text-2xl font-semibold mb-3 mt-5 text-slate-800">{line.substring(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={idx} id={line.substring(4).replace(/\s+/g, '-').toLowerCase()} className="text-xl font-medium mb-2 mt-4 text-slate-700">{line.substring(4)}</h3>;
        if (line.startsWith('- ')) return <li key={idx} className="ml-4 list-disc text-slate-600">{line.substring(2)}</li>;
        if (line.startsWith('```mermaid')) return <div key={idx} className="bg-slate-100 p-4 border-l-4 border-indigo-500 my-4 font-mono text-sm text-indigo-700">Mermaid Diagram Visualization Placeholder</div>;
        if (line.startsWith('```')) return null; // fecha bloco
        return <p key={idx} className="mb-2 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};

// Componente Accordion
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-md mb-2 bg-white overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="p-4 bg-white border-t border-slate-100">{children}</div>}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function DocAggregator() {
  const [files, setFiles] = useState(INITIAL_FILE_SYSTEM);
  const [activeRepo, setActiveRepo] = useState('All');
  const [viewMode, setViewMode] = useState('reader'); // 'reader' | 'organizer' | 'export'
  const [selectedDocId, setSelectedDocId] = useState('1');
  const [structure, setStructure] = useState({});
  const [unmappedFiles, setUnmappedFiles] = useState([]);

  // 1. ENGINE DE MAPEAMENTO AUTOMÁTICO (Simula a lógica do Backend)
  useEffect(() => {
    const newStructure = {
      "Prateleira: Design Document": {
        "Livro: Visão Geral": { files: [] },
        "Livro: Arquitetura (ADRs)": { files: [] },
        "Livro: Diagramas C4": { files: [] },
      },
      "Prateleira: Guias & Tutoriais": {
        "Livro: Setup": { files: [] },
        "Livro: Deploy": { files: [] },
      },
      "Prateleira: APIs & Specs": {
        "Livro: Core App": { files: [] },
        "Livro: Microserviços": { files: [] },
      }
    };

    const unmapped = [];

    files.forEach(file => {
      // Regras de Mapeamento (Simulação do Feature 1.1)
      const path = file.path.toLowerCase();
      
      if (activeRepo !== 'All' && file.repo !== activeRepo) return;

      let matched = false;

      if (path.includes('readme.md') || path.includes('project_charter') || path.includes('changelog')) {
        newStructure["Prateleira: Design Document"]["Livro: Visão Geral"].files.push(file);
        matched = true;
      } else if (path.includes('/adr/')) {
        newStructure["Prateleira: Design Document"]["Livro: Arquitetura (ADRs)"].files.push(file);
        matched = true;
      } else if (path.includes('/diagrams/') || path.endsWith('.mmd')) {
        newStructure["Prateleira: Design Document"]["Livro: Diagramas C4"].files.push(file);
        matched = true;
      } else if (path.includes('setup') || path.includes('guide')) {
        newStructure["Prateleira: Guias & Tutoriais"]["Livro: Setup"].files.push(file);
        matched = true;
      } else if (path.includes('api-spec')) {
        newStructure["Prateleira: APIs & Specs"]["Livro: Microserviços"].files.push(file);
        matched = true;
      }

      if (!matched) {
        unmapped.push(file);
      }
    });

    setStructure(newStructure);
    setUnmappedFiles(unmapped);
  }, [files, activeRepo]);

  const currentDoc = files.find(f => f.id === selectedDocId) || files[0];

  // Gera Títulos para Navegação "Nesta Página"
  const tableOfContents = useMemo(() => {
    if (!currentDoc) return [];
    const lines = currentDoc.content.split('\n');
    return lines
      .filter(line => line.startsWith('# ') || line.startsWith('## '))
      .map(line => ({
        text: line.replace(/^#+\s/, ''),
        level: line.startsWith('## ') ? 2 : 1,
        id: line.replace(/^#+\s/, '').replace(/\s+/g, '-').toLowerCase()
      }));
  }, [currentDoc]);

  // Função para mover arquivo não mapeado (Simula Feature 4.2)
  const handleMapFile = (fileId, targetCategory) => {
    alert(`Arquivo ID ${fileId} movido para ${targetCategory}. A regra será salva no arquivo de configuração do projeto.`);
    // Em produção, isso atualizaria o JSON de config
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* --- SIDEBAR ESQUERDA (NAVEGAÇÃO GLOBAL) --- */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        
        {/* Header da Empresa/Projeto */}
        <div className="p-4 border-b border-slate-700 bg-slate-950">
          <div className="flex items-center gap-2 mb-2 text-white font-bold">
            <Library className="text-indigo-400" />
            <span>DocCenter Corp</span>
          </div>
          <div className="relative">
            <GitBranch size={14} className="absolute left-2 top-2.5 text-slate-500" />
            <select 
              className="w-full bg-slate-800 text-xs text-slate-200 pl-8 pr-2 py-2 rounded border border-slate-700 focus:outline-none focus:border-indigo-500"
              value={activeRepo}
              onChange={(e) => setActiveRepo(e.target.value)}
            >
              <option value="All">Todos os Repositórios</option>
              <option value="Core-App">Core-App (Monolito)</option>
              <option value="Service-Payment">Service-Payment</option>
            </select>
          </div>
        </div>

        {/* Navegação Principal (Prateleiras) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(structure).map(([shelfName, books]) => (
            <div key={shelfName}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers size={12} />
                {shelfName.replace('Prateleira: ', '')}
              </h3>
              
              <div className="space-y-1">
                {Object.entries(books).map(([bookName, content]) => {
                  if (content.files.length === 0) return null;
                  return (
                    <div key={bookName} className="ml-2 mb-2">
                      <div className="flex items-center gap-2 text-sm text-indigo-200 mb-1">
                        <FolderOpen size={14} />
                        {bookName.replace('Livro: ', '')}
                      </div>
                      {/* Capítulos/Páginas */}
                      <ul className="border-l border-slate-700 ml-2 pl-3 space-y-1">
                        {content.files.map(file => (
                          <li key={file.id}>
                            <button
                              onClick={() => { setSelectedDocId(file.id); setViewMode('reader'); }}
                              className={`text-sm w-full text-left truncate py-1 transition-colors ${selectedDocId === file.id ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                              {file.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Alerta de Arquivos Não Mapeados */}
          {unmappedFiles.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-700">
              <button 
                onClick={() => setViewMode('organizer')}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium w-full p-2 rounded hover:bg-slate-800 transition-colors"
              >
                <AlertTriangle size={16} />
                <span>{unmappedFiles.length} Arquivos Não Mapeados</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer do Sidebar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex gap-3">
             <button onClick={() => setViewMode('export')} className="hover:text-white flex flex-col items-center gap-1">
               <Download size={16} /> Exportar
             </button>
             <button onClick={() => setViewMode('organizer')} className="hover:text-white flex flex-col items-center gap-1">
               <Settings size={16} /> Config
             </button>
          </div>
          <span className="text-slate-600">v1.0.4</span>
        </div>
      </aside>


      {/* --- ÁREA PRINCIPAL --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl m-4 rounded-xl border border-slate-200 overflow-hidden">
        
        {/* Barra de Ferramentas Superior */}
        <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {viewMode === 'reader' && (
              <>
                <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight">{currentDoc?.name}</h1>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <GitBranch size={10} /> {currentDoc?.repo} • Última edição há 2 dias
                  </p>
                </div>
              </>
            )}
            {viewMode === 'organizer' && <h1 className="text-lg font-bold text-slate-800">Organizador de Conteúdo</h1>}
            {viewMode === 'export' && <h1 className="text-lg font-bold text-slate-800">Exportar Documentação (PDF)</h1>}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar na documentação..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1 overflow-y-auto flex">
          
          {/* MODO LEITURA (Padrão) */}
          {viewMode === 'reader' && (
            <>
              {/* Conteúdo Central */}
              <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
                {/* Accordion Wrapper para Capítulos (Simulação Item 2.4) */}
                <Accordion title="Visualizar Conteúdo do Arquivo" defaultOpen={true}>
                  <MarkdownRenderer content={currentDoc?.content || ''} />
                </Accordion>
                
                {/* Exemplo de integração dinâmica: Se for um Design Doc, mostra ADRs relacionadas */}
                {currentDoc?.name === 'PROJECT_CHARTER.md' && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Decisões Arquiteturais Relacionadas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {structure["Prateleira: Design Document"]["Livro: Arquitetura (ADRs)"].files.map(adr => (
                        <div key={adr.id} className="p-4 border border-slate-200 rounded hover:border-indigo-300 cursor-pointer bg-slate-50 transition-all">
                          <h4 className="font-bold text-sm text-indigo-700 mb-1">{adr.name}</h4>
                          <p className="text-xs text-slate-500">Status: Aceito</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Direita (Table of Contents - Item 5) */}
              <aside className="w-64 border-l border-slate-100 bg-slate-50/50 p-6 hidden xl:block overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Nesta Página</h4>
                <nav className="space-y-3 relative">
                  {/* Linha vertical decorativa */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 ml-px"></div>
                  
                  {tableOfContents.map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className={`block pl-4 text-sm border-l-2 transition-all ${item.level === 1 ? 'border-transparent text-slate-600 hover:border-slate-300' : 'ml-2 border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </aside>
            </>
          )}

          {/* MODO ORGANIZADOR (Item 4) */}
          {viewMode === 'organizer' && (
            <div className="p-8 w-full max-w-5xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 flex items-start gap-4">
                <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-amber-800 mb-1">Arquivos Não Classificados</h2>
                  <p className="text-amber-700 text-sm">O scanner encontrou {unmappedFiles.length} arquivos que não correspondem às regras do `doc-config.yaml`. Arraste-os para as categorias corretas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lista de Não Mapeados */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-bold mb-4 text-slate-700 flex items-center gap-2">
                    <FileCode size={18} /> Pendentes
                  </h3>
                  <div className="space-y-2">
                    {unmappedFiles.map(file => (
                      <div key={file.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center group hover:border-indigo-300 cursor-move transition-colors">
                        <div>
                          <p className="font-medium text-sm text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">{file.path}</p>
                        </div>
                        <button 
                          onClick={() => handleMapFile(file.id, 'Design Document')}
                          className="opacity-0 group-hover:opacity-100 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-bold"
                        >
                          Mover para Docs
                        </button>
                      </div>
                    ))}
                    {unmappedFiles.length === 0 && <p className="text-slate-400 text-sm italic text-center py-4">Tudo organizado!</p>}
                  </div>
                </div>

                {/* Estrutura Atual */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-dashed">
                  <h3 className="font-bold mb-4 text-slate-700 flex items-center gap-2">
                    <Layout size={18} /> Estrutura Atual
                  </h3>
                  {Object.keys(structure).map(shelf => (
                    <div key={shelf} className="mb-2">
                       <div className="p-2 bg-white border border-slate-200 rounded text-sm font-bold text-slate-600 mb-1">{shelf}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODO EXPORTAÇÃO (Item 3) */}
          {viewMode === 'export' && (
            <div className="p-8 w-full max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4 text-indigo-600">
                  <Download size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Gerar Design Document Completo</h2>
                <p className="text-slate-500 mt-2">Selecione os tópicos que deseja incluir no PDF compilado.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
                {Object.entries(structure).map(([shelf, books]) => (
                  <div key={shelf} className="p-4">
                    <label className="flex items-center gap-3 font-bold text-slate-700 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                      {shelf}
                    </label>
                    <div className="ml-8 mt-3 space-y-2">
                      {Object.keys(books).map(book => (
                        <label key={book} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                          {book}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button onClick={() => setViewMode('reader')} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-transform active:scale-95">
                  Baixar PDF Compilado
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}