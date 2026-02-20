import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, MessageCircle, Bug, Clock } from 'lucide-react';
import { Link } from 'react-router';

interface DashboardProps {
  officerData: {
    name: string;
    region: string;
  };
}

export default function Dashboard({ officerData }: DashboardProps) {
  const summaryData = [
    {
      title: 'Pending Verifications',
      count: 12,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: '/verification'
    },
    {
      title: 'Farmer Queries',
      count: 8,
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/inbox'
    },
    {
      title: 'Active Pest Alerts',
      count: 5,
      icon: Bug,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      link: '/verification'
    },
  ];

  const recentActivity = [
    {
      farmer: 'Sunil Perera',
      action: 'reported Brown Planthopper',
      time: '10 mins ago',
      status: 'pending'
    },
    {
      farmer: 'Nimal Silva',
      action: 'verified Rice Blast diagnosis',
      time: '25 mins ago',
      status: 'completed'
    },
    {
      farmer: 'Kamala Jayawardena',
      action: 'requested consultation for leaf damage',
      time: '1 hour ago',
      status: 'pending'
    },
    {
      farmer: 'Ranjan Fernando',
      action: 'uploaded new pest photos',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      farmer: 'Priyanka Wijesinghe',
      action: 'completed treatment for Fall Armyworm',
      time: '3 hours ago',
      status: 'completed'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Welcome, {officerData.name}</h1>
        <p className="text-[#455A64]">Region: {officerData.region}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={index} to={item.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <Icon className={`size-5 ${item.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{item.count}</span>
                    <Badge
                      variant={index === 0 ? 'destructive' : index === 1 ? 'default' : 'secondary'}
                      className={
                        index === 0
                          ? 'bg-red-500'
                          : index === 1
                          ? 'bg-[#1976D2]'
                          : 'bg-yellow-500'
                      }
                    >
                      Requires Action
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    <span>{activity.farmer}</span>{' '}
                    <span className="text-[#455A64]">{activity.action}</span>
                  </p>
                  <p className="text-xs text-[#455A64] mt-1">{activity.time}</p>
                </div>
                <Badge
                  variant={activity.status === 'completed' ? 'secondary' : 'default'}
                  className={
                    activity.status === 'completed'
                      ? 'bg-[#4CAF50] hover:bg-[#45a049]'
                      : 'bg-[#1976D2] hover:bg-[#1565C0]'
                  }
                >
                  {activity.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl">127</p>
            <p className="text-sm text-[#455A64] mt-1">Total Farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl">95%</p>
            <p className="text-sm text-[#455A64] mt-1">Verification Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl">48</p>
            <p className="text-sm text-[#455A64] mt-1">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl">2.3h</p>
            <p className="text-sm text-[#455A64] mt-1">Avg Response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}