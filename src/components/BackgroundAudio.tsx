import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackgroundAudio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Audio file from public folder
    const AUDIO_URL = "/bulan-hijriah.mp3";

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.error("Audio playback failed:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        // Attempt autoplay on mount
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.log("Autoplay blocked by browser policy:", error);
                    setIsPlaying(false);
                }
            }
        };

        playAudio();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio
                ref={audioRef}
                src={AUDIO_URL}
                loop
            />
            <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-primary/20"
                onClick={togglePlay}
                aria-label={isPlaying ? "Mute background music" : "Play background music"}
            >
                {isPlaying ? (
                    <Volume2 className="h-5 w-5 text-primary" />
                ) : (
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
            </Button>
        </div>
    );
};

export default BackgroundAudio;
