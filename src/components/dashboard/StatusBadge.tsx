import { getStatusInfo } from '@/constants/statusCadastro';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusInfo = getStatusInfo(status);
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.corBg} border ${statusInfo.corBorda}`}>
      <span className="text-sm">{statusInfo.icone}</span>
      <span className={`text-sm font-medium ${statusInfo.corTexto}`}>
        {statusInfo.label}
      </span>
    </div>
  );
}
