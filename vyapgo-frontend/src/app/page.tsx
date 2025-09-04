import HeroSection from '@/components/Hero/HeroSection';
import SolutionsSection from '@/components/Solutions/SolutionsSection';

import AppCreationPreview from '@/components/AppCreation/AppCreationPreview';
import PricingSection from '@/components/Pricing/PricingSection';
import Footer from '@/components/Footer/Footer';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SolutionsSection />
      <AppCreationPreview />
      <PricingSection />
      <Footer />
      <OnboardingModal />
    </main>
  );
}

