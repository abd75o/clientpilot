export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ClientPilot</span>
          </div>
          <p className="text-gray-500 text-sm">Relancez vos clients, sans effort</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
