export default function DesignSystemTest() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Design System 2.0 Test Page
        </h1>

        {/* Glassmorphism Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">Glassmorphism</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-light rounded-2xl p-6 h-40">
              <p className="text-sm font-medium">Glass Light</p>
            </div>
            <div className="glass-medium rounded-2xl p-6 h-40">
              <p className="text-sm font-medium">Glass Medium</p>
            </div>
            <div className="glass-heavy rounded-2xl p-6 h-40">
              <p className="text-sm font-medium">Glass Heavy</p>
            </div>
          </div>
        </section>

        {/* Shadows Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">Glass Shadows</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 shadow-glass-sm rounded-xl p-6">
              <p className="text-sm">Glass Shadow Small</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 shadow-glass rounded-xl p-6">
              <p className="text-sm">Glass Shadow</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 shadow-glass-lg rounded-xl p-6">
              <p className="text-sm">Glass Shadow Large</p>
            </div>
          </div>
        </section>

        {/* Gradients Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">Gradients</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-emerald-spotlight rounded-2xl p-8 h-40">
              <p className="text-sm font-medium">Emerald Spotlight</p>
            </div>
            <div className="bg-gradient-emerald-zinc-mesh rounded-2xl p-8 h-40">
              <p className="text-sm font-medium">Emerald-Zinc Mesh</p>
            </div>
          </div>
        </section>

        {/* Magnetic Interactions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">Magnetic Interactions</h2>
          <div className="flex gap-4">
            <button className="magnetic-target magnetic-glow bg-emerald-700 text-white px-6 py-3 rounded-xl">
              Magnetic Button
            </button>
            <div className="magnetic-target glass-medium rounded-xl px-8 py-4">
              <p className="text-sm">Magnetic Card</p>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">Animations</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="motion-safe-animate animate-parallax-drift bg-emerald-100 dark:bg-emerald-900 rounded-xl p-6 h-32">
              <p className="text-xs">Parallax Drift</p>
            </div>
            <div className="motion-safe-animate animate-float-orbit bg-emerald-100 dark:bg-emerald-900 rounded-xl p-6 h-32">
              <p className="text-xs">Float Orbit</p>
            </div>
            <div className="motion-safe-animate animate-shimmer-sweep bg-shimmer-sweep bg-shimmer-sweep rounded-xl p-6 h-32">
              <p className="text-xs">Shimmer Sweep</p>
            </div>
            <div className="motion-safe-animate animate-magnetic-pulse bg-white dark:bg-zinc-900 rounded-xl p-6 h-32">
              <p className="text-xs">Magnetic Pulse</p>
            </div>
          </div>
        </section>

        {/* GPU Optimized */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">GPU Optimized</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="gpu-hover gpu-transition bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-premium">
              <p className="text-sm">GPU Hover</p>
            </div>
            <div className="gpu-accelerated bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-premium">
              <p className="text-sm">GPU Accelerated</p>
            </div>
            <div className="gpu-transition bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-premium transform hover:scale-102">
              <p className="text-sm">GPU Scale</p>
            </div>
          </div>
        </section>

        {/* Motion Safe Notice */}
        <section className="glass-medium frosted-border rounded-2xl p-6">
          <h3 className="font-semibold mb-2">♿ Accessibility Notice</h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            All animations respect <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">prefers-reduced-motion</code> settings.
            Enable &quot;Reduce Motion&quot; in your system preferences to test.
          </p>
        </section>
      </div>
    </div>
  )
}
