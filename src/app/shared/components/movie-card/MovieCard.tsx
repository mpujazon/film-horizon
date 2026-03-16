import { Star, Plus, Play } from "lucide-react";
import { ImageWithFallback } from "../../../../../../movies-draft/src/app/components/figma/ImageWithFallback";
import { Link } from "react-router";

export interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number;
  year?: string;
  genres?: string[];
}

export function MovieCard({ id, title, imageUrl, rating = 8.5, year = "2024", genres = ["Action"] }: MovieCardProps) {
  return (
    <div className="group relative w-full aspect-[4/5] bg-card rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-border/50">
      <ImageWithFallback
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/10">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end h-full">
        <div className="transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col h-full justify-end">
          <Link to={`/movie/${id}`} className="font-extrabold text-xl text-white line-clamp-2 leading-tight mb-2 drop-shadow-md hover:underline underline-offset-4">
            {title}
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-white/80 mb-5">
            <span className="bg-white/20 px-2 py-0.5 rounded-sm backdrop-blur-md">{year}</span>
            <span>•</span>
            <span className="truncate">{genres.join(", ")}</span>
          </div>

          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-95">
              <Play className="w-4 h-4 fill-current" />
              Trailer
            </button>
            <button className="flex-none p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
            </button>
            <Link
              to={`/movie/${id}`}
              className="flex-none rounded-xl border border-white/20 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/20"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
