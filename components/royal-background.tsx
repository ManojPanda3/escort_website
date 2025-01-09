export function RoyalBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-2 0-3.5 1.5-3.5 3.5 0 1.2.6 2.2 1.5 2.8v5.2c-1.6-.3-3.2-.8-4.7-1.5l2.5-4.3c.7-.2 1.2-.8 1.2-1.7 0-1-.8-1.8-1.8-1.8s-1.8.8-1.8 1.8c0 .5.2.9.5 1.3l-2.5 4.3c-1.5-.9-2.8-2-4-3.2l3.9-3.9c.7.3 1.5.2 2.1-.4.7-.7.7-1.9 0-2.6-.7-.7-1.9-.7-2.6 0-.6.6-.7 1.4-.4 2.1l-3.9 3.9c-1.2-1.2-2.3-2.5-3.2-4l4.3-2.5c.3.3.8.5 1.3.5 1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8-1.7.5-1.7 1.2l-4.3 2.5c-.7-1.5-1.2-3.1-1.5-4.7h5.2c.6.9 1.6 1.5 2.8 1.5 2 0 3.5-1.5 3.5-3.5s-1.5-3.5-3.5-3.5z' fill='gold'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}
    />
  )
}

