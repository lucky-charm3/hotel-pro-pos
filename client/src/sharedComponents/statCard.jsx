const colorClasses = {
  success: 'bg-success/20 text-success',
  danger: 'bg-danger/20 text-danger',
  info: 'bg-info/20 text-info',
  warning: 'bg-warning/20 text-warning',
};

export default function StatCard({ title, value, icon, color = 'success' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}