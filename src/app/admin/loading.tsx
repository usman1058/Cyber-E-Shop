export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Loading Admin Panel</p>
          <p className="text-sm text-muted-foreground animate-pulse">Please wait...</p>
        </div>
      </div>
    </div>
  )
}
