import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router';
import { verificarEmpresa } from '@/services/empresa';

interface Props {
  children: React.ReactNode;
}

export function EmpresaGuard({ children }: Props) {
  const { empresa } = useParams();
  const [loading, setLoading] = useState(true);
  const [existe, setExiste] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const ok = await verificarEmpresa(empresa!);
      
      if (vivo) {
        setExiste(ok);
        setLoading(false);
      }
    })();
    return () => { vivo = false; };
  }, [empresa]);

  if (loading) return <div>Verificando empresa...</div>;
  if (!existe) return <Navigate to="/404" replace />;
  return <>{children}</>;
}