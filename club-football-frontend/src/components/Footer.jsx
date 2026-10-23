import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>Club Football Database · A reference-style football history explorer.</p>
        <Link to="/" className="focus-ring w-fit font-medium text-pitch hover:text-pitch-dark">Return home</Link>
      </div>
    </footer>
  )
}
