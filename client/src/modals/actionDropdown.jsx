import  { useRef, useEffect,useState } from 'react';
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
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen && triggerRef.current) {
  const triggerRect = triggerRef.current.getBoundingClientRect();
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const dropdownHeight = 200;
  
  if (spaceBelow < dropdownHeight) {
    setDropdownPosition('top');
  } else {
    setDropdownPosition('bottom');
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
        <div className={`absolute right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50
  ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
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