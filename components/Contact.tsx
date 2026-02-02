
import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ContactFormData } from '../types';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    objective: 'Mentoria Individual',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            objective: formData.objective,
            message: formData.message
          }
        ]);

      if (error) throw error;

      // Sucesso
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        objective: 'Mentoria Individual',
        message: ''
      });

      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
      setErrorMessage('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-32">
      <div className="bg-white rounded-[40px] border border-[#e7e9f3] p-8 lg:p-20 shadow-sm overflow-hidden flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-4xl serif-font font-bold mb-8">Vamos dar o próximo passo?</h2>
          <p className="text-text-muted text-lg font-light mb-12">
            Escolha como prefere iniciar nossa conversa. Estamos prontos para ouvir seus desafios.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/5 rounded-xl text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">E-mail</p>
                <p className="text-text-muted text-sm">contato@inefavel.com.br</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/5 rounded-xl text-primary">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">WhatsApp</p>
                <p className="text-text-muted text-sm">+55 (11) 99999-9999</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/5 rounded-xl text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Escritório</p>
                <p className="text-text-muted text-sm">São Paulo, SP - Virtual Office Global</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="bg-[#fcfcf9] border border-[#e7e9f3] rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">E-mail Corporativo *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="bg-[#fcfcf9] border border-[#e7e9f3] rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Objetivo do Contato</label>
              <select
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                className="bg-[#fcfcf9] border border-[#e7e9f3] rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all appearance-none"
              >
                <option>Mentoria Individual</option>
                <option>Consultoria Estratégica</option>
                <option>Criação de Conteúdo / Branding</option>
                <option>Palestras e Workshops</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Sua Mensagem *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos brevemente sobre o seu momento atual..."
                rows={4}
                className="bg-[#fcfcf9] border border-[#e7e9f3] rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all resize-none"
                required
              />
            </div>

            {/* Mensagens de status */}
            {submitStatus === 'success' && (
              <div className="md:col-span-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 text-sm">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="md:col-span-2 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{errorMessage}</p>
              </div>
            )}

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Pedido de Diagnóstico'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
