import JSZip from 'jszip';
import { toast } from 'sonner';
import { Poster } from '@/types/poster';

export const downloadPosterZip = async (
  poster: Poster,
  isCompleted: boolean,
  onMarkCompleted: (id: number) => void,
  onStartProgress?: () => void,
  onEndProgress?: () => void
) => {
  if (onStartProgress) onStartProgress();
  const toastId = toast.loading(`Fetching screens for ${poster.title}...`);
  try {
    const zip = new JSZip();
    const images = poster.images || [poster.image];
    
    const fetchPromises = images.map(async (imgUrl, index) => {
      const response = await fetch(imgUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${imgUrl}`);
      const blob = await response.blob();
      const ext = imgUrl.split('.').pop() || 'png';
      const fileName = `screen-${index + 1}.${ext}`;
      zip.file(fileName, blob);
    });

    await Promise.all(fetchPromises);
    
    toast.loading('Generating ZIP package...', { id: toastId });
    const content = await zip.generateAsync({ type: 'blob' });
    
    const zipName = `${poster.title.toLowerCase().replace(/\s+/g, '-')}-assets.zip`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast.success('Download completed successfully!', { id: toastId });
  } catch (error) {
    console.error('Error generating zip:', error);
    toast.error('Failed to package images into ZIP.', { id: toastId });
  } finally {
    if (onEndProgress) onEndProgress();
  }
};
