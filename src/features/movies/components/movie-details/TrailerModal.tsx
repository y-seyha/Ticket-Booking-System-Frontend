import * as Dialog from "@radix-ui/react-dialog";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  youtubeId,
}: TrailerModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Dialog.Close className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              ✕
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
