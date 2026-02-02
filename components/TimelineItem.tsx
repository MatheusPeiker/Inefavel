
import React from 'react';
import { Service } from '../types';
import { IconMapper } from './Icons';

interface TimelineItemProps {
  service: Service;
  isEven: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ service, isEven }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full group">
      {/* Content - Desktop Right if Even, Left if Odd */}
      <div className={`lg:w-[45%] flex flex-col gap-3 order-2 ${isEven ? 'lg:order-3 lg:items-start' : 'lg:order-1 lg:items-end lg:text-right'} mt-6 lg:mt-0 items-center text-center lg:text-left`}>
        <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
          <span className="animate-pulse">*</span> {service.category}
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold serif-font text-text-main">{service.title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {service.description}
        </p>
        <div className="flex gap-2 mt-4">
          {service.tags.map(tag => (
            <span key={tag} className="px-4 py-1 border border-primary/20 rounded-full text-[10px] uppercase font-bold text-primary bg-primary/5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Center Icon Circle */}
      <div className="hidden lg:flex z-10 size-12 rounded-full bg-off-white border border-primary shadow-lg items-center justify-center order-2 transition-transform duration-500 group-hover:scale-110">
        <IconMapper name={service.icon} className="text-primary text-xl w-5 h-5" />
      </div>

      {/* Image - Desktop Left if Even, Right if Odd */}
      <div className={`lg:w-[45%] order-1 ${isEven ? 'lg:order-1' : 'lg:order-3'}`}>
        <img 
          alt={service.title} 
          className="w-full h-48 lg:h-64 object-cover rounded-xl opacity-80 group-hover:opacity-100 group-hover:shadow-2xl transition-all duration-500" 
          src={service.imageUrl}
        />
      </div>
    </div>
  );
};

export default TimelineItem;
