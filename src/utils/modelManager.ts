
import { pipeline, Pipeline } from '@huggingface/transformers';

class ModelManager {
  private static instance: ModelManager;
  private captionModel: Pipeline | null = null;
  private isLoading = false;
  private loadingPromise: Promise<Pipeline> | null = null;

  private constructor() {}

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async preloadModel(): Promise<Pipeline> {
    if (this.captionModel) {
      return this.captionModel;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.isLoading = true;
    this.loadingPromise = this.loadModel();
    
    try {
      this.captionModel = await this.loadingPromise;
      return this.captionModel;
    } finally {
      this.isLoading = false;
      this.loadingPromise = null;
    }
  }

  private async loadModel(): Promise<Pipeline> {
    // Using a smaller, faster model for better performance
    return await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', {
      // Enable caching and optimize for performance
      cache_dir: '.cache',
      local_files_only: false,
      revision: 'main'
    });
  }

  async generateCaption(imageData: string): Promise<string> {
    if (!this.captionModel) {
      await this.preloadModel();
    }

    if (!this.captionModel) {
      throw new Error('Model failed to load');
    }

    const result = await this.captionModel(imageData);
    
    // Handle different result types
    let generatedCaption = '';
    
    if (Array.isArray(result) && result.length > 0) {
      const firstResult = result[0];
      if (firstResult && typeof firstResult === 'object' && firstResult !== null) {
        generatedCaption = (firstResult as Record<string, any>).generated_text || '';
      }
    } else if (result && typeof result === 'object' && result !== null) {
      generatedCaption = (result as Record<string, any>).generated_text || '';
    }

    return generatedCaption;
  }

  isModelLoading(): boolean {
    return this.isLoading;
  }

  isModelLoaded(): boolean {
    return this.captionModel !== null;
  }
}

export const modelManager = ModelManager.getInstance();
