export function SectionHeading({ eyebrow, title, description, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-pitch">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>}
    </div>
  )
}
