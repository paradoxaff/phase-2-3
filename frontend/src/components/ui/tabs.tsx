import * as React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className, children }) => {
  const contextValue = React.useMemo(() => ({
    value,
    onValueChange
  }), [value, onValueChange]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...child.props });
          }
          return child;
        })}
      </div>
    </TabsContext.Provider>
  );
};

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={`flex ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...child.props });
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs');
  }

  const isSelected = context.value === value;

  return (
    <button
      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
        isSelected
          ? "bg-white text-red-600 shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      } ${className}`}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs');
  }

  const isVisible = context.value === value;

  if (!isVisible) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };