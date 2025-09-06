import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

interface Note {
  id: number;
  text: string;
  priority: 'low' | 'medium' | 'high';
}

const DateDisplay = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000); // Update every second for the clock

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <>
      <span className="clock">{date.toLocaleTimeString('pt-BR')}</span>
      <span>{date.toLocaleDateString('pt-BR')}</span>
    </>
  );
};

interface SettingsPageProps {
  onBack: () => void;
  defaultSacPhone: string;
  onDefaultSacPhoneChange: (phone: string) => void;
  consoleModels: string[];
  onConsoleModelsChange: (models: string[]) => void;
}

const SettingsPage = ({ onBack, defaultSacPhone, onDefaultSacPhoneChange, consoleModels, onConsoleModelsChange }: SettingsPageProps) => {
  const [activeTab, setActiveTab] = useState<'telefone' | 'modelos'>('telefone');
  
  // State for phone settings
  const [phoneInput, setPhoneInput] = useState(defaultSacPhone);

  const handleSavePhone = () => {
    onDefaultSacPhoneChange(phoneInput);
    alert('Telefone padrão atualizado com sucesso!');
  };

  // State for model settings
  const [models, setModels] = useState([...consoleModels]);
  const [newModel, setNewModel] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddModel = () => {
    if (newModel.trim() && !models.includes(newModel.trim())) {
      const updatedModels = [...models, newModel.trim()];
      setModels(updatedModels);
      onConsoleModelsChange(updatedModels);
      setNewModel('');
    } else {
      alert('O nome do modelo não pode estar vazio ou já existir.');
    }
  };

  const handleDeleteModel = (indexToDelete: number) => {
    if (window.confirm(`Tem certeza que deseja remover o modelo "${models[indexToDelete]}"?`)) {
      const updatedModels = models.filter((_, index) => index !== indexToDelete);
      setModels(updatedModels);
      onConsoleModelsChange(updatedModels);
    }
  };
  
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(models[index]);
  };

  const handleSaveEdit = (indexToSave: number) => {
    if (editingText.trim()) {
      const updatedModels = [...models];
      updatedModels[indexToSave] = editingText.trim();
      setModels(updatedModels);
      onConsoleModelsChange(updatedModels);
      setEditingIndex(null);
      setEditingText('');
    } else {
      alert('O nome do modelo não pode estar vazio.');
    }
  };

  return (
    <div className="settings-page">
      <header className="app-header settings-header">
        <h1>Configuração Workstation</h1>
        <button onClick={onBack} className="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="white" aria-hidden="true">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>Voltar</span>
        </button>
      </header>
      <div className="settings-container">
        <nav className="settings-menu">
          <button onClick={() => setActiveTab('telefone')} className={`menu-item ${activeTab === 'telefone' ? 'active' : ''}`}>Telefone Padrão</button>
          <button onClick={() => setActiveTab('modelos')} className={`menu-item ${activeTab === 'modelos' ? 'active' : ''}`}>Modelos de Console</button>
        </nav>
        <main className="settings-content">
          {activeTab === 'telefone' && (
            <div className="settings-section phone-settings-section">
              <h2>Alterar Telefone Padrão (SAC)</h2>
              <p>Este número será usado como o destinatário padrão "SAC DYLAN" e "Padrão (SAC)" nas opções de envio.</p>
              <div className="form-group">
                <label htmlFor="default-phone">Número do WhatsApp (com código do país e DDD)</label>
                <input id="default-phone" type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="+5511912345678" />
              </div>
              <button onClick={handleSavePhone} className="submit-btn">Salvar Telefone</button>
            </div>
          )}
          {activeTab === 'modelos' && (
             <div className="settings-section">
              <h2>Gerenciar Modelos de Console</h2>
              <p>Adicione, renomeie ou remova modelos que aparecerão na lista de seleção do formulário principal.</p>
              <div className="add-model-form">
                <input 
                  type="text" 
                  value={newModel} 
                  onChange={(e) => setNewModel(e.target.value)} 
                  placeholder="Nome do novo modelo"
                  aria-label="Nome do novo modelo"
                />
                <button onClick={handleAddModel}>Adicionar</button>
              </div>
              <ul className="model-list">
                {models.map((model, index) => (
                  <li key={index} className="model-item">
                    {editingIndex === index ? (
                      <input 
                        type="text" 
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="edit-model-input"
                      />
                    ) : (
                      <span>{model}</span>
                    )}
                    <div className="model-item-controls">
                      {editingIndex === index ? (
                        <button onClick={() => handleSaveEdit(index)} className="save-model-btn">Salvar</button>
                      ) : (
                        <button onClick={() => handleStartEdit(index)} className="edit-model-btn">Renomear</button>
                      )}
                      <button onClick={() => handleDeleteModel(index)} className="delete-model-btn">Remover</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');

  const INITIAL_MODELS = [
    'Axios 16', 'Axios 24', 'Axios 32',
    'Atrium 12', 'Atrium 20', 'Atrium 32',
    'Axios 8', 'Atrium 8', 'StagePro 16', 'StagePro 24',
    'PRISMA 480', 'VIRTUS480'
  ];
  const INITIAL_SAC_PHONE = '+5511910251959';

  const [defaultSacPhone, setDefaultSacPhone] = useState(() => {
    return localStorage.getItem('defaultSacPhone') || INITIAL_SAC_PHONE;
  });
  const [consoleModels, setConsoleModels] = useState<string[]>(() => {
      try {
          const storedModels = localStorage.getItem('consoleModels');
          return storedModels ? JSON.parse(storedModels) : INITIAL_MODELS;
      } catch (e) {
          console.error("Failed to load console models from local storage", e);
          return INITIAL_MODELS;
      }
  });

  useEffect(() => {
    localStorage.setItem('defaultSacPhone', defaultSacPhone);
  }, [defaultSacPhone]);

  useEffect(() => {
    localStorage.setItem('consoleModels', JSON.stringify(consoleModels));
  }, [consoleModels]);


  const [formData, setFormData] = useState({
    name: '',
    phone: '+55',
    purchaseDate: '',
    store: '',
    model: consoleModels[0] || '',
    defect: '',
    warranty: 'in_warranty',
    customerType: 'consumidor_final',
  });
  
  // Ensures the form's selected model is always valid.
  useEffect(() => {
    // If the currently selected model in the form doesn't exist in the available models list
    // (e.g., it was deleted or renamed in settings), reset it to the first available model.
    if (!consoleModels.includes(formData.model)) {
      setFormData(prev => ({
        ...prev,
        model: consoleModels[0] || ''
      }));
    }
  }, [consoleModels]);

  const [message, setMessage] = useState('');
  const [quickMessagePhone, setQuickMessagePhone] = useState('+55');
  const [phoneSelectionMode, setPhoneSelectionMode] = useState<'default' | 'optional'>('optional');
  
  // Protocol generator destination phone state
  const [protocolPhoneSelectionMode, setProtocolPhoneSelectionMode] = useState<'default' | 'optional'>('default');
  const [protocolOptionalPhone, setProtocolOptionalPhone] = useState('+55');
  
  const defaultQuickMessage = `Tudo bem?
Sou do setor de Suporte Técnico da Duonn Sound e estou aqui para te ajudar com o que for preciso!
Só um instante, estou verificando algumas informações. 😊

Enquanto isso, pra facilitar e agilizar o atendimento, você pode me descrever o problema ou a dúvida que está enfrentando? Assim consigo entender melhor e resolver o mais rápido possível. 😉

Fico no aguardo da sua mensagem! 💬`;

  const [quickMessageText, setQuickMessageText] = useState(`Bom dia! ${defaultQuickMessage}`);
  
  // Notepad state
  const [noteInput, setNoteInput] = useState('');
  const [notePriority, setNotePriority] = useState<'low' | 'medium' | 'high'>('low');
  const [savedNotes, setSavedNotes] = useState<(Note | null)[]>([null, null, null]);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [editedNoteText, setEditedNoteText] = useState<string>('');
  
  useEffect(() => {
    try {
      const notesFromStorage = localStorage.getItem('savedNotes');
      if (notesFromStorage) {
        const loaded = JSON.parse(notesFromStorage);
        if (Array.isArray(loaded)) {
          const paddedNotes = [...loaded.slice(0, 3), ...Array(3 - loaded.slice(0, 3).length).fill(null)];
          setSavedNotes(paddedNotes);
        }
      }
    } catch (error) {
      console.error("Failed to load notes from local storage", error);
      setSavedNotes([null, null, null]); // Reset on error
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
    } 
    catch (error) {
      console.error("Failed to save notes to local storage", error);
    }
  }, [savedNotes]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${day}${month}${year}`;
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    const protocolNumber = `${cleanedPhone}${dateString}`;

    const textMessage = `
Olá! Este é um resumo da sua solicitação de suporte para a Duonn Sound estaremos te encaminhando para o SAC DYLAN que entrará em contato em breve para concluir o protocolo da sua solicitação.

*Dados do Cliente:*
- Nome: ${formData.name}
- Telefone: ${formData.phone}
- Tipo: ${formData.customerType === 'lojista' ? 'Lojista' : 'Consumidor Final'}

*Dados da Compra:*
- Loja: ${formData.store}
- Data: ${new Date(formData.purchaseDate).toLocaleDateString('pt-BR')}
- Garantia: ${formData.warranty === 'in_warranty' ? 'Em Garantia' : 'Fora de Garantia'}

*Dados do Produto:*
- Modelo: ${formData.model}
- Defeito: ${formData.defect}

Para mais informações do seu produto apos o envio entre em contato por este canal S.A.C DYLAN  \u202a${defaultSacPhone}\u202c

*Protocolo de Atendimento:* ${protocolNumber}
    `.trim().replace(/\n\s*\n/g, '\n');

    const encodedMessage = encodeURIComponent(textMessage);
    
    const destinationPhoneNumberRaw = protocolPhoneSelectionMode === 'default'
      ? defaultSacPhone
      : protocolOptionalPhone;

    const destinationPhoneNumber = destinationPhoneNumberRaw.replace(/\D/g, '');

    if (protocolPhoneSelectionMode === 'optional' && (!destinationPhoneNumberRaw || destinationPhoneNumber.length < 10)) {
        alert('Por favor, insira um número de WhatsApp válido para o destinatário.');
        return;
    }

    const whatsappUrl = `https://wa.me/${destinationPhoneNumber}?text=${encodedMessage}`;

    setMessage('Gerando sua mensagem para o WhatsApp...');
    
    window.open(whatsappUrl, '_blank');

    setTimeout(() => setMessage(''), 3000);
  };

  const handleExport = () => {
    if (!formData.name && !formData.phone) {
      alert("Preencha o formulário antes de exportar.");
      return;
    }

    const headers = [
      'Nome',
      'Telefone',
      'Tipo de Cliente',
      'Loja',
      'Data da Compra',
      'Garantia',
      'Modelo',
      'Defeito'
    ];

    const data = [
      formData.name,
      formData.phone,
      formData.customerType === 'lojista' ? 'Lojista' : 'Consumidor Final',
      formData.store,
      formData.purchaseDate ? new Date(formData.purchaseDate).toLocaleDateString('pt-BR') : '',
      formData.warranty === 'in_warranty' ? 'Em Garantia' : 'Fora de Garantia',
      formData.model,
      formData.defect
    ].map(field => `"${String(field).replace(/"/g, '""')}"`);

    const csvContent = [
      headers.join(','),
      data.join(',')
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeFileName = formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    link.download = `cadastro_${safeFileName || 'cliente'}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleSetGreeting = (greeting: string) => {
    setQuickMessageText(`${greeting} ${defaultQuickMessage}`);
  };

  const sendQuickMessage = () => {
    const targetPhone = phoneSelectionMode === 'default' ? defaultSacPhone : quickMessagePhone;

    if (!targetPhone || targetPhone.length < 10) {
        alert('Por favor, insira um número de WhatsApp válido.');
        return;
    }
    if (!quickMessageText.trim()) {
        alert('A mensagem não pode estar vazia.');
        return;
    }

    const cleanedPhone = targetPhone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(quickMessageText);
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleSaveNote = () => {
    const firstEmptyIndex = savedNotes.findIndex(note => note === null);
    if (firstEmptyIndex === -1) {
      alert('Limite de 3 notas atingido. Apague uma nota para adicionar outra.');
      return;
    }
    if (!noteInput.trim()) {
      alert('A anotação não pode estar vazia.');
      return;
    }
    const newNote: Note = {
      id: Date.now(),
      text: noteInput,
      priority: notePriority,
    };
    const newNotes = [...savedNotes];
    newNotes[firstEmptyIndex] = newNote;
    setSavedNotes(newNotes);
    setNoteInput('');
    setNotePriority('low');
  };

  const handleDeleteNote = (id: number) => {
    setSavedNotes(prev => {
        const newNotes = [...prev];
        const noteIndex = newNotes.findIndex(note => note?.id === id);
        if (noteIndex > -1) {
            newNotes[noteIndex] = null;
        }
        return newNotes;
    });

    if (expandedNoteId === id) {
      setExpandedNoteId(null);
      setEditedNoteText('');
    }
  };

  const handleNoteClick = (id: number) => {
    if (expandedNoteId === id) {
      setExpandedNoteId(null);
      setEditedNoteText('');
    } else {
      const noteToEdit = savedNotes.find(note => note?.id === id);
      if (noteToEdit) {
        setExpandedNoteId(id);
        setEditedNoteText(noteToEdit.text);
      }
    }
  };

  const handleUpdateNote = (id: number) => {
    setSavedNotes(prev => prev.map(note =>
        note?.id === id ? { ...note, text: editedNoteText } : note
    ));
    alert('Nota atualizada!');
  };

  const areAllNotesSaved = savedNotes.every(note => note !== null);

  return (
    <>
      {currentPage === 'settings' && (
          <SettingsPage 
            onBack={() => setCurrentPage('main')}
            defaultSacPhone={defaultSacPhone}
            onDefaultSacPhoneChange={setDefaultSacPhone}
            consoleModels={consoleModels}
            onConsoleModelsChange={setConsoleModels}
          />
      )}

      {currentPage === 'main' && (
        <>
          <div className="container">
            <header className="app-header">
              <img src="https://yt3.googleusercontent.com/BF0uGWCP5u6HLQEfgqXP-Nmt40uU45bm6FlfWLl8iS3x6ue3CisXve2XScLbPPngYnm9YGkSzA=s900-c-k-c0x00ffffff-no-rj" alt="Duonn Sound Logo" className="logo" />
              <div className="header-titles">
                <h1>Duonn Sound</h1>
              </div>
              <button className="settings-btn" aria-label="Configurações" title="Configurações" onClick={() => setCurrentPage('settings')}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                </svg>
              </button>
              <div className="header-info">
                 <span>Midimovie soft 2025</span>
                 <DateDisplay />
              </div>
            </header>
            <p className="instructions">Gerador de protocolo SAC</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Nome Completo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Seu Telefone WhatsApp (com DDD)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="(11) 99999-8888"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Seu Telefone WhatsApp com DDD"
                />
              </div>
              
              <div className="form-group">
                <label>Destinatário da Mensagem</label>
                <div className="radio-group" role="radiogroup" aria-label="Destinatário da mensagem do protocolo">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="protocolPhoneSelection"
                      value="default"
                      checked={protocolPhoneSelectionMode === 'default'}
                      onChange={() => setProtocolPhoneSelectionMode('default')}
                    />
                    <span>Padrão (SAC DYLAN)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="protocolPhoneSelection"
                      value="optional"
                      checked={protocolPhoneSelectionMode === 'optional'}
                      onChange={() => setProtocolPhoneSelectionMode('optional')}
                    />
                    <span>Outro</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                 <label htmlFor="protocolOptionalPhone">Telefone do Destinatário</label>
                 <input
                   type="tel"
                   id="protocolOptionalPhone"
                   name="protocolOptionalPhone"
                   placeholder="(11) 99999-8888"
                   value={protocolPhoneSelectionMode === 'default' ? defaultSacPhone : protocolOptionalPhone}
                   onChange={(e) => setProtocolOptionalPhone(e.target.value)}
                   disabled={protocolPhoneSelectionMode === 'default'}
                   aria-label="Telefone do Destinatário"
                 />
               </div>

              <div className="form-group">
                <label htmlFor="purchaseDate">Data da Compra</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Data da Compra"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status da Garantia</label>
                  <div className="radio-group" role="radiogroup" aria-label="Status da Garantia">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="warranty"
                        value="in_warranty"
                        checked={formData.warranty === 'in_warranty'}
                        onChange={handleChange}
                      />
                      <span>Em Garantia</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="warranty"
                        value="out_of_warranty"
                        checked={formData.warranty === 'out_of_warranty'}
                        onChange={handleChange}
                      />
                      <span>Fora de Garantia</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tipo de Cliente</label>
                  <div className="radio-group" role="radiogroup" aria-label="Tipo de Cliente">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="customerType"
                        value="lojista"
                        checked={formData.customerType === 'lojista'}
                        onChange={handleChange}
                      />
                      <span>Lojista</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="customerType"
                        value="consumidor_final"
                        checked={formData.customerType === 'consumidor_final'}
                        onChange={handleChange}
                      />
                      <span>Consumidor final</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="store">Nome da Loja</label>
                <input
                  type="text"
                  id="store"
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Nome da Loja"
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Modelo do Console</label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Modelo do Console"
                >
                  {consoleModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="defect">Defeito do Aparelho</label>
                <textarea
                  id="defect"
                  name="defect"
                  value={formData.defect}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Defeito do Aparelho"
                  rows={3}
                />
              </div>
              <div className="submit-container">
                <button type="submit" className="submit-btn">
                   <svg fill="white" height="24" width="24" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  <span>Gerar Mensagem no WhatsApp</span>
                </button>
                <button type="button" className="export-btn" onClick={handleExport}>
                  Exportar Cadastro
                </button>
              </div>
              {message && <p className="message success">{message}</p>}
            </form>
          </div>

          <div className="container">
             <h3 className="quick-message-title">Mensagens Rápidas</h3>
             <div className="quick-message-controls">
                <button type="button" className="quick-btn" onClick={() => handleSetGreeting('Bom dia!')}>Bom Dia</button>
                <button type="button" className="quick-btn" onClick={() => handleSetGreeting('Boa tarde!')}>Boa Tarde</button>
                <button type="button" className="quick-btn" onClick={() => setQuickMessageText('Fico feliz MUITO BOM em poder ter resolvido tua duvida .. e não se esqueça de seguir nossos tutoriais e redes sociais .Estamos aqui ta bom ? Ate logo A duonn sound agradece seu contato.')}>Agradecemos</button>
                <button type="button" className="quick-btn" onClick={() => setQuickMessageText(`Para continuar teu atendimento e redirecionar teu equipamento para asistencia tecnica :\n\n\nNome completo :\n\nCidade e estado :\n\nData da compra :\n\nNome da loja :\n\nData da compra :\n\nFavor digitar estes campos ..\n\n\nficamos no aguardo destas informações …`)}>Assistência</button>
                <button type="button" className="quick-btn" onClick={() => setQuickMessageText('[COLE O LINK AQUI] siga os passos deste tutorial que será de grande ajuda')}>link</button>
                <button type="button" className="quick-btn" onClick={() => setQuickMessageText(`Estamos animados para anunciar que em breve estaremos lançando uma nova versão do nosso software. Apesar do entusiasmo, não temos uma previsão exata para o lançamento dessa versão atualizada. Agradecemos sua compreensão e apoio, e esperamos que as novidades sejam valiosas para você!`)}>Versao aguarde</button>
             </div>
             <div className="form-group">
              <label>Destinatário</label>
              <div className="radio-group" role="radiogroup" aria-label="Destinatário da mensagem rápida">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="phoneSelection"
                    value="default"
                    checked={phoneSelectionMode === 'default'}
                    onChange={() => setPhoneSelectionMode('default')}
                  />
                  <span>Padrão (SAC)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="phoneSelection"
                    value="optional"
                    checked={phoneSelectionMode === 'optional'}
                    onChange={() => setPhoneSelectionMode('optional')}
                  />
                  <span>Outro</span>
                </label>
              </div>
            </div>
             <div className="form-group">
                <label htmlFor="quickMessagePhone">Número do WhatsApp</label>
                <input 
                  id="quickMessagePhone"
                  type="tel" 
                  placeholder="(11) 99999-8888" 
                  value={phoneSelectionMode === 'default' ? defaultSacPhone : quickMessagePhone}
                  onChange={(e) => setQuickMessagePhone(e.target.value)}
                  disabled={phoneSelectionMode === 'default'}
                  aria-label="Número do WhatsApp do Destinatário"
                />
             </div>
             <div className="form-group">
                <label htmlFor="quickMessageText">Mensagem</label>
                <textarea 
                  id="quickMessageText"
                  value={quickMessageText} 
                  onChange={(e) => setQuickMessageText(e.target.value)}
                  rows={4}
                  aria-live="polite"
                />
             </div>
             <div className="submit-container">
                <button type="button" className="submit-btn" onClick={sendQuickMessage} style={{width: '100%'}}>
                    <svg fill="white" height="24" width="24" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    <span>Enviar Mensagem Rápida</span>
                </button>
             </div>
          </div>
          
          <div className="container">
            <div className="notepad-section">
              <h3 className="quick-message-title">Bloco de Notas</h3>
              <div className="form-group">
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Anotações para uso interno..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  maxLength={135}
                  rows={3}
                  aria-label="Bloco de Notas"
                />
                <div className="char-counter" aria-live="polite">
                  {noteInput.length} / 135
                </div>
              </div>
              
              <div className="note-selectors-container">
                {savedNotes.map((note, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`note-selector-btn ${note ? `priority-${note.priority}` : ''} ${expandedNoteId === note?.id ? 'active' : ''}`}
                    onClick={() => note && handleNoteClick(note.id)}
                    disabled={!note}
                    aria-label={`Abrir nota ${index + 1}`}
                  >
                    Nota {index + 1}
                  </button>
                ))}
              </div>

              <div className="notepad-controls">
                  <div className="form-group">
                      <label htmlFor="priority-select">Prioridade</label>
                      <select 
                          id="priority-select" 
                          value={notePriority} 
                          onChange={(e) => setNotePriority(e.target.value as 'low' | 'medium' | 'high')}
                      >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                      </select>
                  </div>
                  <button 
                    type="button" 
                    className="save-note-btn" 
                    onClick={handleSaveNote}
                    disabled={areAllNotesSaved}
                    title={areAllNotesSaved ? 'Limite de 3 notas atingido. Apague uma nota para adicionar outra.' : 'Salvar anotação'}
                  >
                    Salvar Nota
                  </button>
              </div>

              <div className="saved-notes-list">
                {savedNotes.every(note => note === null) ? (
                  <p className="no-notes-message">Nenhuma nota salva.</p>
                ) : (
                    <div className="expanded-note-container">
                      {(() => {
                        const expandedNote = savedNotes.find(note => note?.id === expandedNoteId);
                        if (!expandedNote) return <div className="no-note-selected">Selecione uma nota para visualizar e editar.</div>;
                        
                        return (
                          <div className={`note-item-editable priority-${expandedNote.priority}`}>
                            <textarea
                              value={editedNoteText}
                              onChange={(e) => setEditedNoteText(e.target.value)}
                              maxLength={135}
                              className="note-edit-textarea"
                              aria-label="Editar anotação"
                              rows={4}
                            />
                            <div className="note-item-actions">
                              <button
                                type="button"
                                className="delete-note-btn"
                                onClick={() => handleDeleteNote(expandedNote.id)}
                                aria-label="Deletar nota"
                              >
                                &times;
                              </button>
                               <button 
                                type="button" 
                                className="update-note-btn"
                                onClick={() => handleUpdateNote(expandedNote.id)}
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                )}
              </div>
            </div>
            
            <footer className="app-footer">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google Logo" className="google-logo" />
                <p className="footer-credit">Projeto do eng senior FernandoBruzau by Google Gemini ® versao. v25.1</p>
            </footer>
          </div>
        </>
      )}
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);