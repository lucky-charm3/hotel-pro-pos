import  { useRef, useEffect } from 'react';
import { FaEllipsisV, FaEye, FaEdit, FaTrash,FaPrint } from 'react-icons/fa';

const iconMap = {
  print:FaPrint,
  view: FaEye,
  edit: FaEdit,
  delete: FaTrash
};

const colorMap = {
  view: 'text-blue-600 hover:bg-blue-50',
  edit: 'text-green-600 hover:bg-green-50',
  delete: 'text-red-600 hover:bg-red-50'
};

export default function ActionDropdown({ isOpen,setIsOpen,actions,triggerRef}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
      ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      >
        <FaEllipsisV />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            {actions.map((action, index) => {
              const IconComponent = iconMap[action.type];
              return (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${colorMap[action.type]}`}
                >
                  <IconComponent className="mr-3" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}