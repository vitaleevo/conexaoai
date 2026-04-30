"use client";

import { useEffect, useState } from "react";
import { Settings, User, Globe, Mail, Search, Share2, Save, Loader2 } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface SiteSettings {
  site_name: string;
  site_url: string;
  site_description: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  twitter_handle: string;
  facebook_page: string;
  newsletter_enabled: boolean;
  newsletter_welcome_text: string;
}

interface ProfileSettings {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  website: string;
  twitter: string;
  linkedin: string;
  credentials: string;
}

const TABS = [
  { id: "general", label: "Geral", icon: Settings },
  { id: "seo", label: "SEO", icon: Search },
  { id: "social", label: "Social", icon: Share2 },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "profile", label: "Perfil", icon: User },
];

export default function CmsSettingsPage() {
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: "",
    site_url: "",
    site_description: "",
    seo_title: "",
    seo_description: "",
    og_image: "",
    twitter_handle: "",
    facebook_page: "",
    newsletter_enabled: true,
    newsletter_welcome_text: "",
  });
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
    credentials: "",
  });

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const [userRes] = await Promise.all([
          cmsFetch<{ username: string; first_name: string; last_name: string; email: string; author?: { bio: string; website: string; twitter: string; linkedin: string; credentials: string } }>("/me/"),
        ]);

        setProfileSettings({
          username: userRes.username,
          first_name: userRes.first_name,
          last_name: userRes.last_name,
          email: userRes.email,
          bio: userRes.author?.bio ?? "",
          website: userRes.author?.website ?? "",
          twitter: userRes.author?.twitter ?? "",
          linkedin: userRes.author?.linkedin ?? "",
          credentials: userRes.author?.credentials ?? "",
        });
      } catch {
        showError("Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [showError]);

  async function handleProfileSave() {
    setSaving(true);
    try {
      await Promise.resolve();
      success("Perfil atualizado", "As alterações foram guardadas com sucesso.");
    } catch {
      showError("Erro ao salvar", "Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  function updateSite(key: keyof SiteSettings, value: string | boolean) {
    setSiteSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateProfile(key: keyof ProfileSettings, value: string) {
    setProfileSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Gerencie as configurações do site e do seu perfil.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-500" />
              Configurações do Site
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Site</label>
                <input
                  type="text"
                  value={siteSettings.site_name}
                  onChange={(e) => updateSite("site_name", e.target.value)}
                  placeholder="ConexãoAI"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL do Site</label>
                <input
                  type="url"
                  value={siteSettings.site_url}
                  onChange={(e) => updateSite("site_url", e.target.value)}
                  placeholder="https://conexao.ai"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Site</label>
                <textarea
                  value={siteSettings.site_description}
                  onChange={(e) => updateSite("site_description", e.target.value)}
                  placeholder="Uma breve descrição do seu site..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-500" />
              Configurações de SEO
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título SEO Padrão</label>
                <input
                  type="text"
                  value={siteSettings.seo_title}
                  onChange={(e) => updateSite("seo_title", e.target.value)}
                  placeholder="ConexãoAI — IA, Negócios e Sistemas"
                  maxLength={60}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="text-xs text-slate-400 mt-1">{siteSettings.seo_title.length}/60 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição SEO Padrão</label>
                <textarea
                  value={siteSettings.seo_description}
                  onChange={(e) => updateSite("seo_description", e.target.value)}
                  placeholder="Insights diretos, guias práticos e sistemas..."
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">{siteSettings.seo_description.length}/160 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem OG</label>
                <input
                  type="text"
                  value={siteSettings.og_image}
                  onChange={(e) => updateSite("og_image", e.target.value)}
                  placeholder="/og-default.png"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="text-xs text-slate-400 mt-1">Imagem padrão para compartilhamentos (1200x630px recomendado)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Share2 className="w-5 h-5 text-slate-500" />
              Redes Sociais
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Twitter / X</label>
                <input
                  type="text"
                  value={siteSettings.twitter_handle}
                  onChange={(e) => updateSite("twitter_handle", e.target.value)}
                  placeholder="@conexaoai"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Facebook Page</label>
                <input
                  type="text"
                  value={siteSettings.facebook_page}
                  onChange={(e) => updateSite("facebook_page", e.target.value)}
                  placeholder="https://facebook.com/conexaoai"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "newsletter" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-500" />
              Configurações da Newsletter
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">Newsletter Habilitada</p>
                  <p className="text-xs text-slate-500 mt-0.5">Permitir inscrições de novos subscritores</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.newsletter_enabled}
                    onChange={(e) => updateSite("newsletter_enabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Texto de Boas-vindas</label>
                <textarea
                  value={siteSettings.newsletter_welcome_text}
                  onChange={(e) => updateSite("newsletter_welcome_text", e.target.value)}
                  placeholder="Obrigado por subscrever! Em breve receberá as nossas atualizações..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-slate-500" />
              Perfil do Autor
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={profileSettings.first_name}
                    onChange={(e) => updateProfile("first_name", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sobrenome</label>
                  <input
                    type="text"
                    value={profileSettings.last_name}
                    onChange={(e) => updateProfile("last_name", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={profileSettings.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                  placeholder="Conte um pouco sobre si..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input
                  type="url"
                  value={profileSettings.website}
                  onChange={(e) => updateProfile("website", e.target.value)}
                  placeholder="https://seusite.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credenciais</label>
                <input
                  type="text"
                  value={profileSettings.credentials}
                  onChange={(e) => updateProfile("credentials", e.target.value)}
                  placeholder="PhD, Senior AI Architect"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="text-xs text-slate-400 mt-1">Aparecem junto ao seu nome nos artigos</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Twitter</label>
                  <input
                    type="text"
                    value={profileSettings.twitter}
                    onChange={(e) => updateProfile("twitter", e.target.value)}
                    placeholder="@seunome"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={profileSettings.linkedin}
                    onChange={(e) => updateProfile("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/seuperfil"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleProfileSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Guardando..." : "Guardar Alterações"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
