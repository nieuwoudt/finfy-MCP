import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/atoms/Badge';

interface SavingsRecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    amountFound: number;
    category: string;
    imageUrl?: string;
    ctaUrl?: string;
  };
  onAction?: () => void;
}

const SavingsRecommendationCard: React.FC<SavingsRecommendationCardProps> = ({
  recommendation,
  onAction
}) => {
  const formattedAmount = formatCurrency(recommendation.amountFound);
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header with image if available */}
      {recommendation.imageUrl && (
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          <img
            src={recommendation.imageUrl}
            alt={recommendation.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <Badge size="sm" variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
            {recommendation.category}
          </Badge>
        </div>
        
        <h3 className="text-lg font-medium mb-1">{recommendation.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">Potential savings</div>
          <div className="text-lg font-semibold text-green-600">{formattedAmount}</div>
        </div>
        
        {/* Action button */}
        {recommendation.ctaUrl ? (
          <a
            href={recommendation.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 text-center bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            onClick={(e) => {
              if (onAction) {
                e.preventDefault();
                onAction();
              }
            }}
          >
            Learn more
          </a>
        ) : (
          <button
            onClick={onAction}
            className="block w-full py-2 px-4 text-center bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Learn more
          </button>
        )}
      </div>
    </div>
  );
};

export default SavingsRecommendationCard; 