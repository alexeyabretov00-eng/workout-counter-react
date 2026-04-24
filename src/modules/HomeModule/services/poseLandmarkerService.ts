import type { NormalizedLandmark, PoseLandmarker } from '@mediapipe/tasks-vision';
import type { PoseFrame, PoseLandmarks } from '@utils';

const MODEL_ASSET_PATH =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task';
const MODEL_ASSET_PATH_LITE =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';

export class PoseLandmarkerService {
  private landmarker: PoseLandmarker | null = null;

  async init(onProgress?: (percent: number) => void): Promise<void> {
    if (this.landmarker) {
      return;
    }

    const { FilesetResolver, PoseLandmarker: PoseLandmarkerCtor } =
      await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
    try {
      const modelAssetBuffer = await this.fetchModelBufferWithProgress(
        MODEL_ASSET_PATH,
        onProgress,
      );
      this.landmarker = await PoseLandmarkerCtor.createFromOptions(fileset, {
        baseOptions: {
          modelAssetBuffer,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    } catch {
      // Some browsers/devices may not support GPU delegate.
      const modelAssetBuffer = await this.fetchModelBufferWithProgress(
        MODEL_ASSET_PATH_LITE,
        onProgress,
      );
      this.landmarker = await PoseLandmarkerCtor.createFromOptions(fileset, {
        baseOptions: {
          modelAssetBuffer,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    }
  }

  detect(video: HTMLVideoElement, timestampMs: number): PoseFrame {
    if (!this.landmarker) {
      return { landmarks: null, timestampMs };
    }

    const result = this.landmarker.detectForVideo(video, timestampMs);
    const landmarks = result.landmarks[0] ? this.normalize(result.landmarks[0]) : null;

    return {
      landmarks,
      timestampMs,
    };
  }

  stop(): void {}

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
  }

  private normalize(landmarks: NormalizedLandmark[]): PoseLandmarks {
    return landmarks.map(point => ({
      x: point.x,
      y: point.y,
      z: point.z,
      visibility: point.visibility ?? 0,
      presence: point.visibility ?? 0,
    }));
  }

  private async fetchModelBufferWithProgress(
    modelAssetPath: string,
    onProgress?: (percent: number) => void,
  ): Promise<Uint8Array> {
    const response = await fetch(modelAssetPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch model file: ${response.status}`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    const total = contentLengthHeader ? Number(contentLengthHeader) : 0;
    if (!response.body || total <= 0) {
      const buffer = new Uint8Array(await response.arrayBuffer());
      onProgress?.(100);
      return buffer;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        chunks.push(value);
        loaded += value.length;
        const progress = Math.min(100, Math.round((loaded / total) * 100));
        onProgress?.(progress);
      }
    }

    const merged = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    onProgress?.(100);
    return merged;
  }
}
