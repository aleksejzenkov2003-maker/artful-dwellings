import { ExternalLink } from "lucide-react";

// Source icons as simple SVG components
const YandexIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15h-2V7h2.5c2.5 0 4 1.5 4 3.5 0 1.5-.8 2.7-2 3.2l2.5 3.3h-2.3L12.5 14h-.5v3zm0-5h.5c1.1 0 2-.6 2-1.5S15.1 9 14 9h-.5v3z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const CianIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" fill="#0468FF"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">C</text>
  </svg>
);

const AvitoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" fill="#00AAFF"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
  </svg>
);

const DomClickIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" fill="#BA846E"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">D</text>
  </svg>
);

export const getSourceIcon = (source: string | null) => {
  switch (source?.toLowerCase()) {
    case 'yandex':
      return <YandexIcon />;
    case 'google':
      return <GoogleIcon />;
    case 'cian':
      return <CianIcon />;
    case 'avito':
      return <AvitoIcon />;
    case 'domclick':
      return <DomClickIcon />;
    default:
      return null;
  }
};

export const getSourceLabel = (source: string | null) => {
  switch (source?.toLowerCase()) {
    case 'yandex':
      return 'Яндекс Карты';
    case 'google':
      return 'Google Maps';
    case 'cian':
      return 'ЦИАН';
    case 'avito':
      return 'Авито';
    case 'domclick':
      return 'ДомКлик';
    default:
      return null;
  }
};

interface ReviewSourceBadgeProps {
  source: string | null;
  sourceUrl?: string | null;
  variant?: 'default' | 'compact';
}

export function ReviewSourceBadge({ source, sourceUrl, variant = 'default' }: ReviewSourceBadgeProps) {
  if (!source) return null;

  const icon = getSourceIcon(source);
  const label = getSourceLabel(source);

  if (!icon || !label) return null;

  const baseClasses = variant === 'compact'
    ? "inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground"
    : "inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground";

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} hover:bg-muted hover:text-foreground transition-colors group`}
      >
        {icon}
        <span>{variant === 'compact' ? label : `Отзыв на ${label}`}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    );
  }

  return (
    <div className={baseClasses}>
      {icon}
      <span>{variant === 'compact' ? label : `Отзыв с ${label}`}</span>
    </div>
  );
}
