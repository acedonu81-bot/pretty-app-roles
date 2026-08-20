import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAuthor from '@/components/BlogAuthor';
import { BLOG_POSTS, type BlogPostMeta } from '@/data/blogPosts';

const POSTS: BlogPostMeta[] = BLOG_POSTS;

const TAG_COLORS: Record<string, string> = {
  DJ: 'rgba(212,175,55,0.12)',
  Bodas: 'rgba(219,39,119,0.1)',
  Fotografía: 'rgba(79,70,229,0.1)',
  Staff: 'rgba(5,150,105,0.1)',
  Camareros: 'rgba(37,99,235,0.1)',
  Catering: 'rgba(180,83,9,0.1)',
  Maquillaje: 'rgba(219,39,119,0.1)',
  Eventos: 'rgba(109,40,217,0.1)',
  Organizadores: 'rgba(13,148,136,0.1)',
  Promotores: 'rgba(217,119,6,0.1)',
  Mago: 'rgba(124,58,237,0.1)',
  Bailarin: 'rgba(219,39,119,0.1)',
  Animador: 'rgba(234,88,12,0.1)',
  Speaker: 'rgba(37,99,235,0.1)',
  Vestuario: 'rgba(190,24,93,0.1)',
  Humorista: 'rgba(217,119,6,0.1)',
};
const TAG_TEXT: Record<string, string> = {
  DJ: '#8A6D0F', Bodas: '#be185d', Fotografía: '#4338ca',
  Staff: '#047857', Camareros: '#1d4ed8', Catering: '#b45309',
  Maquillaje: '#be185d', Eventos: '#6d28d9', Organizadores: '#0d9488',
  Promotores: '#d97706', Mago: '#7c3aed', Bailarin: '#be185d', Animador: '#ea580c',
  Speaker: '#1d4ed8', Vestuario: '#be185d', Humorista: '#d97706',
};

const ALL_TAGS = ['Todos', ...Array.from(new Set(POSTS.map(p => p.tag)))];

const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }] };
const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Blog XPEAK — Guías para eventos en España', url: 'https://xpeak.es/blog', numberOfItems: POSTS.length, itemListElement: POSTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://xpeak.es${p.slug}`, name: p.title })) };

export default function BlogIndex() {
  const [activeTag, setActiveTag] = useState('Todos');
  const filtered = activeTag === 'Todos' ? POSTS : POSTS.filter(p => p.tag === activeTag);

  return (
    <>
      <Helmet>
        <title>Blog XPEAK — Guías para contratar profesionales de eventos en España</title>
        <meta name="description" content="Guías y consejos para contratar DJs, camareros, fotógrafos y staff para eventos en España. Precios, ratios y todo lo que necesitas saber." />
        <link rel="canonical" href="https://xpeak.es/blog" />
        <meta property="og:title" content="Blog XPEAK — Guías para eventos en España" />
        <meta property="og:description" content="Guías y consejos para contratar profesionales de eventos en España. Precios y ratios." />
        <meta property="og:url" content="https://xpeak.es/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#222' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>X<span style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span></a>
          <div className="flex items-center gap-3">
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#444' }}>Precios</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7a6216' }}>Blog · XPEAK</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: '#111' }}>Guías para eventos en España</h1>
            <p className="text-base leading-relaxed" style={{ color: '#333' }}>
              Precios reales, ratios y consejos prácticos para contratar DJs, camareros, fotógrafos y staff. <span style={{ color: '#111', fontWeight: 600 }}>{POSTS.length} artículos</span>
            </p>
          </div>

          {/* Guías por categoría */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#999' }}>Guías completas</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { href: '/blog/dj-para-eventos', label: 'DJ', desc: '10 guías' },
                { href: '/blog/profesionales-bodas', label: 'Bodas', desc: '16 guías' },
                { href: '/blog/fotografos-eventos', label: 'Fotografía', desc: '4 guías' },
                { href: '/blog/comuniones-guia-completa', label: 'Comuniones', desc: '6 guías' },
                { href: '/blog/staff-para-eventos', label: 'Staff', desc: '9 guías' },
              ].map(hub => (
                <a key={hub.href} href={hub.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', textDecoration: 'none' }}>
                  <div>
                    <p className="text-xs font-black" style={{ color: '#8A6D0F' }}>{hub.label}</p>
                    <p className="text-[0.6rem]" style={{ color: '#777' }}>{hub.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="flex flex-wrap gap-2 mb-8">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={activeTag === tag
                  ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                  : { background: '#fff', color: '#444', border: '1px solid rgba(0,0,0,0.12)' }
                }
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-3">
            {filtered.map(post => (
              <a key={post.slug} href={post.slug}
                className="group block p-5 rounded-xl transition-all hover:scale-[1.005]"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: TAG_COLORS[post.tag] || 'rgba(0,0,0,0.06)', color: TAG_TEXT[post.tag] || '#555' }}>
                    {post.tag}
                  </span>
                </div>
                <h2 className="text-sm font-bold mb-1.5 leading-snug transition-colors" style={{ color: '#161412' }}>{post.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{post.desc}</p>
              </a>
            ))}
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-xs text-center" style={{ color: '#555' }}>
              ¿Buscas profesionales verificados?{' '}
              <a href="/auth" className="underline font-bold" style={{ color: '#8A6D0F' }}>Únete gratis a XPEAK</a>
            </p>
          </div>

                  <BlogEmailCapture variant="presupuestos" intent="general" articlePath="" />
</main>

        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
