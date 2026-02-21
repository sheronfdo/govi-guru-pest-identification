import { ArrowLeft, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectPest: () => void;
}

interface HistoryItem {
  id: string;
  date: string;
  pestName: string;
  status: 'resolved' | 'pending' | 'monitoring';
  image: string;
}

export function HistoryScreen({ onBack, onSelectPest }: HistoryScreenProps) {
  const historyData: HistoryItem[] = [
    {
      id: '1',
      date: '12 Oct 2025',
      pestName: 'Brown Plant Hopper',
      status: 'resolved',
      image: 'hopper',
    },
    {
      id: '2',
      date: '8 Oct 2025',
      pestName: 'Rice Bug',
      status: 'monitoring',
      image: 'bug',
    },
    {
      id: '3',
      date: '3 Oct 2025',
      pestName: 'Stem Borer',
      status: 'resolved',
      image: 'borer',
    },
    {
      id: '4',
      date: '28 Sep 2025',
      pestName: 'Leaf Folder',
      status: 'resolved',
      image: 'folder',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-6 h-6" style={{ color: '#4CAF50' }} />;
      case 'monitoring':
        return <Clock className="w-6 h-6" style={{ color: '#FF9800' }} />;
      case 'pending':
        return <AlertCircle className="w-6 h-6" style={{ color: '#FF5722' }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return { text: 'Resolved', color: '#4CAF50' };
      case 'monitoring':
        return { text: 'Monitoring', color: '#FF9800' };
      case 'pending':
        return { text: 'Pending', color: '#FF5722' };
      default:
        return { text: status, color: '#666' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div className="px-4 py-4" style={{ backgroundColor: '#4CAF50' }}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="flex-1 text-center text-xl font-bold text-white">My Field History</h2>
          <div className="w-10" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold" style={{ color: '#4CAF50' }}>
                {historyData.filter((h) => h.status === 'resolved').length}
              </p>
              <p className="text-sm mt-1" style={{ color: '#666' }}>Resolved</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#FF9800' }}>
                {historyData.filter((h) => h.status === 'monitoring').length}
              </p>
              <p className="text-sm mt-1" style={{ color: '#666' }}>Monitoring</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#333' }}>
                {historyData.length}
              </p>
              <p className="text-sm mt-1" style={{ color: '#666' }}>Total Scans</p>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 px-6 pb-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: '#333' }}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {historyData.map((item) => {
            const statusInfo = getStatusText(item.status);
            return (
              <button
                key={item.id}
                onClick={() => onSelectPest()}
                className="w-full bg-white rounded-xl p-4 shadow-md flex items-center gap-4 transition-transform active:scale-98"
              >
                {/* Date Badge */}
                <div
                  className="w-16 h-16 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  <p className="text-xs font-semibold" style={{ color: '#999' }}>
                    {item.date.split(' ')[1]}
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#333' }}>
                    {item.date.split(' ')[0]}
                  </p>
                </div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <h4 className="text-base font-bold mb-1" style={{ color: '#333' }}>
                    {item.pestName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: statusInfo.color }}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(item.status)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
