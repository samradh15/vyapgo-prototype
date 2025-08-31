'use client';

import { AudioVisualizationData, VoiceRecordingConfig, VoiceRecordingState } from "@/types/vani.types";

export class AdvancedVoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private visualizationCallback: ((data: AudioVisualizationData) => void) | null = null;
  private config: VoiceRecordingConfig;

  constructor(config: Partial<VoiceRecordingConfig> = {}) {
    this.config = {
      sampleRate: 44100,
      channels: 1,
      bitRate: 256,
      format: 'webm',
      maxDuration: 300, // 5 minutes
      chunkSize: 100,
      noiseReduction: true,
      echoCancellation: true,
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      // Request high-quality audio permissions
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          echoCancellation: this.config.echoCancellation,
          noiseSuppression: this.config.noiseReduction,
          autoGainControl: true
        }
      });

      // Setup audio context for visualization
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.config.sampleRate
      });

      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 2048;
      this.analyzer.smoothingTimeConstant = 0.8;

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyzer);

      // Setup MediaRecorder with optimal settings
      const mimeType = this.getBestMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: this.config.bitRate * 1000
      });

      this.setupEventListeners();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Voice recorder initialization failed: ${error.message}`);
      } else {
        throw new Error('Voice recorder initialization failed: Unknown error');
      }
    }
  }

  private getBestMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/webm',
      'audio/mp4'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'audio/webm'; // Fallback
  }

  private setupEventListeners(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { 
        type: this.mediaRecorder?.mimeType || 'audio/webm' 
      });
      this.onRecordingComplete?.(blob);
      this.chunks = [];
    };

    this.mediaRecorder.onerror = (event) => {
      this.onError?.(new Error(`Recording error: ${event.error}`));
    };
  }

  startRecording(): void {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'inactive') {
      throw new Error('Recorder not ready or already recording');
    }

    this.chunks = [];
    this.mediaRecorder.start(this.config.chunkSize);
    this.startVisualization();
    this.onStateChange?.('recording');
  }

  pauseRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause();
      this.stopVisualization();
      this.onStateChange?.('paused');
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume();
      this.startVisualization();
      this.onStateChange?.('recording');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.stopVisualization();
      this.onStateChange?.('processing');
    }
  }

  private startVisualization(): void {
    if (!this.analyzer || !this.visualizationCallback) return;

    const bufferLength = this.analyzer.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    const updateVisualization = () => {
      if (this.mediaRecorder?.state !== 'recording') return;

      this.analyzer!.getByteFrequencyData(frequencyData);
      this.analyzer!.getByteTimeDomainData(timeData);

      const volume = this.calculateVolume(timeData);
      const pitch = this.calculatePitch(frequencyData);
      const clarity = this.calculateClarity(frequencyData);

      this.visualizationCallback!({
        frequencyData: frequencyData.slice(),
        timeData: timeData.slice(),
        volume,
        pitch,
        clarity,
        timestamp: Date.now()
      });

      requestAnimationFrame(updateVisualization);
    };

    requestAnimationFrame(updateVisualization);
  }

  private stopVisualization(): void {
    // Visualization stops automatically when recording stops
  }

  private calculateVolume(timeData: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) {
      const amplitude = (timeData[i] - 128) / 128;
      sum += amplitude * amplitude;
    }
    return Math.sqrt(sum / timeData.length);
  }

  private calculatePitch(frequencyData: Uint8Array): number {
    let maxIndex = 0;
    let maxValue = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }
    
    return (maxIndex * this.config.sampleRate) / (2 * frequencyData.length);
  }

  private calculateClarity(frequencyData: Uint8Array): number {
    const total = frequencyData.reduce((sum, value) => sum + value, 0);
    const average = total / frequencyData.length;
    
    let variance = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      variance += Math.pow(frequencyData[i] - average, 2);
    }
    
    return Math.sqrt(variance / frequencyData.length) / 255;
  }

  setVisualizationCallback(callback: (data: AudioVisualizationData) => void): void {
    this.visualizationCallback = callback;
  }

  cleanup(): void {
    this.stopRecording();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    this.mediaRecorder = null;
    this.audioContext = null;
    this.analyzer = null;
    this.source = null;
    this.stream = null;
  }

  // Event handlers (to be set by the component)
  onStateChange?: (state: VoiceRecordingState['status']) => void;
  onRecordingComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}
