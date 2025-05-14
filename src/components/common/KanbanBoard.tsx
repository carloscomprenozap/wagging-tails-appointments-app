
import React from 'react';

interface Column<T> {
  id: string;
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

interface KanbanBoardProps<T> {
  columns: Column<T>[];
}

function KanbanBoard<T>({ columns }: KanbanBoardProps<T>) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-full max-w-xs md:w-72"
        >
          <div className="bg-gray-100 rounded-lg p-2">
            <h3 className="font-medium text-sm py-2 px-2 bg-white rounded-md shadow-sm">
              {column.title}
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {column.items.length}
              </span>
            </h3>
            <div className="mt-3 space-y-3">
              {column.items.map((item, index) => (
                <div key={index}>{column.renderItem(item)}</div>
              ))}
              {column.items.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500">
                  Nenhum item nesta coluna
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
