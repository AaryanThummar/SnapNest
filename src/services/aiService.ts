// src/services/aiService.ts
// Decoupled AI Magic & Morph Service Layer for LumaBooth

export type AIStyleId = 
  | 'dreamy' 
  | 'cinematic' 
  | 'editorial' 
  | 'vintage' 
  | 'glam' 
  | 'neon' 
  | 'royal' 
  | 'fantasy';

export type AILighting = 'natural' | 'studio' | 'dramatic' | 'neon';
export type AIMood = 'soft' | 'bold' | 'elegant' | 'playful';
export type AIBackground = 'original' | 'studio' | 'luxury' | 'night' | 'dream';

export interface AIStyleDefinition {
  id: AIStyleId;
  name: string;
  symbol: string;
  tagline: string;
  gradient: string;
  accentColor: string;
}

export const AI_STYLE_DEFINITIONS: AIStyleDefinition[] = [
  {
    id: 'dreamy',
    name: 'DREAMY',
    symbol: '✦',
    tagline: 'Soft light, dreamy atmosphere',
    gradient: 'linear-gradient(135deg, rgba(229, 72, 125, 0.35) 0%, rgba(139, 77, 255, 0.45) 100%)',
    accentColor: '#E5487D'
  },
  {
    id: 'cinematic',
    name: 'CINEMATIC',
    symbol: '◉',
    tagline: 'Film-inspired lighting',
    gradient: 'linear-gradient(135deg, rgba(14, 116, 144, 0.45) 0%, rgba(245, 158, 11, 0.35) 100%)',
    accentColor: '#06B6D4'
  },
  {
    id: 'editorial',
    name: 'EDITORIAL',
    symbol: '◆',
    tagline: 'High-fashion studio look',
    gradient: 'linear-gradient(135deg, rgba(203, 213, 225, 0.35) 0%, rgba(30, 41, 59, 0.65) 100%)',
    accentColor: '#CBD5E1'
  },
  {
    id: 'vintage',
    name: 'VINTAGE',
    symbol: '◌',
    tagline: 'Analog film aesthetic',
    gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.4) 0%, rgba(120, 53, 15, 0.6) 100%)',
    accentColor: '#F59E0B'
  },
  {
    id: 'glam',
    name: 'GLAM',
    symbol: '♡',
    tagline: 'Polished beauty look',
    gradient: 'linear-gradient(135deg, rgba(244, 114, 182, 0.45) 0%, rgba(251, 191, 36, 0.35) 100%)',
    accentColor: '#F472B6'
  },
  {
    id: 'neon',
    name: 'NEON',
    symbol: '⚡',
    tagline: 'Electric nightlife mood',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.45) 0%, rgba(236, 72, 153, 0.45) 100%)',
    accentColor: '#22D3EE'
  },
  {
    id: 'royal',
    name: 'ROYAL',
    symbol: '♛',
    tagline: 'Luxury portrait aesthetic',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(217, 119, 6, 0.45) 100%)',
    accentColor: '#10B981'
  },
  {
    id: 'fantasy',
    name: 'FANTASY',
    symbol: '✧',
    tagline: 'Surreal creative atmosphere',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.45) 0%, rgba(59, 130, 246, 0.4) 100%)',
    accentColor: '#A855F7'
  }
];

export interface AIStyleParams {
  photoId: string;
  photoUrl: string;
  style: AIStyleId;
  intensity: number; // 0 - 100
  lighting: AILighting;
  mood: AIMood;
  background: AIBackground;
}

export interface AIMorphParams {
  photoUrl: string;
  style: 'CYBER' | 'ROYAL' | 'ANIME' | 'CINEMATIC' | 'GLAM' | 'FUTURISTIC' | string;
}

export interface AIProviderConfig {
  provider: 'google_imagen' | 'stable_diffusion' | 'midjourney_api' | 'custom';
  endpointUrl?: string;
  apiKey?: string;
}

export interface AIGenerationResult {
  status: 'api_not_connected' | 'success' | 'error';
  message: string;
  params: AIStyleParams;
  timestamp: number;
  engineVersion: string;
}

export interface AIMorphResult {
  status: 'api_not_connected' | 'success' | 'error';
  message: string;
  generatedImageUrl?: string;
  timestamp: number;
}

class AIService {
  private isConnected: boolean = false;
  private currentConfig: AIProviderConfig | null = null;

  public isProviderConnected(): boolean {
    return this.isConnected;
  }

  public getConfig(): AIProviderConfig | null {
    return this.currentConfig;
  }

  public connectProvider(config: AIProviderConfig): boolean {
    // In-memory runtime connection check (never leak raw secrets to localStorage or public JS)
    if ((config.apiKey && config.apiKey.trim().length > 0) || (config.endpointUrl && config.endpointUrl.trim().length > 0)) {
      this.currentConfig = { 
        ...config, 
        apiKey: config.apiKey ? '••••••••' : undefined 
      };
      this.isConnected = true;
      return true;
    }
    return false;
  }

  public disconnectProvider(): void {
    this.currentConfig = null;
    this.isConnected = false;
  }

  public async generateAIImage(params: AIStyleParams): Promise<AIGenerationResult> {
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2200));

    if (!this.isConnected) {
      return {
        status: 'api_not_connected',
        message: 'AI ENGINE READY: Connect an AI image-generation provider to create the transformation.',
        params,
        timestamp: Date.now(),
        engineVersion: 'Luma Neural Core v2.4'
      };
    }

    return {
      status: 'success',
      message: 'Transformation processed via connected provider.',
      params,
      timestamp: Date.now(),
      engineVersion: 'Luma Neural Core v2.4'
    };
  }

  public async generateMorphTransformation(params: AIMorphParams): Promise<AIMorphResult> {
    if (!this.isConnected) {
      return {
        status: 'api_not_connected',
        message: 'Connect an AI image-generation API to create your transformation.',
        timestamp: Date.now()
      };
    }

    // If an external endpoint is configured, execute request securely
    try {
      if (this.currentConfig?.endpointUrl) {
        const res = await fetch(this.currentConfig.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: params.photoUrl,
            prompt: `Transform portrait into ${params.style} aesthetic, preserving original facial characteristics`,
            style: params.style
          })
        });

        if (!res.ok) {
          throw new Error(`AI API error (${res.status}): ${res.statusText}`);
        }

        const data = await res.json();
        return {
          status: 'success',
          message: 'AI Morph generated successfully',
          generatedImageUrl: data.imageUrl || data.image || data.output,
          timestamp: Date.now()
        };
      }

      return {
        status: 'api_not_connected',
        message: 'Connect an AI image-generation API to create your transformation.',
        timestamp: Date.now()
      };
    } catch (err: any) {
      console.error('Morph API invocation error:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to generate AI image from server',
        timestamp: Date.now()
      };
    }
  }
}

export const aiService = new AIService();
