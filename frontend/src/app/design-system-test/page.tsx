'use client';

export default function DesignSystemTestPage() {
  return (
    <div className="space-y-12">
      <h1 className="text-display-1 font-serif text-charcoal-900 gradient-text">
        Design System Test
      </h1>

      {/* Color Variables Test */}
      <section>
        <h2 className="text-3xl font-serif mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <div className="h-24 bg-charcoal-900 rounded-xl shadow-luxury"></div>
            <p className="mt-2 text-sm">Charcoal</p>
          </div>
          <div>
            <div className="h-24 bg-gold-400 rounded-xl shadow-luxury"></div>
            <p className="mt-2 text-sm">Gold</p>
          </div>
          <div>
            <div className="h-24 bg-taupe-500 rounded-xl shadow-luxury"></div>
            <p className="mt-2 text-sm">Taupe</p>
          </div>
          <div>
            <div className="h-24 bg-cream-300 rounded-xl shadow-luxury"></div>
            <p className="mt-2 text-sm">Cream</p>
          </div>
          <div>
            <div className="h-24 bg-emerald-500 rounded-xl shadow-luxury"></div>
            <p className="mt-2 text-sm">Emerald</p>
          </div>
        </div>
      </section>

      {/* Shadows Test */}
      <section>
        <h2 className="text-3xl font-serif mb-6">Shadow Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-luxury-sm">
            <p className="text-sm">shadow-luxury-sm</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury">
            <p className="text-sm">shadow-luxury</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury-lg">
            <p className="text-sm">shadow-luxury-lg</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury-xl">
            <p className="text-sm">shadow-luxury-xl</p>
          </div>
        </div>
      </section>

      {/* Animations Test */}
      <section>
        <h2 className="text-3xl font-serif mb-6">Animations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-luxury animate-fade-in">
            <p className="text-sm">fade-in</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury animate-fade-in-up">
            <p className="text-sm">fade-in-up</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury animate-scale-in">
            <p className="text-sm">scale-in</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury animate-pulse-subtle">
            <p className="text-sm">pulse-subtle</p>
          </div>
        </div>
      </section>

      {/* Gradients Test */}
      <section>
        <h2 className="text-3xl font-serif mb-6">Gradient Backgrounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-gradient-luxury rounded-2xl text-white">
            <p className="text-lg">gradient-luxury</p>
          </div>
          <div className="p-8 bg-gradient-gold rounded-2xl text-white">
            <p className="text-lg">gradient-gold</p>
          </div>
        </div>
      </section>

      {/* Typography Test */}
      <section>
        <h2 className="text-3xl font-serif mb-6">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-display-1 font-serif">Display 1 - Playfair</h1>
          <h2 className="text-display-2 font-serif">Display 2 - Playfair</h2>
          <h3 className="text-display-3 font-serif">Display 3 - Playfair</h3>
          <p className="text-xl font-sans">Body text using Inter font family</p>
        </div>
      </section>

      {/* Transition Test */}
      <section>
        <h2 className="text-3xl font-serif mb-6">Transitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-luxury transition-smooth-fast hover:shadow-luxury-xl hover:scale-105">
            <p className="text-sm">Fast (200ms)</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury transition-smooth hover:shadow-luxury-xl hover:scale-105">
            <p className="text-sm">Normal (300ms)</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-luxury transition-smooth-slow hover:shadow-luxury-xl hover:scale-105">
            <p className="text-sm">Slow (600ms)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
