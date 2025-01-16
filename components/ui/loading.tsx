export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-amber-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400"></div>
        </div>
      </div>
    </div>
  )
}
