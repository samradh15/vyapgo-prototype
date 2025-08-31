'use client';

import { useState, useCallback } from 'react';

interface AIMessage {
  content: string;
  features?: string[];
}

interface ChatContext {
  businessIdea: string;
  language: 'hindi' | 'english';
  previousMessages: any[];
}

interface UseAIChatOptions {
  onMessage?: (content: string, features?: string[]) => void;
  onError?: (error: string) => void;
  onAppBuildingStart?: () => void;
}

export const useAIChat = (options: UseAIChatOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  // Simulate AI responses - Replace with real API integration
  const generateAIResponse = useCallback(async (
    userMessage: string, 
    context: ChatContext
  ): Promise<AIMessage> => {
    const { businessIdea, language, previousMessages } = context;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Enhanced AI responses based on conversation flow
    const responses = language === 'hindi' ? {
      users: {
        content: `बहुत बढ़िया! आपके ऐप के मुख्य उपयोगकर्ता "${userMessage}" हैं।\n\nअब बताएं कि ये उपयोगकर्ता आपके ऐप में सबसे पहले क्या करना चाहेंगे? उदाहरण के लिए:\n• खरीदारी करना\n• सेवाएं देखना\n• बुकिंग करना\n• जानकारी खोजना`,
        features: ['उपयोगकर्ता पंजीकरण', 'प्रोफाइल प्रबंधन', 'खोज सुविधा']
      },
      features: {
        content: `शानदार विचार! मैं समझ गया कि उपयोगकर्ता "${userMessage}" करना चाहते हैं।\n\nइसके लिए हमें इन मुख्य स्क्रीन्स की जरूरत होगी:\n1. होम स्क्रीन\n2. उत्पाद/सेवा सूची\n3. विवरण पृष्ठ\n4. चेकआउट/बुकिंग\n\nक्या आप चाहते हैं कि उपयोगकर्ता बिना पंजीकरण के भी ऐप का इस्तेमाल कर सकें?`,
        features: ['होम स्क्रीन', 'लिस्टिंग पेज', 'प्रोडक्ट डिटेल', 'चेकआउट सिस्टम']
      },
      registration: {
        content: `समझ गया! अब मैं आपके ऐप का पूरा स्ट्रक्चर तैयार करता हूं।\n\nआपके ऐप में होंगे:\n✅ आसान साइन अप/लॉगिन\n✅ गेस्ट एक्सेस\n✅ सोशल मीडिया लॉगिन\n✅ OTP वेरिफिकेशन\n\nअब मैं आपके ऐप का डिज़ाइन बनाना शुरू करता हूं!`,
        features: ['यूजर ऑथेंटिकेशन', 'गेस्ट मोड', 'सोशल लॉगिन', 'OTP सिस्टम']
      }
    } : {
      users: {
        content: `Excellent! Your app's main users are "${userMessage}".\n\nNow tell me, what would these users want to do first in your app? For example:\n• Make purchases\n• Browse services\n• Make bookings\n• Search for information`,
        features: ['User Registration', 'Profile Management', 'Search Feature']
      },
      features: {
        content: `Great idea! I understand users want to "${userMessage}".\n\nFor this, we'll need these main screens:\n1. Home Screen\n2. Product/Service Listing\n3. Detail Pages\n4. Checkout/Booking\n\nWould you like users to access the app without registration too?`,
        features: ['Home Screen', 'Listing Page', 'Product Detail', 'Checkout System']
      },
      registration: {
        content: `Got it! Now I'll prepare your complete app structure.\n\nYour app will have:\n✅ Easy Sign Up/Login\n✅ Guest Access\n✅ Social Media Login\n✅ OTP Verification\n\nNow I'll start designing your app!`,
        features: ['User Authentication', 'Guest Mode', 'Social Login', 'OTP System']
      }
    };

    // Simple conversation flow logic
    const messageCount = previousMessages.length;
    if (messageCount <= 3) {
      return responses.users;
    } else if (messageCount <= 6) {
      return responses.features;
    } else {
      // Trigger app building phase
      setTimeout(() => options.onAppBuildingStart?.(), 1000);
      return responses.registration;
    }
  }, [options]);

  const sendMessage = useCallback(async (
    message: string, 
    context: ChatContext
  ) => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Add user message to context
      setConversationContext(prev => [...prev, message]);

      // Generate AI response
      const response = await generateAIResponse(message, context);
      
      // Add AI response to context
      setConversationContext(prev => [...prev, response.content]);
      
      setIsTyping(false);
      
      // Send response to parent
      options.onMessage?.(response.content, response.features);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI processing failed';
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [generateAIResponse, options]);

  return {
    sendMessage,
    isLoading,
    isTyping,
    conversationContext
  };
};
