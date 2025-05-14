
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

// Define valid table names for strong typing
type TableName = keyof Database['public']['Tables'];

// Define a type that maps table names to their row types
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

interface QueryOptions<T extends TableName> {
  tableName: T;
  column?: string;
  value?: any;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
}

export function useSupabaseQuery<T extends TableName>({ 
  tableName, 
  column, 
  value, 
  orderBy,
  limit
}: QueryOptions<T>) {
  const [data, setData] = useState<TableRow<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase.from(tableName).select('*');
        
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
        
        // Use a type assertion with unknown as an intermediate step
        setData(result as unknown as TableRow<T>[]);
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
