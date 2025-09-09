import { notFound } from 'next/navigation';
import { getPasteByShortUrl } from '@/lib/database';
import { PasteViewer } from '@/components/PasteViewer';
import { Metadata } from 'next';

interface PastePageProps {
    params: {
        shortUrl: string;
    };
}

export async function generateMetadata({ params }: PastePageProps): Promise<Metadata> {
    const paste = await getPasteByShortUrl(params.shortUrl);

    if (!paste) {
        return {
            title: 'Paste Not Found',
            description: 'The requested paste could not be found or has expired.',
        };
    }

    return {
        title: paste.title || 'Code Paste',
        description: `A ${paste.language} code snippet shared on Secure Code Editor`,
        openGraph: {
            title: paste.title || 'Code Paste',
            description: `A ${paste.language} code snippet`,
            type: 'article',
        },
    };
}

export default async function PastePage({ params }: PastePageProps) {
    const paste = await getPasteByShortUrl(params.shortUrl);

    if (!paste) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-7xl p-4">
            <PasteViewer paste={paste} />
        </div>
    );
}
