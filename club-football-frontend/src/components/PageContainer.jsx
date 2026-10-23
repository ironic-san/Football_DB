export function PageContainer({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-14 ${className}`}>{children}</div>
}
