import React, { useState } from 'react';
import { Video, Loader2, Upload, AlertCircle, Play } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const VideoPresentation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Um vídeo cinematográfico estilo comercial de TV apresentando um escritório moderno e tecnológico, com gráficos financeiros azuis flutuando no ar, iluminação suave e profissional.');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null); // Base64 without header for API
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [status, setStatus] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        // Extract base64 data without the data:image/xxx;base64, prefix
        const base64Data = result.split(',')[1];
        setRawImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVideo = async () => {
    if (!rawImage) {
      alert('Por favor, selecione uma imagem de referência primeiro.');
      return;
    }

    try {
      setLoading(true);
      setVideoUrl(null);
      setStatus('Verificando chave de API...');

      // 1. API Key Check for IDX environment, falls back to env var for Vercel
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
        const hasKey = await aiStudio.hasSelectedApiKey();
        if (!hasKey) {
            await aiStudio.openSelectKey();
        }
      }

      setStatus('Iniciando geração com Veo (isso pode levar alguns minutos)...');

      // 2. Initialize Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 3. Start Operation
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: rawImage,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      // 4. Poll for results
      let attempts = 0;
      while (!operation.done) {
        attempts++;
        setStatus(`Renderizando vídeo... (Aguardando ${attempts * 5}s)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      // 5. Fetch Result
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (!downloadLink) {
        throw new Error("Falha ao obter link do vídeo gerado.");
      }

      setStatus('Baixando vídeo finalizado...');
      
      // The response body contains the MP4 bytes. Must append API key.
      const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const videoBlob = await videoResponse.blob();
      const localVideoUrl = URL.createObjectURL(videoBlob);
      
      setVideoUrl(localVideoUrl);
      setStatus('Concluído!');

    } catch (error) {
      console.error(error);
      setStatus(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white no-print mt-8 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Gerar Vídeo de Apresentação</h2>
          <p className="text-slate-400 text-sm">Crie um vídeo promocional usando IA (Veo)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">1. Imagem de Referência (Logo ou Print)</label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors bg-slate-800/50">
              {selectedImage ? (
                <div className="relative">
                  <img src={selectedImage} alt="Preview" className="max-h-40 mx-auto rounded shadow-sm" />
                  <button 
                    onClick={() => { setSelectedImage(null); setRawImage(null); }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <span className="text-sm text-slate-400">Clique para enviar imagem</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">2. Descrição do Vídeo (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 rounded-md border-slate-600 bg-slate-800 text-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              placeholder="Descreva como você quer que o vídeo seja..."
            />
          </div>

          <button
            onClick={generateVideo}
            disabled={loading || !rawImage}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              loading || !rawImage
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{status || 'Processando...'}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Gerar Vídeo com IA</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-slate-500">
            *Requer chave de API paga do Google Cloud. Configure API_KEY nas variáveis de ambiente.
          </p>
        </div>

        {/* Preview Area */}
        <div className="bg-black/50 rounded-lg flex items-center justify-center min-h-[300px] border border-slate-700 overflow-hidden">
          {videoUrl ? (
            <video 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-contain"
              src={videoUrl}
            />
          ) : (
            <div className="text-center text-slate-500 p-8">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm animate-pulse">{status}</p>
                </div>
              ) : (
                <>
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>O vídeo gerado aparecerá aqui</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};