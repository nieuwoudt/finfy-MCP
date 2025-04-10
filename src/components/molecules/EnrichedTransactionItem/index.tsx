import React from 'react';
import { Badge } from '@/components/atoms/Badge';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

interface EnrichedTransactionItemProps {
  transaction: {
    id: string;
    date: string;
    amount: {
      amount: number;
      currency: string;
    };
    description: {
      original: string;
      simple?: string;
    };
    merchant?: {
      name: string;
      logo?: string;
    };
    category?: string;
    subcategory?: string;
    tags?: string[];
  };
  onSelect?: (transactionId: string) => void;
}

const EnrichedTransactionItem: React.FC<EnrichedTransactionItemProps> = ({ 
  transaction,
  onSelect
}) => {
  const isNegative = transaction.amount.amount < 0;
  const formattedAmount = formatCurrency(Math.abs(transaction.amount.amount), transaction.amount.currency);
  const formattedDate = format(new Date(transaction.date), 'MMM d, yyyy');
  
  // Use merchant name if available, otherwise use simple description or original description
  const displayName = transaction.merchant?.name || 
    transaction.description.simple || 
    transaction.description.original;
    
  // Normalize category and subcategory for display
  const displayCategory = transaction.category || 'Uncategorized';
  const displaySubcategory = transaction.subcategory || '';
  
  return (
    <div 
      className="flex flex-col p-4 border rounded-lg mb-2 bg-white hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect && onSelect(transaction.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          {transaction.merchant?.logo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={transaction.merchant.logo} 
                alt={transaction.merchant.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
            {isNegative ? '-' : '+'}{formattedAmount}
          </p>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
          {displayCategory}
        </Badge>
        
        {displaySubcategory && (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            {displaySubcategory}
          </Badge>
        )}
        
        {transaction.tags && transaction.tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EnrichedTransactionItem; 