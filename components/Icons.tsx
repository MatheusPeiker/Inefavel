
import React from 'react';
import { LayoutGrid, Beaker, BookOpen, Megaphone } from 'lucide-react';

interface IconMapperProps {
  name: string;
  className?: string;
}

export const IconMapper: React.FC<IconMapperProps> = ({ name, className }) => {
  switch (name) {
    case 'layout-grid': return <LayoutGrid className={className} />;
    case 'beaker': return <Beaker className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    case 'megaphone': return <Megaphone className={className} />;
    default: return <LayoutGrid className={className} />;
  }
};
