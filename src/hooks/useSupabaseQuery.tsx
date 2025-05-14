
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

// Define as tabelas válidas para tipagem forte
type TableName = keyof Database['public']['Tables'];

interface QueryOptions<T> {
  tableName: TableName;
  column?: string;
  value?: any;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
}

export function useSupabaseQuery<T>({ 
  tableName, 
  column, 
  value, 
  orderBy,
  limit
}: QueryOptions<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Usamos as type assertions para garantir que o TypeScript entenda que tableName é válido
        let query = supabase.from(tableName as TableName).select('*');
        
        if (column && value !== undefined) {
          query = query.eq(column, value);
        }
        
        if (orderBy) {
          query = query.order(orderBy.column, { 
            ascending: orderBy.ascending ?? true 
          });
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data: result, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setData(result as T[]);
      } catch (err: any) {
        setError(err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: err.message || "Ocorreu um erro ao buscar os dados.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, column, value, orderBy, limit]);

  return { data, isLoading, error };
}
