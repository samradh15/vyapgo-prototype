export const YANTRA_THEMES = {
    SACRED_SAFFRON: {
      primary: '#FF9933',
      secondary: '#FF6600', 
      accent: '#DC143C',
      divine: '#FFF8DC',
      grounding: '#8B4513',
      gradient: 'radial-gradient(ellipse at center, #FFD700 0%, #FF9933 35%, #FF6600 70%, #8B0000 100%)'
    },
    DIVINE_GOLD: {
      primary: '#FFD700',
      secondary: '#DAA520',
      accent: '#B8860B', 
      divine: '#FFFAF0',
      grounding: '#654321',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FF4500 75%, #8B0000 100%)'
    },
    TEMPLE_CRIMSON: {
      primary: '#8B0000',
      secondary: '#DC143C',
      accent: '#FF6347',
      divine: '#FFF8DC', 
      grounding: '#2F4F4F',
      gradient: 'radial-gradient(circle at 30% 70%, #8B0000 0%, #DC143C 40%, #FF6347 80%, #FFD700 100%)'
    }
  } as const;
  
  export const SANSKRIT_TYPOGRAPHY = {
    primary: 'var(--font-devanagari), "Mukti Narrow", "Mangal", serif',
    secondary: 'var(--font-noto-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sacred: 'var(--font-devanagari), "Siddhanta", serif',
    display: 'var(--font-devanagari), cursive'
  } as const;
  
  
  export const ANIMATION_CONFIG = {
    yantraRotation: {
      duration: 60000,
      easing: 'linear',
      iterations: 'infinite'
    },
    lotusBloom: {
      duration: 2000,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      delay: 500
    },
    sacredPulse: {
      duration: 4000,
      easing: 'ease-in-out',
      iterations: 'infinite'
    },
    divineSlide: {
      duration: 3000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  } as const;
  
  export const SACRED_MANTRAS = {
    intention: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः',
    creation: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
    completion: 'सर्वं शुभमस्तु सर्वं मङ्गलमस्तु',
    prosperity: 'ॐ गं गणपतये नमः'
  } as const;
  