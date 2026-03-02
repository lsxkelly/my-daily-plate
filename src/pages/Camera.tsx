import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Camera = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      setError('无法访问相机，请检查权限设置');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setStreaming(false);
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.8);
    stopCamera();
    navigate('/result', { state: { imageData: dataUrl } });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigate('/result', { state: { imageData: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-10 pb-3">
        <button onClick={() => { stopCamera(); navigate(-1); }} className="text-background text-sm">
          ← 返回
        </button>
        <h1 className="flex-1 text-center text-background font-semibold">拍照记录</h1>
        <div className="w-10" />
      </div>

      {/* Camera Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        {!streaming && !error && (
          <div className="text-center animate-fade-in">
            <div className="w-32 h-32 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📸</span>
            </div>
            <p className="text-background/70 text-sm mb-6">拍摄食物照片，AI 帮你识别热量</p>
            <button
              onClick={startCamera}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium active:scale-95 transition-transform"
            >
              打开相机
            </button>
          </div>
        )}

        {error && (
          <div className="text-center animate-fade-in">
            <p className="text-destructive text-sm mb-4">{error}</p>
            <p className="text-background/50 text-xs">你也可以从相册选择图片</p>
          </div>
        )}

        {streaming && (
          <div className="w-full max-w-sm animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="bg-foreground/60 text-background text-xs px-3 py-1 rounded-full">
                  📐 可将拳头放入画面作为参照
                </span>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 px-8 pb-8 pt-4 safe-bottom">
        {streaming ? (
          <button
            onClick={takePhoto}
            className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base active:scale-[0.97] transition-transform"
          >
            📷 拍照
          </button>
        ) : (
          <div className="flex-1" />
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-background/10 text-background py-4 rounded-xl font-semibold text-base border border-background/20 active:scale-[0.97] transition-transform"
        >
          🖼 相册
        </button>
      </div>
    </div>
  );
};

export default Camera;
