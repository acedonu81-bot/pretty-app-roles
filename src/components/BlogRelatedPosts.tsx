import { BLOG_POSTS } from '@/data/blogPosts';

interface BlogRelatedPostsProps {
  currentSlug: string;
  tag: string;
}

export default function BlogRelatedPosts({ currentSlug, tag }: BlogRelatedPostsProps) {
  const related = BLOG_POSTS
    .filter(p => p.tag === tag && p.slug !== currentSlug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="text-lg font-black mb-4" style={{ color: '#161412' }}>También te puede interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map(post => (
          <a key={post.slug} href={post.slug}
            className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1 leading-snug" style={{ color: '#161412' }}>{post.title}</p>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#666' }}>{post.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
