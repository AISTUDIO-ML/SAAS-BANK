
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Waves, Clock, Pause, Play, Settings } from 'lucide-react';

interface SubscriptionCardProps {
  type: 'superfluid' | 'sablier';
  title: string;
  amount: string;
  token: string;
  status: 'active' | 'paused' | 'ended';
  progress?: number;
  streamRate?: string;
  endDate?: string;
}

const SubscriptionCard = ({
  type,
  title,
  amount,
  token,
  status,
  progress = 0,
  streamRate,
  endDate
}: SubscriptionCardProps) => {
  const StatusBadge = () => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      paused: { color: 'bg-yellow-100 text-yellow-800', text: 'Paused' },
      ended: { color: 'bg-gray-100 text-gray-800', text: 'Ended' }
    };

    const config = statusConfig[status];
    return <Badge className={`${config.color} border-none`}>{config.text}</Badge>;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {type === 'superfluid' ?
            <Waves className="h-5 w-5 text-blue-600" /> :

            <Clock className="h-5 w-5 text-purple-600" />
            }
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <StatusBadge />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{amount} {token}</p>
            {streamRate &&
            <p className="text-sm text-gray-500">{streamRate}/month</p>
            }
          </div>
        </div>
        
        {type === 'sablier' && progress !== undefined &&
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {endDate &&
          <p className="text-xs text-gray-500">Ends: {endDate}</p>
          }
          </div>
        }
        
        <div className="flex space-x-2 pt-2">
          {status === 'active' ?
          <Button variant="outline" size="sm" className="flex-1">
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button> :
          status === 'paused' ?
          <Button variant="outline" size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button> :
          null}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>);

};

export default SubscriptionCard;